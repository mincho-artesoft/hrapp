/**
 * Motion + capability helpers.
 *
 * Everything cinematic on this site is opt-out-able: a user who asks their
 * OS for reduced motion, or a device that cannot afford a WebGL scene, gets a
 * static — still good-looking — version instead of a janky one.
 */

export function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

export function prefersReducedMotion(): boolean {
  if (!isBrowser() || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function isCoarsePointer(): boolean {
  if (!isBrowser() || !window.matchMedia) return false;
  return window.matchMedia('(pointer: coarse)').matches;
}

/**
 * Cheap heuristic for "can this device carry a live 3D scene?".
 * Deliberately conservative — a beautiful CSS fallback beats a 12fps canvas.
 */
export function canRunHeavyScene(): boolean {
  if (!isBrowser()) return false;
  if (prefersReducedMotion()) return false;

  const cores = (navigator as Navigator & { hardwareConcurrency?: number }).hardwareConcurrency ?? 4;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;

  // Core count alone is a weak signal — plenty of capable machines report 2.
  // Bail only when the device is short on cores *and* memory, or when memory
  // on its own is very low.
  if (memory <= 2) return false;
  if (cores <= 2 && memory <= 4) return false;

  // Respect data-saver.
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  if (conn?.saveData) return false;

  return supportsWebGL();
}

export function supportsWebGL(): boolean {
  if (!isBrowser()) return false;
  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2') ??
      canvas.getContext('webgl') ??
      canvas.getContext('experimental-webgl');
    return !!gl;
  } catch {
    return false;
  }
}

/** Linear interpolation. */
export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

/** Clamp to a range. */
export const clamp = (v: number, min = 0, max = 1): number => Math.min(max, Math.max(min, v));

/** Map a value from one range onto another, clamped. */
export const mapRange = (
  v: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
): number => {
  if (inMax === inMin) return outMin;
  return outMin + clamp((v - inMin) / (inMax - inMin)) * (outMax - outMin);
};

/** Smoothstep easing, the workhorse for scroll-driven transforms. */
export const smoothstep = (t: number): number => {
  const x = clamp(t);
  return x * x * (3 - 2 * x);
};
