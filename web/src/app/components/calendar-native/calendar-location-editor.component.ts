import {Component, inject, input, OnDestroy, OnInit, output, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CalendarNativeTextPipe} from '../../core/calendar-localization';
import {CalendarSymbolComponent} from './calendar-symbol.component';
import {CalendarAppleMapsService, EventPlaceSuggestion} from '../../core/calendar-apple-maps.service';
import {WeatherService} from '../../core/weather.service';
import {WebCalendarEventDetails} from '../../core/calendar-platform-api.service';

export interface LocationDraft {
  location: string;
  structuredLocation?: WebCalendarEventDetails['structuredLocation'];
  videoCallURL?: string;
}

export function finishLocation(draft: LocationDraft) {
  draft.location = draft.location.trim();
  if (!draft.structuredLocation && draft.location) draft.structuredLocation = {title:draft.location,radius:0};
  if (draft.videoCallURL !== undefined) draft.videoCallURL = draft.videoCallURL.trim();
}

@Component({
  selector:'cc-location-editor', standalone:true, imports:[FormsModule,CalendarNativeTextPipe,CalendarSymbolComponent],
  templateUrl:'./calendar-location-editor.component.html', styleUrl:'./calendar-location-editor.component.scss'
})
export class CalendarLocationEditorComponent implements OnInit, OnDestroy {
  readonly draft = input.required<LocationDraft>();
  readonly allowsVideo = input(false);
  readonly desktop = input(false);
  readonly done = output<void>();
  private readonly weatherService = inject(WeatherService);
  ngOnInit() { this.searchEditorLocation(this.draft().location); }
  ngOnDestroy() { this.resetLocationSearch(); }
  finish() { finishLocation(this.draft()); this.done.emit(); }
  private readonly appleMaps = inject(CalendarAppleMapsService);
  readonly locationResults = signal<EventPlaceSuggestion[]>([]);
  readonly searchingLocation = signal(false);
  private locationSearchSeq = 0;
  private locationTimer?: ReturnType<typeof setTimeout>;

  searchEditorLocation(query: string) {
    this.resetLocationSearch();
    const seq = this.locationSearchSeq;
    const trimmed = query.trim();
    if (trimmed.length < 2) return;
    this.searchingLocation.set(true);
    this.locationTimer = setTimeout(async () => {
      try {
        const places = this.appleMaps.available
          ? await this.appleMaps.suggestions(trimmed, this.desktop())
          : (await this.weatherService.search(trimmed)).slice(0, 6).map(place => ({
              title: place.name, subtitle: [place.admin1, place.country].filter(Boolean).join(', '),
              coordinate: {latitude: place.latitude, longitude: place.longitude},
            }));
        if (seq === this.locationSearchSeq) this.locationResults.set(places);
      } catch {
        // The typed address can still be saved if the map service is unavailable.
      } finally {
        if (seq === this.locationSearchSeq) this.searchingLocation.set(false);
      }
    }, 250);
  }

  private resetLocationSearch() {
    ++this.locationSearchSeq;
    clearTimeout(this.locationTimer);
    this.locationResults.set([]);
    this.searchingLocation.set(false);
  }

  changeLocation(value: string) {
    const draft = this.draft();
    draft.location = value;
    draft.structuredLocation = null;
    this.searchEditorLocation(value);
  }

  async pick(place: EventPlaceSuggestion) {
    const draft = this.draft();
    this.resetLocationSearch();
    const seq = this.locationSearchSeq;
    const title = this.desktop() ? place.title : [place.title, place.subtitle].filter(Boolean).join(', ');
    let coordinate = place.coordinate;
    try { coordinate = await this.appleMaps.coordinateFor(place); } catch { /* Keep the selected address. */ }
    if (seq !== this.locationSearchSeq || this.draft() !== draft) return;
    draft.location = title;
    draft.structuredLocation = {title, latitude: coordinate?.latitude, longitude: coordinate?.longitude, radius: 0};
    this.finish();
  }

}
