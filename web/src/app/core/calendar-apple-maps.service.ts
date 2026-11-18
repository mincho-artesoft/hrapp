/// <reference types="apple-mapkit-js" />
import { Injectable, inject } from '@angular/core';
import { SITE_URL } from './app-facts';
import { CalendarLocalization } from './calendar-localization';

export interface EventPlaceSuggestion {
  title: string;
  subtitle: string;
  completion?: mapkit.SearchAutocompleteResult;
  coordinate?: Pick<mapkit.Coordinate, 'latitude' | 'longitude'>;
}

@Injectable({providedIn: 'root'})
export class CalendarAppleMapsService {
  private readonly localization = inject(CalendarLocalization);
  private loading?: Promise<typeof mapkit>;
  get available(): boolean {
    return typeof window !== 'undefined' && window.location.origin === SITE_URL;
  }

  load(): Promise<typeof mapkit> {
    if (!this.available) return Promise.reject(new Error('Apple Maps is available on the calendar website.'));
    return this.loading ??= this.initialize().catch(error => {
      this.loading = undefined;
      throw error;
    });
  }

  private async initialize(): Promise<typeof mapkit> {
    const response = await fetch('/calendar-mapkit-token.txt');
    if (!response.ok) throw new Error('Could not load Apple Maps.');
    const token = (await response.text()).trim();
    if (typeof mapkit === 'undefined') {
      await new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.apple-mapkit.com/mk/5.x.x/mapkit.js';
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => { script.remove(); reject(new Error('Could not load Apple Maps.')); };
        document.head.append(script);
      });
    }
    mapkit.init({authorizationCallback: callback => callback(token), language: this.localization.locale()});
    return mapkit;
  }

  async suggestions(query: string, desktop: boolean): Promise<EventPlaceSuggestion[]> {
    const kit = await this.load();
    const search = new kit.Search({language: this.localization.locale()});
    if (desktop) {
      return new Promise((resolve, reject) => search.search(query, (error, result) => {
        if (error) { reject(error); return; }
        resolve(result.places.slice(0, 6).map(place => ({
          title: place.name || place.formattedAddress, subtitle: place.formattedAddress,
          coordinate: place.coordinate,
        })));
      }));
    }
    return new Promise((resolve, reject) => search.autocomplete(query, (error, result) => {
      if (error) { reject(error); return; }
      resolve(result.results.filter(item => item.displayLines.length).slice(0, 6).map(completion => ({
        title: completion.displayLines[0], subtitle: completion.displayLines.slice(1).join(', '),
        completion, coordinate: completion.coordinate,
      })));
    }));
  }

  async coordinateFor(place: EventPlaceSuggestion): Promise<EventPlaceSuggestion['coordinate']> {
    if (place.coordinate || !place.completion) return place.coordinate;
    const kit = await this.load();
    const search = new kit.Search({language: this.localization.locale()});
    const completion = place.completion;
    return new Promise((resolve, reject) => search.search(completion, (error, result) => {
      if (error) reject(error);
      else resolve(result.places[0]?.coordinate);
    }));
  }
}
