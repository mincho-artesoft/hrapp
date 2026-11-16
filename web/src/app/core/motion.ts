import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, inject } from '@angular/core';

/**
 * Motion + capability helpers.
 *
 * Everything cinematic on this site is opt-out-able: a user who asks their
 * OS for reduced motion, or a device that cannot afford a WebGL scene, gets a
 * static — still good-looking — version instead of a janky one.
 */

/**
 * True only in a real browser.
 *
 * Deliberately asks Angular rather than sniffing for `window`. The prerenderer
 * runs the application against a DOM shim in which `window` and `document` are
 * both defined, so a `typeof window` check passes on the server — and every
 * browser-only branch behind it runs during the build, then dies on the first
 * API the shim does not implement. That is exactly how this site failed to
 * prerender: `cancelAnimationFrame is not defined`.
 *
 * Must be called from an injection context, so capture it into a field:
 *
 *     private readonly browser = isBrowser();
 *
 * and read `this.browser` from methods.
 */
export function isBrowser(): boolean {
  return isPlatformBrowser(inject(PLATFORM_ID));
}

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function isCoarsePointer(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(pointer: coarse)').matches;
}

/**
 * Cheap heuristic for "can this device carry a live 3D scene?".
 * Deliberately conservative — a beautiful CSS fallback beats a 12fps canvas.
 */
export function canRunHeavyScene(): boolean {
  if (prefersReducedMotion()) return false;
  if (typeof navigator === 'undefined') return false;

  const cores = (navigator as Navigator & { hardwareConcurrency?: number }).hardwareConcurrency ?? 4;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;

  // Core count alone is a weak signal — plenty of capable machines report 2.
  // Bail only when the device is short on cores *and* memory, or when memory
  // on its own is very low.
  if (memory <= 2) return false;
  if (cores <= 2 && memory <= 4) return false;

  // Respect data-saver, and the connection itself. The backdrop worker is
  // ~474 kB of decoration; a device perfectly able to render it can still be
  // on a connection where spending that is rude. Measured at 2.6s to arrive on
  // a throttled 4G profile.
  const conn = (
    navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }
  ).connection;
  if (conn?.saveData) return false;
  if (conn?.effectiveType && /(^|-)(2g|slow-2g)$/.test(conn.effectiveType)) return false;

  return supportsWebGL();
}

export function supportsWebGL(): boolean {
  if (typeof document === 'undefined') return false;
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
