/**
 * Stripe product / price configuration.
 *
 * To add a new app:
 *   1. Create a Product + Prices in the Stripe Dashboard.
 *   2. Add the product key and price IDs below.
 *   3. Add the corresponding env vars to .env.local and your deployment platform.
 *   4. Add a syncProStatus branch in src/app/api/stripe/webhook/route.ts.
 */

export const STRIPE_PRODUCTS = {
  yomiplay: {
    name: 'YomiPlay Premium',
    plans: {
      monthly:  { mode: 'subscription' as const, priceEnvKey: 'STRIPE_YOMIPLAY_MONTHLY_PRICE_ID'  },
      yearly:   { mode: 'subscription' as const, priceEnvKey: 'STRIPE_YOMIPLAY_YEARLY_PRICE_ID'   },
      lifetime: { mode: 'payment'      as const, priceEnvKey: 'STRIPE_YOMIPLAY_LIFETIME_PRICE_ID' },
    },
  },
  // Next product example:
  // yominote: {
  //   name: 'YomiNote Premium',
  //   plans: {
  //     monthly:  { mode: 'subscription', priceEnvKey: 'STRIPE_YOMINOTE_MONTHLY_PRICE_ID'  },
  //     lifetime: { mode: 'payment',      priceEnvKey: 'STRIPE_YOMINOTE_LIFETIME_PRICE_ID' },
  //   },
  // },
} as const;

export type ProductKey = keyof typeof STRIPE_PRODUCTS;
export type PlanKey<P extends ProductKey> = keyof typeof STRIPE_PRODUCTS[P]['plans'];

export function getPriceId(product: ProductKey, plan: string): string {
  const plans = STRIPE_PRODUCTS[product]?.plans as Record<string, { priceEnvKey: string }>;
  const cfg = plans?.[plan];
  if (!cfg) throw new Error(`Unknown product/plan: ${product}/${plan}`);
  const id = process.env[cfg.priceEnvKey];
  if (!id) throw new Error(`Missing env var: ${cfg.priceEnvKey}`);
  return id;
}

export function getPlanMode(product: ProductKey, plan: string): 'subscription' | 'payment' {
  const plans = STRIPE_PRODUCTS[product]?.plans as Record<string, { mode: 'subscription' | 'payment' }>;
  return plans?.[plan]?.mode ?? 'subscription';
}

export function isValidProduct(p: string): p is ProductKey {
  return p in STRIPE_PRODUCTS;
}

export function isValidPlan(product: ProductKey, plan: string): boolean {
  return plan in STRIPE_PRODUCTS[product].plans;
}
