import { Injectable, inject, signal } from '@angular/core';
import { CalendarPlatformApiService } from './calendar-platform-api.service';
import { Place, WeatherService } from './weather.service';

/** The timeline and the detailed Weather view use the same location and forecast. */
@Injectable()
export class CalendarForecastService {
  private readonly api = inject(CalendarPlatformApiService);
  private readonly weather = inject(WeatherService);
  readonly selectedPlace = signal<Place | null>(null);
  private locating?: Promise<Place | null>;

  restoredPlace(places: Place[]): Place | null {
    const selected = localStorage.getItem('cc.mac.selectedRegion');
    if (selected === '0') return null;
    return places.find(p => String(p.id) === selected) ?? places.find(p => p.id !== 0) ?? null;
  }

  async timelinePlace(): Promise<Place | null> {
    try {
      const saved = this.restoredPlace(JSON.parse(localStorage.getItem('cc.mac.regions') || '[]'));
      if (saved) return saved;
    } catch { /* Geolocation is still available when storage is disabled. */ }
    if (!navigator.geolocation) return null;
    this.locating ??= new Promise<Place | null>(resolve => navigator.geolocation.getCurrentPosition(
      ({coords}) => resolve({id: 0, name: 'Current Location', country: '', countryCode: '',
        latitude: coords.latitude, longitude: coords.longitude, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone}),
      () => resolve(null), {maximumAge: 600000, timeout: 10000}
    )).finally(() => { this.locating = undefined; });
    return this.locating;
  }

  async load(place: Place, unitPreference: string | undefined, locale: string) {
    const units = unitPreference === 'metric' || unitPreference === 'imperial'
      ? unitPreference : /-US$/i.test(navigator.language) ? 'imperial' : 'metric';
    try {
      return await this.weather.loadCalendar(place, units, locale, p => this.api.getCalendarForecast(p));
    } catch {
      return this.weather.load(place, units);
    }
  }
}
