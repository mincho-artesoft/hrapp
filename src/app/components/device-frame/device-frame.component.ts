import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

/**
 * A phone on the page.
 *
 * The App Store screenshots already ship with their own device frame, so this
 * component deliberately draws no chrome of its own — no rail, no buttons, no
 * bezel, no screen. Wrapping them in a CSS iPhone produced a frame inside a
 * frame, which is what made the earlier design look heavy.
 *
 * All it contributes is sizing and the coloured light the screen spills onto
 * the page behind it. Content projected into the slot sits over the shot at
 * `inset: 0` — the showcase's floating labels, for instance.
 *
 * It is deliberately not used for the widgets video. That clip has no frame of
 * its own, so it needs a bezel whose shape follows the footage; fitting it into
 * this component's fixed screenshot aspect ratio is what cropped the ends of
 * the phone off. `widgets.component.scss` grows its bezel from the video
 * instead.
 */
@Component({
  selector: 'app-device-frame',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="device" [ngClass]="'device--' + size">
      @if (glow) {
        <div class="device__bloom" aria-hidden="true"></div>
      }

      @if (src) {
        <img
          class="device__shot"
          [src]="src"
          [alt]="alt"
          [attr.loading]="eager ? 'eager' : 'lazy'"
          [attr.fetchpriority]="eager ? 'high' : null"
          decoding="async"
        />
      }

      <!-- One slot only: a template with two <ng-content> blocks projects
           into the first and silently drops the content of the second. -->
      <div class="device__slot">
        <ng-content />
      </div>
    </div>
  `,
  styleUrl: './device-frame.component.scss',
})
export class DeviceFrameComponent {
  /** Screenshot to show. It already contains the device frame. */
  @Input() src?: string;
  @Input() alt = '';
  /** Visual scale preset. */
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  /** Cast coloured light onto the surrounding page. */
  @Input() glow = true;
  /** Load eagerly — hero only. */
  @Input() eager = false;
}
