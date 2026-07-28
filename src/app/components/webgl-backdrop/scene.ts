import * as THREE from 'three';

import {
  AURORA_FRAG,
  AURORA_VERT,
  GRID_FRAG,
  GRID_VERT,
  STAR_FRAG,
  STAR_VERT,
} from './aurora.glsl';

export interface SceneState {
  /** -1..1 pointer offset from the centre of the viewport. */
  pointerX: number;
  pointerY: number;
  /** 0..1 progress through the hero. */
  progress: number;
}

export interface SceneOptions {
  canvas: HTMLCanvasElement | OffscreenCanvas;
  width: number;
  height: number;
  pixelRatio: number;
  intensity: number;
  starCount: number;
}

/**
 * The hero backdrop scene, independent of where it runs.
 *
 * Deliberately free of any DOM or Angular dependency so the exact same code
 * can drive an OffscreenCanvas inside a worker (the fast path) or a normal
 * canvas on the main thread (the fallback).
 */
export class BackdropScene {
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene: THREE.Scene;
  private readonly camera: THREE.PerspectiveCamera;

  private aurora!: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;
  private grid!: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;
  private stars!: THREE.Points<THREE.BufferGeometry, THREE.ShaderMaterial>;

  private camX = 0;
  private camY = 0;

  constructor(private readonly opts: SceneOptions) {
    this.renderer = new THREE.WebGLRenderer({
      canvas: opts.canvas as HTMLCanvasElement,
      alpha: true,
      antialias: false, // the shaders are already soft-edged
      powerPreference: 'high-performance',
    });
    this.renderer.setClearColor(0x000000, 0);

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x04060f, 0.0055);

    this.camera = new THREE.PerspectiveCamera(58, 1, 0.1, 900);
    this.camera.position.set(0, 1.6, 46);

    this.buildStars();
    this.buildAurora();
    this.buildGrid();

    this.resize(opts.width, opts.height, opts.pixelRatio);
  }

  // ------------------------------------------------------------------ layers

  private buildStars(): void {
    const wide = this.opts.width > 900;
    const count = Math.round(this.opts.starCount * (wide ? 1 : 0.45));

    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const phases = new Float32Array(count);
    const tints = new Float32Array(count * 3);

    // Several colour families so the field has variety instead of grey dust.
    const palette = [
      new THREE.Color('#dfe9ff'),
      new THREE.Color('#7fb0ff'),
      new THREE.Color('#8ef0ff'),
      new THREE.Color('#c9a6ff'),
    ];

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 320;
      positions[i3 + 1] = (Math.random() - 0.5) * 190;
      positions[i3 + 2] = -Math.random() * 280 + 20;

      // A few bright anchors among many faint ones.
      sizes[i] = Math.random() < 0.06 ? 2.4 + Math.random() * 2.6 : 0.55 + Math.random() * 1.15;
      phases[i] = Math.random();

      const c = palette[(Math.random() * palette.length) | 0];
      tints[i3] = c.r;
      tints[i3 + 1] = c.g;
      tints[i3 + 2] = c.b;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
    geo.setAttribute('aTint', new THREE.BufferAttribute(tints, 3));

    const mat = new THREE.ShaderMaterial({
      vertexShader: STAR_VERT,
      fragmentShader: STAR_FRAG,
      uniforms: {
        uTime: { value: 0 },
        uScroll: { value: 0 },
        uMouse: { value: new THREE.Vector2() },
        uPixelRatio: { value: this.opts.pixelRatio },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    this.stars = new THREE.Points(geo, mat);
    this.stars.frustumCulled = false;
    this.scene.add(this.stars);
  }

  private buildAurora(): void {
    const geo = new THREE.PlaneGeometry(420, 240, 1, 1);
    const mat = new THREE.ShaderMaterial({
      vertexShader: AURORA_VERT,
      fragmentShader: AURORA_FRAG,
      uniforms: {
        uTime: { value: 0 },
        uScroll: { value: 0 },
        uIntensity: { value: this.opts.intensity },
        uMouse: { value: new THREE.Vector2() },
        uColorA: { value: new THREE.Color('#4d7cff') },
        uColorB: { value: new THREE.Color('#38e0f0') },
        uColorC: { value: new THREE.Color('#a566ff') },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    this.aurora = new THREE.Mesh(geo, mat);
    this.aurora.position.set(0, 14, -120);
    this.aurora.frustumCulled = false;
    this.scene.add(this.aurora);
  }

  private buildGrid(): void {
    const geo = new THREE.PlaneGeometry(600, 600, 1, 1);
    const mat = new THREE.ShaderMaterial({
      vertexShader: GRID_VERT,
      fragmentShader: GRID_FRAG,
      uniforms: {
        uTime: { value: 0 },
        uScroll: { value: 0 },
        uColor: { value: new THREE.Color('#2b52b8') },
        uColorHot: { value: new THREE.Color('#5ee9ff') },
      },
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });

    this.grid = new THREE.Mesh(geo, mat);
    this.grid.rotation.x = -Math.PI / 2;
    this.grid.position.set(0, -26, -140);
    this.grid.frustumCulled = false;
    this.scene.add(this.grid);
  }

  // ------------------------------------------------------------------ public

  resize(width: number, height: number, pixelRatio: number): void {
    this.opts.width = width;
    this.opts.height = height;
    this.opts.pixelRatio = pixelRatio;

    this.renderer.setPixelRatio(pixelRatio);
    this.renderer.setSize(width, height, false);

    this.camera.aspect = width / Math.max(1, height);
    // Widen the field of view on portrait screens so the composition still
    // reads when the viewport is tall and narrow.
    this.camera.fov = width / Math.max(1, height) < 0.85 ? 74 : 58;
    this.camera.updateProjectionMatrix();

    this.stars.material.uniforms['uPixelRatio'].value = pixelRatio;
  }

  render(time: number, state: SceneState): void {
    const set = (u: Record<string, THREE.IUniform>) => {
      u['uTime'].value = time;
      u['uScroll'].value = state.progress;
      if (u['uMouse']) (u['uMouse'].value as THREE.Vector2).set(state.pointerX, -state.pointerY);
    };
    set(this.aurora.material.uniforms);
    set(this.grid.material.uniforms);
    set(this.stars.material.uniforms);

    // The camera drifts toward the pointer and dives as the page scrolls.
    this.camX += (state.pointerX * 2.6 - this.camX) * 0.045;
    this.camY += (-state.pointerY * 1.8 - this.camY) * 0.045;

    this.camera.position.x = this.camX;
    this.camera.position.y = 1.6 + this.camY - state.progress * 8;
    this.camera.position.z = 46 - state.progress * 22;
    this.camera.rotation.z = Math.sin(time * 0.07) * 0.008;
    this.camera.lookAt(0, 4 - state.progress * 10, -80);

    this.renderer.render(this.scene, this.camera);
  }

  dispose(): void {
    for (const obj of [this.aurora, this.grid, this.stars]) {
      obj.geometry.dispose();
      (obj.material as THREE.Material).dispose();
      this.scene.remove(obj as unknown as THREE.Object3D);
    }
    this.renderer.dispose();
    this.renderer.forceContextLoss?.();
  }
}
