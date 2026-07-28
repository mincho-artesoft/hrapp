/**
 * GLSL for the hero backdrop.
 *
 * Two programs share one noise library:
 *  - AURORA: flowing ribbons of light across a curved dome.
 *  - GRID:   a receding "time horizon" whose lines scroll toward the camera.
 *
 * Kept in a separate file so the shader source is readable rather than
 * buried in template literals inside the component.
 */

/** Simplex-ish 2D value noise + fBm. Shared prelude. */
const NOISE = /* glsl */ `
vec2 hash2(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

float snoise(vec2 p) {
  const float K1 = 0.366025404;
  const float K2 = 0.211324865;
  vec2 i = floor(p + (p.x + p.y) * K1);
  vec2 a = p - i + (i.x + i.y) * K2;
  float m = step(a.y, a.x);
  vec2 o = vec2(m, 1.0 - m);
  vec2 b = a - o + K2;
  vec2 c = a - 1.0 + 2.0 * K2;
  vec3 h = max(0.5 - vec3(dot(a, a), dot(b, b), dot(c, c)), 0.0);
  vec3 n = h * h * h * h * vec3(dot(a, hash2(i)), dot(b, hash2(i + o)), dot(c, hash2(i + 1.0)));
  return dot(n, vec3(70.0));
}

/// Three octaves, not five. This runs per pixel, seven times per fragment of
/// the aurora — it is the hottest loop on the page, and at the scale the
/// ribbons are blurred to, the last two octaves are invisible.
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 rot = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 3; i++) {
    v += a * snoise(p);
    p = rot * p;
    a *= 0.5;
  }
  return v;
}

/// Single octave, for detail that is only ever seen through heavy blur.
float fbm1(vec2 p) {
  return snoise(p) * 0.5;
}
`;

export const AURORA_VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const AURORA_FRAG = /* glsl */ `
precision highp float;

uniform float uTime;
uniform vec2  uMouse;
uniform float uScroll;
uniform float uIntensity;
uniform vec3  uColorA;
uniform vec3  uColorB;
uniform vec3  uColorC;

varying vec2 vUv;

${NOISE}

void main() {
  vec2 uv = vUv;
  float t = uTime * 0.05;

  // Parallax the whole field a touch with the pointer.
  uv.x += uMouse.x * 0.035;
  uv.y += uMouse.y * 0.02 - uScroll * 0.12;

  vec3 col = vec3(0.0);
  float alpha = 0.0;

  // Three overlapping ribbons at different speeds and heights.
  for (int i = 0; i < 3; i++) {
    float fi = float(i);

    vec2 q = vec2(uv.x * 2.15 + fi * 4.3, uv.y * 1.35 - t * (0.55 + fi * 0.24));
    float warp = fbm1(q * 0.75 + vec2(t * 0.32, -t * 0.18));
    float n = fbm(q + warp * 0.9);

    float centre = 0.46
      + 0.155 * sin(t * 1.15 + fi * 2.2)
      + n * 0.235;

    float band = 1.0 - abs(uv.y - centre) * (2.35 + fi * 0.5);
    band = pow(clamp(band, 0.0, 1.0), 4.5 + fi * 2.2);

    vec3 base = mix(uColorA, uColorB, 0.35 + 0.45 * sin(fi * 1.7 + t * 1.4));
    base = mix(base, uColorC, 0.4 + 0.4 * sin(fi * 2.6 - t * 0.9));

    float w = 1.0 - fi * 0.2;
    col += base * band * w;
    alpha += band * w;
  }

  // Vertical curtain streaks — the "shimmer" real aurora has.
  float streak = fbm1(vec2(uv.x * 24.0, uv.y * 2.0 - t * 2.4));
  col += uColorB * smoothstep(0.35, 1.0, streak) * 0.06;

  // Fade at the edges so the plane never shows a hard border.
  float edgeX = smoothstep(0.0, 0.26, uv.x) * smoothstep(1.0, 0.74, uv.x);
  float edgeY = smoothstep(0.0, 0.2, uv.y) * smoothstep(1.0, 0.62, uv.y);
  float mask = edgeX * edgeY;
  if (mask <= 0.002) discard;

  alpha = clamp(alpha, 0.0, 1.0) * mask * uIntensity;
  col *= mask * uIntensity;

  gl_FragColor = vec4(col, alpha);
}
`;

export const GRID_VERT = /* glsl */ `
varying vec2 vUv;
varying float vDist;
void main() {
  vUv = uv;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vDist = -mv.z;
  gl_Position = projectionMatrix * mv;
}
`;

export const GRID_FRAG = /* glsl */ `
precision highp float;

uniform float uTime;
uniform float uScroll;
uniform vec3  uColor;
uniform vec3  uColorHot;

varying vec2 vUv;
varying float vDist;

/** Anti-aliased line mask on a repeating lattice. */
float lattice(float coord, float width) {
  float g = abs(fract(coord - 0.5) - 0.5) / max(fwidth(coord), 1e-5);
  return 1.0 - smoothstep(0.0, width, g);
}

void main() {
  // Lines march toward the viewer — reads as time flowing.
  float flow = uTime * 0.09 + uScroll * 2.4;

  float lx = lattice(vUv.x * 46.0, 1.35);
  float ly = lattice(vUv.y * 46.0 + flow, 1.35);

  // Every 8th line is brighter, like a calendar week marker.
  float major = lattice(vUv.x * 5.75, 1.6) * 0.65;

  float g = max(max(lx, ly), major);

  // Fade toward the horizon and the outer edges.
  float depth = smoothstep(150.0, 16.0, vDist);
  float radial = 1.0 - smoothstep(0.12, 0.55, distance(vUv, vec2(0.5)));

  vec3 col = mix(uColor, uColorHot, ly * 0.6 + major * 0.4);
  float a = g * depth * radial * 0.55;

  if (a < 0.004) discard;
  gl_FragColor = vec4(col, a);
}
`;

export const STAR_VERT = /* glsl */ `
attribute float aSize;
attribute float aPhase;
attribute vec3  aTint;

uniform float uTime;
uniform float uScroll;
uniform vec2  uMouse;
uniform float uPixelRatio;

varying float vTwinkle;
varying vec3  vTint;

void main() {
  vTint = aTint;

  vec3 p = position;

  // Drift with the pointer, proportional to depth — near stars move more.
  float depth = smoothstep(-260.0, 40.0, p.z);
  p.x += uMouse.x * 26.0 * depth;
  p.y += uMouse.y * 16.0 * depth;

  // Slow rise, and a push back as the page scrolls (camera dive).
  p.y += sin(uTime * 0.12 + aPhase) * 1.6;
  p.z += uScroll * 120.0;

  vec4 mv = modelViewMatrix * vec4(p, 1.0);

  vTwinkle = 0.45 + 0.55 * sin(uTime * 1.7 + aPhase * 6.2831);

  gl_PointSize = aSize * uPixelRatio * (170.0 / max(-mv.z, 1.0));
  gl_Position = projectionMatrix * mv;
}
`;

export const STAR_FRAG = /* glsl */ `
precision highp float;

varying float vTwinkle;
varying vec3  vTint;

void main() {
  vec2 d = gl_PointCoord - vec2(0.5);
  float r = length(d);
  if (r > 0.5) discard;

  // Soft core with a wide falloff — reads as bloom without a post pass.
  float core = smoothstep(0.5, 0.0, r);
  float glow = pow(core, 3.2);

  gl_FragColor = vec4(vTint * (glow * 1.4 + core * 0.25), (glow * 0.95 + core * 0.12) * vTwinkle);
}
`;
