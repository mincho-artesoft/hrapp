import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { ActiveLocaleService } from '../../core/active-locale.service';
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
  private readonly active = inject(ActiveLocaleService);

  readonly copy = computed(() => this.active.copy().pricing);
  readonly appStoreUrl = this.active.storeHref;
  readonly cycle = signal<Cycle>('monthly');

  /**
   * The prices come from app-facts and the words from the language.
   *
   * Kept apart deliberately: a translator should be able to rewrite every
   * sentence on this section without any possibility of changing what a plan
   * costs.
   */
  readonly plans = computed(() =>
    PLANS.map((plan) => {
      const words = this.copy().plans[plan.id as 'free' | 'advanced' | 'premium'];
      return {
        ...plan,
        name: words.name,
        tagline: words.tagline,
        yearlyNote: words.yearlyNote,
        features: plan.features.map((f, i) => ({ ...f, label: words.features[i] ?? f.label })),
        inheritsName: plan.inherits
          ? this.copy().plans[plan.inherits.toLowerCase() as 'free' | 'advanced'].name
          : undefined,
      };
    }),
  );

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
    if (plan.monthly === '0') return this.copy().forever;
    return this.cycle() === 'yearly' ? this.copy().perYear : this.copy().perMonth;
  }

  cta(plan: { monthly: string; name: string }): string {
    return plan.monthly === '0'
      ? this.copy().downloadFree
      : this.copy().startWith.replace('{tier}', plan.name);
  }

  inheritsLine(name: string): string {
    return this.copy().everythingIn.replace('{tier}', name);
  }

  setCycle(c: Cycle): void {
    this.cycle.set(c);
  }
}
