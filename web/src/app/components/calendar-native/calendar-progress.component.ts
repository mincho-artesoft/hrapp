import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { CalendarNativeTextPipe } from "../../core/calendar-localization";

@Component({
  selector: "cc-calendar-progress",
  standalone: true,
  imports: [CalendarNativeTextPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span role="status" [attr.aria-label]="(label() || 'Loading…') | nativeText">
    <i aria-hidden="true"></i>
    @if (label()) { <span>{{ label() | nativeText }}</span> }
  </span>`,
  styles: [`
    :host { display: grid; place-items: center; min-height: 44px; }
    :host > span { display: flex; align-items: center; justify-content: center; gap: 8px; color: var(--cal-muted); font-size: 14px; }
    i {
      width: 20px; height: 20px; border-radius: 50%;
      background: repeating-conic-gradient(currentColor 0deg 15deg, transparent 15deg 45deg);
      mask-image: radial-gradient(closest-side, transparent 45%, black 60%), conic-gradient(transparent, black);
      mask-composite: intersect; animation: spin .8s steps(8) infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    @media (prefers-reduced-motion: reduce) { i { animation: none; } }
  `],
})
export class CalendarProgressComponent {
  readonly label = input("");
}
