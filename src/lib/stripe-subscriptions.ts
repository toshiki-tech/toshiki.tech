import Stripe from 'stripe';
import { getStripe } from '@/lib/stripe';

/**
 * Subscription states that still bill the customer (or will retry billing).
 * A customer with one of these must not be sent to Checkout again, or Stripe
 * ends up charging two subscriptions every period.
 */
const BILLING_STATUSES: Stripe.Subscription.Status[] = ['active', 'trialing', 'past_due', 'unpaid'];

/** The customer's subscriptions that are still billing, newest first */
export async function listBillingSubscriptions(customerId: string): Promise<Stripe.Subscription[]> {
  const subs = await getStripe().subscriptions.list({ customer: customerId, status: 'all', limit: 100 });
  return subs.data
    .filter((sub) => BILLING_STATUSES.includes(sub.status))
    .sort((a, b) => b.created - a.created);
}

/**
 * The subscription a charge paid for, or null for one-off payments (lifetime).
 * Charges no longer carry their invoice, so go through the invoice payment that
 * links the charge's PaymentIntent to an invoice.
 */
export async function subscriptionIdForCharge(charge: Stripe.Charge): Promise<string | null> {
  const paymentIntentId =
    typeof charge.payment_intent === 'string' ? charge.payment_intent : charge.payment_intent?.id;
  if (!paymentIntentId) return null;

  const stripe = getStripe();
  const payments = await stripe.invoicePayments.list({
    payment: { type: 'payment_intent', payment_intent: paymentIntentId },
    limit: 1,
  });
  const invoiceRef = payments.data[0]?.invoice;
  if (!invoiceRef) return null;

  const invoice = typeof invoiceRef === 'string' ? await stripe.invoices.retrieve(invoiceRef) : invoiceRef;
  if ('deleted' in invoice) return null;
  const subscription = invoice.parent?.subscription_details?.subscription;
  if (!subscription) return null;
  return typeof subscription === 'string' ? subscription : subscription.id;
}

/** Subscriptions of this product still billing the customer (ones without metadata count as ours) */
export async function listProductBillingSubscriptions(
  customerId: string,
  product: string
): Promise<Stripe.Subscription[]> {
  return (await listBillingSubscriptions(customerId)).filter(
    (sub) => !sub.metadata?.product || sub.metadata.product === product
  );
}

/**
 * Refund the unused part of a subscription's current period to the card that paid it.
 * Safe to run again for the same subscription: a refund already tagged with this
 * subscription id is found and nothing more is refunded.
 * Returns the refunded amount (smallest currency unit), 0 when there was nothing to refund.
 *
 * The amount is below the full charge (time has passed since it was paid), so the
 * charge.refunded webhook — which only acts on full refunds — does not revoke Pro.
 */
async function refundUnusedPeriod(sub: Stripe.Subscription, reason: string): Promise<number> {
  const stripe = getStripe();
  const item = sub.items.data[0];
  if (!item) return 0;
  const start = item.current_period_start;
  const end = item.current_period_end;
  const nowSec = Math.floor(Date.now() / 1000);
  if (end <= nowSec || end <= start) return 0;

  const invoices = await stripe.invoices.list({ subscription: sub.id, status: 'paid', limit: 1 });
  const invoice = invoices.data[0];
  if (!invoice?.id || !invoice.amount_paid) return 0;

  const payments = await stripe.invoicePayments.list({ invoice: invoice.id, status: 'paid', limit: 1 });
  const payment = payments.data[0]?.payment;
  const paymentIntent =
    typeof payment?.payment_intent === 'string' ? payment.payment_intent : payment?.payment_intent?.id;
  const charge = typeof payment?.charge === 'string' ? payment.charge : payment?.charge?.id;
  if (!paymentIntent && !charge) return 0;
  const target = paymentIntent ? { payment_intent: paymentIntent } : { charge: charge! };

  const existing = await stripe.refunds.list({ ...target, limit: 100 });
  const alreadyRefunded = existing.data.some(
    (r) => r.metadata?.subscription === sub.id && r.status !== 'failed' && r.status !== 'canceled'
  );
  if (alreadyRefunded) return 0;

  // Never more than the full charge minus one unit, so this stays a partial refund
  const amount = Math.min(
    Math.floor(invoice.amount_paid * (end - nowSec) / (end - start)),
    invoice.amount_paid - 1
  );
  if (amount <= 0) return 0;
  await stripe.refunds.create({ ...target, amount, metadata: { subscription: sub.id, reason } });
  return amount;
}

/**
 * Which subscription survives when several of this product bill the customer at once.
 * Every checkout webhook must reach the same answer, or two racing checkouts each
 * keep their own and cancel the other, leaving the customer with nothing: the oldest
 * live (active / trialing) one wins. `current` is the subscription the webhook is
 * handling, counted even if the list has not caught up with it yet.
 */
export async function subscriptionToKeep(
  customerId: string,
  product: string,
  current: Stripe.Subscription
): Promise<string | null> {
  const isLive = (sub: Stripe.Subscription) => sub.status === 'active' || sub.status === 'trialing';
  const live = (await listProductBillingSubscriptions(customerId, product)).filter(isLive);
  if (isLive(current) && !live.some((sub) => sub.id === current.id)) live.push(current);
  live.sort((a, b) => a.created - b.created || a.id.localeCompare(b.id));
  return live[0]?.id ?? null;
}

/**
 * Last line of defence against double billing. Checkout refuses a second purchase
 * while a subscription is billing, so only a race (two checkouts opened at the same
 * moment) gets here. Keep the subscription just paid; cancel every other one of the
 * same product now and refund its unused time — the duplicate is our fault, not the
 * customer's choice. Call it only after the row points at `keepSubscriptionId`, so the
 * customer.subscription.deleted events of the duplicates find no row and change nothing.
 * `keepSubscriptionId` null cancels them all (the user already owns lifetime).
 * Returns the ids it canceled.
 */
export async function cancelDuplicateSubscriptions(
  customerId: string,
  product: string,
  keepSubscriptionId: string | null
): Promise<string[]> {
  const duplicates = (await listProductBillingSubscriptions(customerId, product))
    .filter((sub) => sub.id !== keepSubscriptionId);
  for (const sub of duplicates) {
    // Refund first: if the cancel then fails, the webhook retry finds the tagged
    // refund, skips it, and only cancels
    const refunded = await refundUnusedPeriod(sub, 'duplicate_subscription');
    await getStripe().subscriptions.cancel(sub.id, {
      cancellation_details: { comment: keepSubscriptionId ? `Duplicate of ${keepSubscriptionId}` : 'Already owns lifetime' },
    });
    console.error(
      `[ALERT][billing] duplicate subscription ${sub.id} canceled for customer ${customerId} ` +
      `(kept ${keepSubscriptionId}, refunded ${refunded})`
    );
  }
  return duplicates.map((sub) => sub.id);
}

/**
 * After a lifetime purchase the customer must not keep paying for the monthly /
 * yearly plan it replaces: cancel those now. The unused time is not refunded —
 * the app says so before the user upgrades. Call it only after the row has become
 * lifetime, so the cancellation events cannot downgrade the user.
 */
export async function cancelSubscriptionsReplacedByLifetime(customerId: string, product: string): Promise<string[]> {
  const subs = await listProductBillingSubscriptions(customerId, product);
  for (const sub of subs) {
    await getStripe().subscriptions.cancel(sub.id, {
      cancellation_details: { comment: 'Upgraded to lifetime' },
    });
  }
  return subs.map((sub) => sub.id);
}
