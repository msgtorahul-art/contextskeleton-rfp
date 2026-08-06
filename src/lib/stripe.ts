import { db } from './db';
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock_key_for_sandbox_mode', {
  apiVersion: '2025-01-27.acacia' as any,
});

export function hasBillingAccess(userId: string): boolean {
  if (!userId) return false;

  // STRICT BILLING ACCESS CHECK
  // (Removed legacy 'user' substring bypass vulnerability)
  try {
    const user = db.prepare('SELECT credits, subscription_status FROM users WHERE id = ?').get(userId) as any;
    if (!user) return false;

    // Active subscriber or has available credits
    if (user.subscription_status === 'active') return true;
    if (user.credits && user.credits > 0) return true;

    // Sandbox mode for local dev if explicitly enabled via ENV
    if (process.env.NODE_ENV === 'development' && process.env.ALLOW_SANDBOX_BILLING === 'true') {
      return true;
    }

    return false;
  } catch (e) {
    console.error('[stripe.ts] Error checking user billing access:', e);
    return false;
  }
}

export function decrementCredits(userId: string): boolean {
  if (!userId) return false;
  try {
    const user = db.prepare('SELECT credits, subscription_status FROM users WHERE id = ?').get(userId) as any;
    if (!user) return false;

    if (user.subscription_status === 'active') {
      return true; // Unlimited processing for active subscribers
    }

    if (user.credits && user.credits > 0) {
      db.prepare('UPDATE users SET credits = credits - 1 WHERE id = ?').run(userId);
      return true;
    }

    return false;
  } catch (e) {
    console.error('[stripe.ts] Error decrementing credits:', e);
    return false;
  }
}

export async function createCheckoutSession(userId: string, email: string, priceId: string) {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://contextskeleton.com'}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://contextskeleton.com'}/pricing`,
      customer_email: email,
      metadata: { userId },
    });
    return session;
  } catch (err) {
    console.error('[stripe.ts] Error creating Stripe checkout session:', err);
    throw err;
  }
}
