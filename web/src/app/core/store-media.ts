import MANIFEST from './store-media-manifest.json';

export type StoreMediaDevice = 'iPhone' | 'iPad' | 'iPhoneDuo';
export interface StoreScreenshot {
  readonly name: string;
  readonly kind: string;
  readonly width: number;
  readonly height: number;
}
export interface StoreVideo {
  readonly src: string;
  readonly poster: string;
  readonly width: number;
  readonly height: number;
}
export interface StoreMediaSet {
  readonly screenshots: readonly StoreScreenshot[];
  readonly video?: StoreVideo;
}
interface StoreMediaManifest {
  readonly base: string;
  readonly widths: Readonly<Record<StoreMediaDevice, readonly number[]>>;
  readonly locales: Readonly<Record<string, Partial<Record<StoreMediaDevice, StoreMediaSet>>>>;
}
export const STORE_MEDIA = MANIFEST as StoreMediaManifest;
export function storeMediaUrl(path: string): string {
  return path.startsWith('/') ? path : `${STORE_MEDIA.base}/${path}`;
}
