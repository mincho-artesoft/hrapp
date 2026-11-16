/// <reference lib="webworker" />

import { BackdropScene, SceneState } from './scene';

/**
 * Runs the hero scene on a worker thread against an OffscreenCanvas.
 *
 * This is the whole point of the exercise: three.js, the scene graph, the
 * per-frame uniform updates and the WebGL command submission all happen here,
 * so none of it competes with scrolling on the main thread. The main thread's
 * only job is to post pointer and scroll values, and only when they change.
 *
 * requestAnimationFrame is not available in a dedicated worker, so the loop is
 * a self-scheduling timeout. Animation is driven from elapsed time rather than
 * frame count, so the jitter that introduces is invisible.
 */

type InitMessage = {
  type: 'init';
  canvas: OffscreenCanvas;
  width: number;
  height: number;
  pixelRatio: number;
  intensity: number;
  starCount: number;
};

type Message =
  | InitMessage
  | { type: 'resize'; width: number; height: number; pixelRatio: number }
  | { type: 'state'; pointerX: number; pointerY: number; progress: number }
  | { type: 'running'; value: boolean }
  | { type: 'dispose' };

let scene: BackdropScene | null = null;
let running = false;
let timer: ReturnType<typeof setTimeout> | 0 = 0;
let started = 0;

const state: SceneState = { pointerX: 0, pointerY: 0, progress: 0 };



/**
 * Chromium exposes requestAnimationFrame on DedicatedWorkerGlobalScope, and
 * for WebGL it is not merely a nicety: a frame drawn to an OffscreenCanvas
 * outside a rAF callback is never presented to the placeholder canvas. Drawing
 * on a setTimeout loop renders happily at 60fps and puts nothing on screen.
 * The timeout path below exists only for engines without worker rAF.
 */
const hasRaf = typeof requestAnimationFrame === 'function';

function loop(): void {
  if (!running || !scene) return;
  const began = performance.now();

  try {
    scene.render((began - started) / 1000, state);
  } catch {
    running = false;
    return;
  }

  if (hasRaf) {
    timer = requestAnimationFrame(loop) as unknown as ReturnType<typeof setTimeout>;
  } else {
    // Schedule from how long this frame actually took, so a slow frame does
    // not compound into a backlog.
    const spent = performance.now() - began;
    timer = setTimeout(loop, Math.max(0, 1000 / 60 - spent));
  }
}

function setRunning(value: boolean): void {
  if (value === running) return;
  running = value;
  if (running) {
    loop();
  } else if (timer) {
    if (hasRaf) cancelAnimationFrame(timer as unknown as number);
    else clearTimeout(timer);
    timer = 0;
  }
}

addEventListener('message', ({ data }: MessageEvent<Message>) => {
  switch (data.type) {
    case 'init': {
      try {
        scene = new BackdropScene({
          canvas: data.canvas,
          width: data.width,
          height: data.height,
          pixelRatio: data.pixelRatio,
          intensity: data.intensity,
          starCount: data.starCount,
        });
        started = performance.now();
        postMessage({ type: 'ready' });
        setRunning(true);
      } catch {
        postMessage({ type: 'failed' });
      }
      break;
    }

    case 'resize':
      scene?.resize(data.width, data.height, data.pixelRatio);
      break;

    case 'state':
      state.pointerX = data.pointerX;
      state.pointerY = data.pointerY;
      state.progress = data.progress;
      break;

    case 'running':
      setRunning(data.value);
      break;

    case 'dispose':
      setRunning(false);
      scene?.dispose();
      scene = null;
      close();
      break;
  }
});
