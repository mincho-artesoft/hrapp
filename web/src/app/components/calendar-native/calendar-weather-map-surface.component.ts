import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NgZone,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { CalendarAppleMapsService } from '../../core/calendar-apple-maps.service';
import {
  MapField,
  MapLayer,
  MapLocation,
  MapViewport,
  clamp,
  latitudeAt,
  mapColor,
  gridCoversViewport,
  mapFrame,
  mapReading,
  worldX,
  worldY,
} from '../../core/weather-map-field';

type Point = { x: number; y: number };
type Ring = { points: Point[]; west: number; east: number; north: number; south: number };
type Coordinates = [number, number];
let boundaries: Promise<Ring[]> | undefined;

function loadBoundaries() {
  return (boundaries ??= fetch('/weather-map/WeatherMapBoundaries.geojson')
    .then(async (response) => {
      if (!response.ok) throw Error('Boundary map unavailable');
      const data = (await response.json()) as {
        features: {
          geometry:
            | { type: 'Polygon'; coordinates: Coordinates[][] }
            | { type: 'MultiPolygon'; coordinates: Coordinates[][][] };
        }[];
      };
      return data.features.flatMap(({ geometry }) =>
        (geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates).flatMap((polygon) =>
          polygon.map((line) => {
            const points = line.map(([lon, lat]) => ({ x: worldX(lon), y: worldY(lat) }));
            return {
              points,
              west: Math.min(...points.map((p) => p.x)),
              east: Math.max(...points.map((p) => p.x)),
              north: Math.min(...points.map((p) => p.y)),
              south: Math.max(...points.map((p) => p.y)),
            };
          })
        )
      );
    })
    .catch((e) => {
      boundaries = undefined;
      throw e;
    }));
}

@Component({
  selector: 'cc-weather-map-surface',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ` <div #base class="base"></div>
    <canvas #heat class="heat" aria-hidden="true"></canvas>
    <canvas #outlines class="outlines" aria-hidden="true"></canvas>
    <canvas #flow class="flow" aria-hidden="true"></canvas>
    <div class="marker" [style.left.%]="pin().x * 100" [style.top.%]="pin().y * 100"><ng-content /></div>`,
  styles: [
    `
      :host {
        display: block;
        position: absolute;
        inset: 0;
        overflow: hidden;
        isolation: isolate;
        background: #17222b;
      }
      :host(.interactive) {
        touch-action: none;
        cursor: grab;
      }
      :host(.interactive):active {
        cursor: grabbing;
      }
      .base,
      canvas {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        display: block;
      }
      :host(.interactive) .base {
        filter: grayscale(1) brightness(0.758) contrast(2.64);
      }
      canvas {
        pointer-events: none;
      }
      .heat {
        mix-blend-mode: screen;
        opacity: 0.72;
      }
      :host(.interactive) .heat {
        opacity: 0.98;
      }
      .marker {
        position: absolute;
        width: 0;
        height: 0;
        overflow: visible;
      }
    `,
  ],
  host: {
    '[class.interactive]': 'interactive()',
    '(pointerdown)': 'pointerDown($event)',
    '(pointermove)': 'pointerMove($event)',
    '(pointerup)': 'pointerUp($event)',
    '(pointercancel)': 'pointerCancel($event)',
    '(dblclick)': 'doubleClick($event)',
    '(keydown)': 'key($event)',
  },
})
export class CalendarWeatherMapSurfaceComponent {
  readonly place = input.required<MapLocation>();
  readonly interactive = input(false);
  readonly animated = input(true);
  readonly field = input<MapField | null>(null);
  readonly layer = input<MapLayer>('wind');
  readonly position = input(0);
  readonly viewportChange = output<MapViewport>();
  readonly mapTap = output<void>();
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly maps = inject(CalendarAppleMapsService);
  private readonly zone = inject(NgZone);
  private readonly base = viewChild.required<ElementRef<HTMLDivElement>>('base');
  private readonly heat = viewChild.required<ElementRef<HTMLCanvasElement>>('heat');
  private readonly outlines = viewChild.required<ElementRef<HTMLCanvasElement>>('outlines');
  private readonly flow = viewChild.required<ElementRef<HTMLCanvasElement>>('flow');
  private readonly size = signal({ w: 1, h: 1 });
  private readonly measured = computed(() => this.size().w > 1 && this.size().h > 1);
  private readonly camera = signal<{ x: number; y: number; zoom: number } | null>(null);
  private readonly rings = signal<Ring[]>([]);
  private readonly map = signal<mapkit.Map | null>(null);
  private readonly visible = signal(false);
  private readonly reduceMotion = signal(false);
  private points = new Map<number, Point>();
  private pressed?: Point;
  private moved = false;
  readonly viewport = computed(() => {
    const p = this.place(),
      { w, h } = this.size(),
      full = this.interactive(),
      c = this.camera();
    const ys = worldY(p.latitude - (full ? 3 : 2.5)) - worldY(p.latitude + (full ? 3 : 2.5));
    const width = clamp(Math.max((full ? 4 : 7) / 360, (ys * w) / h) * (c?.zoom ?? 1), Math.min(0.001, w / h), Math.min(1, w / h));
    const height = (width * h) / w;
    const x = c?.x ?? worldX(p.longitude),
      y = c?.y ?? worldY(p.latitude);
    return {
      x: x - width / 2,
      y: clamp(y - height / 2, Math.min(0, 1 - height), Math.max(0, 1 - height)),
      width,
      height,
    };
  });
  readonly pin = computed(() => {
    const p = this.place(),
      v = this.viewport(),
      dx = worldX(p.longitude) - (v.x + v.width / 2);
    return { x: 0.5 + (dx - Math.round(dx)) / v.width, y: (worldY(p.latitude) - v.y) / v.height };
  });
  private readonly frame = computed(() => {
    const f = this.field();
    return f && gridCoversViewport(f.grid, this.viewport()) ? mapFrame(f, this.position()) : null;
  });

