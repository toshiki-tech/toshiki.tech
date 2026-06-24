import Stripe from 'stripe';

let _stripe: Stripe | null = null;

/** Returns the Stripe client, initialised lazily at request time. */
export function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) throw new Error('STRIPE_SECRET_KEY is not set');
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { typescript: true });
  }
  return _stripe;
}
