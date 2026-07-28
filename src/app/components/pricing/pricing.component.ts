import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { RevealDirective } from '../../core/reveal.directive';
import { TiltDirective } from '../../core/tilt.directive';
import { APP_STORE_URL, PLANS, Plan } from '../../core/app-facts';

type Cycle = 'monthly' | 'yearly';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [RevealDirective, TiltDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './pricing.component.html',
  styleUrl: './pricing.component.scss',
})
export class PricingComponent {
  readonly appStoreUrl = APP_STORE_URL;
  readonly plans = PLANS;
  readonly cycle = signal<Cycle>('monthly');

  /** Price to show for the current billing cycle. */
  readonly priceOf = computed(() => (plan: Plan) => {
    if (plan.monthly === '0') return '0';
    return this.cycle() === 'yearly' ? (plan.yearly ?? plan.monthly) : plan.monthly;
  });

  price(plan: Plan): string {
    if (plan.monthly === '0') return '0';
    return this.cycle() === 'yearly' ? (plan.yearly ?? plan.monthly) : plan.monthly;
  }

  period(plan: Plan): string {
    if (plan.monthly === '0') return 'forever';
    return this.cycle() === 'yearly' ? '/ year' : '/ month';
  }

  setCycle(c: Cycle): void {
    this.cycle.set(c);
  }
}