  constructor() {
    effect((cleanup) => {
      const host = this.el.nativeElement;
      const resize = new ResizeObserver(([entry]) => {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) this.size.set({ w: width, h: height });
      });
      resize.observe(host);
      const observer = new IntersectionObserver(([entry]) => this.visible.set(entry.isIntersecting));
      observer.observe(host);
      const media = matchMedia('(prefers-reduced-motion: reduce)');
      const motion = () => this.reduceMotion.set(media.matches);
      motion();
      media.addEventListener('change', motion);
      const wheel = (e: WheelEvent) => {
        if (!this.interactive()) return;
        e.preventDefault();
        const r = host.getBoundingClientRect();
        this.zoom(
          Math.exp(clamp(e.deltaY * (e.deltaMode === 1 ? 16 : 1), -240, 240) * 0.003),
          (e.clientX - r.left) / r.width,
          (e.clientY - r.top) / r.height
        );
      };
      host.addEventListener('wheel', wheel, { passive: false });
      let alive = true;
      void loadBoundaries()
        .then((r) => {
          if (alive) this.rings.set(r);
        })
        .catch(() => {});
      cleanup(() => {
        alive = false;
        resize.disconnect();
        observer.disconnect();
        media.removeEventListener('change', motion);
        host.removeEventListener('wheel', wheel);
      });
    });
    effect((cleanup) => {
      const base = this.base().nativeElement;
      let alive = true,
        map: mapkit.Map | undefined;
      if (this.measured() && this.maps.available)
        void this.maps
          .load()
          .then((kit) => {
            if (!alive) return;
            map = new kit.Map(base, {
              colorScheme: 'dark',
              isZoomEnabled: false,
              isScrollEnabled: false,
              isRotationEnabled: false,
              showsZoomControl: false,
              showsCompass: kit.FeatureVisibility.Hidden,
              showsScale: kit.FeatureVisibility.Hidden,
              showsMapTypeControl: false,
              showsUserLocationControl: false,
              showsPointsOfInterest: false,
              visibleMapRect: this.kitRect(kit, this.viewport()),
            });
            this.map.set(map);
          })
          .catch(() => {});
      cleanup(() => {
        alive = false;
        map?.destroy();
      });
    });
    effect(() => {
      this.place();
      this.recenter();
    });
    effect(() => {
      const v = this.viewport(),
        m = this.map();
      if (m) m.setVisibleMapRectAnimated(this.kitRect(mapkit, v), false);
      if (this.measured()) this.viewportChange.emit(v);
    });
    effect(() => {
      const el = this.heat().nativeElement,
        { w, h } = this.size(),
        view = this.viewport(),
        layer = this.layer(),
        grid = this.field()?.grid,
        frame = this.frame();
      const scale = Math.min(1, 176 / Math.max(w, h));
      el.width = Math.max(1, Math.round(w * scale));
      el.height = Math.max(1, Math.round(h * scale));
      const ctx = el.getContext('2d');
      if (!ctx || !frame || !grid) return;
      const pixels = ctx.createImageData(el.width, el.height);
      const max = layer === 'wind' ? 160 : 55,
        min = layer === 'wind' ? 0 : -40;
      const palette = Array.from({ length: 256 }, (_, i) => mapColor(min + ((max - min) * i) / 255, layer));
      for (let y = 0; y < el.height; y++) {
        const lat = latitudeAt(view.y + ((y + 0.5) / el.height) * view.height);
        for (let x = 0; x < el.width; x++) {
          const r = mapReading(grid, frame, lat, 360 * (view.x + ((x + 0.5) / el.width) * view.width) - 180);
          if (!r) continue;
          const value = layer === 'wind' ? Math.hypot(r.east, r.north) * 3.6 : r.temperature;
          const c = palette[clamp(Math.round(((value - min) * 255) / (max - min)), 0, 255)],
            i = (y * el.width + x) * 4;
          pixels.data[i] = c[0];
          pixels.data[i + 1] = c[1];
          pixels.data[i + 2] = c[2];
          pixels.data[i + 3] = 255;
        }
      }
      ctx.putImageData(pixels, 0, 0);
    });
    effect(() => {
      const el = this.outlines().nativeElement,
        { w, h } = this.size(),
        v = this.viewport(),
        rings = this.rings(),
        hasMap = !!this.map();
      const dpr = Math.min(devicePixelRatio, 2);
      el.width = Math.round(w * dpr);
      el.height = Math.round(h * dpr);
      const ctx = el.getContext('2d');
      if (!ctx || (hasMap && !this.interactive())) return;
      ctx.scale(dpr, dpr);
      ctx.lineWidth = 0.65;
      ctx.strokeStyle = hasMap ? '#ffffff58' : '#ffffff90';
      for (const ring of rings) {
        if (ring.south < v.y || ring.north > v.y + v.height) continue;
        for (const shift of [-1, 0, 1]) {
          if (ring.east + shift < v.x || ring.west + shift > v.x + v.width) continue;
          ctx.beginPath();
          ring.points.forEach((p, i) => {
            const x = ((p.x + shift - v.x) / v.width) * w,
              y = ((p.y - v.y) / v.height) * h;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          });
          ctx.stroke();
        }
      }
    });
    effect((cleanup) => {
      const el = this.flow().nativeElement,
        { w, h } = this.size(),
        full = this.interactive();
      const ctx = el.getContext('2d'),
        dpr = Math.min(devicePixelRatio, 2);
      el.width = Math.round(w * dpr);
      el.height = Math.round(h * dpr);
      if (!ctx || !this.visible() || this.layer() !== 'wind' || !this.field()) return;
      const animate = this.animated() && !this.reduceMotion();
      ctx.scale(dpr, dpr);
      ctx.lineWidth = 0.55;
      ctx.lineCap = 'round';
      const seed = () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        age: 0,
        life: 1.3 + Math.random() * 2,
        trail: [] as Point[],
      });
      const particles = Array.from({ length: full ? 1200 : 520 }, seed);
      let tick = 0,
        last = 0;
      const draw = (now: number) => {
        if (last === 0 || now - last >= 32) {
          const dt = last ? Math.min(0.08, (now - last) / 1000) : 1 / 30;
          last = now;
          const v = this.viewport(),
            g = this.field()?.grid,
            frame = this.frame();
          ctx.clearRect(0, 0, w, h);
          if (g && frame && !document.hidden) {
            const paths = [new Path2D(), new Path2D(), new Path2D()];
            for (let i = 0; i < particles.length; i++) {
              let p = particles[i];
              if (p.age > p.life || p.x < 0 || p.x > w || p.y < 0 || p.y > h) p = particles[i] = seed();
              const r = mapReading(
                g,
                frame,
                latitudeAt(v.y + (p.y / h) * v.height),
                360 * (v.x + (p.x / w) * v.width) - 180
              );
              p.age += dt;
              if (!r) continue;
              const speed = Math.hypot(r.east, r.north);
              if (speed < 0.15) continue;
              const k = (clamp(speed * 3, 2, 90) * dt) / speed,
                dx = k * r.east,
                dy = -k * r.north;
              if (!p.trail.length) p.trail.push({ x: p.x - (5 * r.east) / speed, y: p.y + (5 * r.north) / speed });
              p.x += dx;
              p.y += dy;
              p.trail.push({ x: p.x, y: p.y });
              if (p.trail.length > 24) p.trail.shift();
              const path = paths[i % 3];
              p.trail.forEach((q, j) => (j ? path.lineTo(q.x, q.y) : path.moveTo(q.x, q.y)));
            }
            paths.forEach((path, i) => {
              ctx.strokeStyle = ['#ffffff22', '#ffffff3d', '#ffffff5a'][i];
              ctx.stroke(path);
            });
          }
        }
        if (animate) tick = requestAnimationFrame(draw);
      };
      this.zone.runOutsideAngular(() => untracked(() => draw(performance.now())));
      cleanup(() => cancelAnimationFrame(tick));
    });
  }

  private kitRect(kit: typeof mapkit, v: MapViewport) {
    const origin = new kit.Coordinate(0, 0).toMapPoint(),
      scale = 4 * (new kit.Coordinate(0, 90).toMapPoint().x - origin.x);
    return new kit.MapRect(
      origin.x + (v.x - 0.5) * scale,
      origin.y + (v.y - 0.5) * scale,
      v.width * scale,
      v.height * scale
    );
  }
  recenter() {
    this.camera.set(null);
  }
  private move(dx: number, dy: number, zoomFactor = 1, anchorX = 0.5, anchorY = 0.5) {
    const v = this.viewport(),
      s = this.size(),
      camera = this.camera(),
      p = this.place();
    const base = Math.max(
      (this.interactive() ? 4 : 7) / 360,
      ((worldY(p.latitude - (this.interactive() ? 3 : 2.5)) - worldY(p.latitude + (this.interactive() ? 3 : 2.5))) *
        s.w) /
        s.h
    );
    const width = clamp(v.width * zoomFactor, Math.min(0.001, s.w / s.h), Math.min(1, s.w / s.h)),
      height = (width * s.h) / s.w;
    const x = v.x + 0.5 * v.width + (anchorX - 0.5) * (v.width - width) - (dx * v.width) / s.w;
    const y = v.y + 0.5 * v.height + (anchorY - 0.5) * (v.height - height) - (dy * v.height) / s.h;
    if (Number.isFinite(x + y))
      this.camera.set({ x: x - Math.floor(x), y: clamp(y, 0, 1), zoom: base > 0 ? width / base : (camera?.zoom ?? 1) });
  }
  private zoom(f: number, x: number, y: number) {
    this.move(0, 0, f, x, y);
  }
  private skip(e: Event) {
    return (e.target as HTMLElement).closest('a,button,input,select,[role=link]') !== null;
  }
  pointerDown(e: PointerEvent) {
    if (!this.interactive() || e.button !== 0 || this.skip(e)) return;
    this.points.set(e.pointerId, { x: e.clientX, y: e.clientY });
    this.el.nativeElement.setPointerCapture(e.pointerId);
    if (this.points.size === 1) {
      this.pressed = { x: e.clientX, y: e.clientY };
      this.moved = false;
    } else this.moved = true;
  }
  pointerMove(e: PointerEvent) {
    const prev = this.points.get(e.pointerId);
    if (!prev) return;
    const other = [...this.points].find(([id]) => id !== e.pointerId)?.[1];
    this.points.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (!this.moved && this.pressed && Math.hypot(e.clientX - this.pressed.x, e.clientY - this.pressed.y) < 4) return;
    this.moved = true;
    if (other) {
      const d = Math.hypot(other.x - e.clientX, other.y - e.clientY),
        old = Math.hypot(other.x - prev.x, other.y - prev.y);
      const r = this.el.nativeElement.getBoundingClientRect();
      if (d > 2 && old > 2)
        this.move(
          (e.clientX - prev.x) / 2,
          (e.clientY - prev.y) / 2,
          old / d,
          ((other.x + prev.x) / 2 - r.left) / r.width,
          ((other.y + prev.y) / 2 - r.top) / r.height
        );
    } else this.move(e.clientX - prev.x, e.clientY - prev.y);
  }
  pointerUp(e: PointerEvent) {
    if (!this.points.delete(e.pointerId)) return;
    if (!this.points.size && !this.moved) this.mapTap.emit();
  }
  pointerCancel(e: PointerEvent) {
    this.points.delete(e.pointerId);
    this.moved = true;
  }
  doubleClick(e: MouseEvent) {
    if (this.interactive() && !this.skip(e)) {
      const r = this.el.nativeElement.getBoundingClientRect();
      this.zoom(0.5, (e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height);
    }
  }
  key(e: KeyboardEvent) {
    if (!this.interactive() || this.skip(e)) return;
    if (e.key === '+' || e.key === '=') this.zoom(0.5, 0.5, 0.5);
    else if (e.key === '-') this.zoom(2, 0.5, 0.5);
    else if (e.key === 'ArrowLeft') this.move(64, 0);
    else if (e.key === 'ArrowRight') this.move(-64, 0);
    else if (e.key === 'ArrowUp') this.move(0, 64);
    else if (e.key === 'ArrowDown') this.move(0, -64);
    else return;
    e.preventDefault();
  }
}
