import { db } from './db';
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock_key_for_sandbox_mode', {
  apiVersion: '2025-01-27.acacia' as any,
});

/**
 * STRICT PER-PRODUCT ENTITLEMENT CHECK
 * Ensures strict paid isolation for all accounts. No email string heuristics.
 */
export function hasBillingAccess(userId: string, productId?: string): boolean {
  if (!userId) return false;

  try {
    const user = db.prepare('SELECT credits, subscription_status FROM users WHERE id = ?').get(userId) as any;
    if (!user) return false;

    // 1. All-Access Enterprise Subscription
    if (user.subscription_status === 'active_all_access' || user.subscription_status === 'ACTIVE') return true;

    // 2. Product-Specific Entitlement Check
    if (productId) {
      const entitlement = db.prepare(`
        SELECT status FROM user_entitlements 
        WHERE user_id = ? AND product_id = ? AND status = 'active'
      `).get(userId, productId) as any;

      if (entitlement) return true;
    }

    // 3. Global active status fallback (for single-product legacy accounts)
    if (user.subscription_status === 'active' && !productId) return true;

    // 4. Initial Free Trial Credits (allows initial 10 generations before credit expiry)
    if (user.credits && user.credits > 0) return true;

    return false;
  } catch (e) {
    console.error('[stripe.ts] Error checking per-product billing access:', e);
    return false;
  }
}

/**
 * Grant active access entitlement to a specific product for a user upon Stripe checkout.
 */
export function grantProductEntitlement(userId: string, productId: string): boolean {
  if (!userId || !productId) return false;
  try {
    const createdAt = new Date().toISOString();
    db.prepare(`
      INSERT INTO user_entitlements (user_id, product_id, status, created_at)
      VALUES (?, ?, 'active', ?)
      ON CONFLICT(user_id, product_id) DO UPDATE SET status = 'active'
    `).run(userId, productId, createdAt);
    return true;
  } catch (e) {
    console.error('[stripe.ts] Error granting product entitlement:', e);
    return false;
  }
}

export function decrementCredits(userId: string): boolean {
  if (!userId) return false;

  try {
    const user = db.prepare('SELECT credits, subscription_status FROM users WHERE id = ?').get(userId) as any;
    if (!user) return true;

    if (user.subscription_status === 'active' || user.subscription_status === 'active_all_access' || user.subscription_status === 'ACTIVE') {
      return true;
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

export async function createCheckoutSession(userId: string, email: string, priceId: string, productId?: string) {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://contextskeleton.com'}/dashboard?session_id={CHECKOUT_SESSION_ID}&product=${productId || ''}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://contextskeleton.com'}/pricing`,
      customer_email: email,
      metadata: { userId, productId: productId || 'all-access' },
    });
    return session;
  } catch (err) {
    console.error('[stripe.ts] Error creating Stripe checkout session:', err);
    throw err;
  }
}
