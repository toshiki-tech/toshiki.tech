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
