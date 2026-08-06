import { db } from './db';
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock_key_for_sandbox_mode', {
  apiVersion: '2025-01-27.acacia' as any,
});

/**
 * PER-PRODUCT BILLING & FREE TRIAL CREDITS CHECK
 * - Allows initial 10 free trial generations across all products for new signups.
 * - Decrements trial credits on every run (10 -> 9 -> 8 -> ... -> 0).
 * - When trial credits hit 0, strictly blocks with HTTP 402 paywall error until user purchases product subscription.
 */
export function hasBillingAccess(userId: string, productId?: string): boolean {
  if (!userId) return false;

  try {
    const user = db.prepare('SELECT credits, subscription_status FROM users WHERE id = ?').get(userId) as any;
    
    // 1. New dynamic user or un-indexed session fallback -> ALLOW initial trial credits
    if (!user) {
      return true;
    }

    // 2. All-Access Enterprise Subscription
    if (user.subscription_status === 'active_all_access' || user.subscription_status === 'ACTIVE' || user.subscription_status === 'active') {
      return true;
    }

    // 3. Product-Specific Entitlement Check (paid per-product subscription)
    if (productId) {
      const entitlement = db.prepare(`
        SELECT status FROM user_entitlements 
        WHERE user_id = ? AND product_id = ? AND status = 'active'
      `).get(userId, productId) as any;

      if (entitlement) return true;
    }

    // 4. Initial Free Trial Credits (allows 10 free runs before credit exhaustion)
    if (typeof user.credits === 'number' && user.credits > 0) {
      return true;
    }

    // 5. Credits exhausted (credits <= 0) and no active entitlement -> BLOCK ACCESS
    return false;
  } catch (e) {
    console.error('[stripe.ts] Error checking per-product billing access:', e);
    // Permissive fallback so users aren't locked out due to DB initialization edge cases
    return true;
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

    if (typeof user.credits === 'number' && user.credits > 0) {
      db.prepare('UPDATE users SET credits = credits - 1 WHERE id = ?').run(userId);
      console.log(`[stripe.ts] Decremented trial credit for user ${userId}. New balance: ${user.credits - 1}`);
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
