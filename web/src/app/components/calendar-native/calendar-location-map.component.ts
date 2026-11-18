import { ChangeDetectionStrategy, Component, ElementRef, computed, effect, inject, input, signal, viewChild } from '@angular/core';
import { CalendarAppleMapsService } from '../../core/calendar-apple-maps.service';
import { CalendarNativeTextPipe } from '../../core/calendar-localization';
import { CalendarSymbolComponent } from './calendar-symbol.component';

@Component({
  selector: 'cc-location-map',
  standalone: true,
  imports: [CalendarNativeTextPipe, CalendarSymbolComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (maps.available && !failed()) {
      <div #canvas class="map" [attr.aria-label]="title()"></div>
    } @else {
      <a [href]="url()" target="_blank" rel="noopener"><cc-symbol name="map" />{{ 'Open in Maps' | nativeText }}</a>
    }`,
  styles: [`
    :host {display:block}
    .map {height:170px; width:100%; overflow:hidden; border-radius:inherit}
    a {display:flex; align-items:center; gap:8px; padding:12px 16px; color:var(--cal-blue)}
  `],
})
export class CalendarLocationMapComponent {
  readonly maps = inject(CalendarAppleMapsService);
  readonly latitude = input.required<number>();
  readonly longitude = input.required<number>();
  readonly title = input.required<string>();
  readonly desktop = input(false);
  readonly dark = input(false);
  readonly failed = signal(false);
  private readonly canvas = viewChild<ElementRef<HTMLElement>>('canvas');
  readonly url = computed(() => 'https://maps.apple.com/?ll=' + this.latitude() + ',' + this.longitude() + '&q=' + encodeURIComponent(this.title()));

  constructor() {
    effect(onCleanup => {
      const element = this.canvas()?.nativeElement;
      if (!element) return;
      const lat = this.latitude(), lon = this.longitude(), title = this.title();
      const desktop = this.desktop(), dark = this.dark();
      let active = true;
      let map: mapkit.Map | undefined;
      onCleanup(() => { active = false; map?.destroy(); });
      void this.maps.load().then(kit => {
        if (!active) return;
        const center = new kit.Coordinate(lat, lon);
        const span = desktop ? 0.01 : 0.0045;
        map = new kit.Map(element, {
          region: new kit.CoordinateRegion(center, new kit.CoordinateSpan(span, span)),
          colorScheme: dark ? 'dark' : 'light', isScrollEnabled: desktop, isZoomEnabled: desktop,
          isRotationEnabled: false, showsZoomControl: desktop, showsMapTypeControl: false,
          showsCompass: kit.FeatureVisibility.Hidden,
        });
        map.addAnnotation(new kit.MarkerAnnotation(center, {title}));
      }).catch(() => { if (active) this.failed.set(true); });
    });
  }
}
