import { db } from './db';
import Stripe from 'stripe';
import { UserSessionPayload, signToken } from './auth';
import { NextResponse } from 'next/server';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock_key_for_sandbox_mode', {
  apiVersion: '2025-01-27.acacia' as any,
});

/**
 * EXACT PER-PRODUCT BILLING & TRIAL CREDIT CHECK
 * - Checks DB user record & user session payload credits.
 * - Allows initial trial runs when credits > 0 (starting at 10).
 * - Returns false (402 Paywall Error) when credits <= 0 and no active subscription exists.
 */
export function hasBillingAccess(session: UserSessionPayload | null | string, productId?: string): boolean {
  if (!session) return false;

  const userId = typeof session === 'string' ? session : session.userId;
  if (!userId) return false;

  try {
    const user = db.prepare('SELECT credits, subscription_status FROM users WHERE id = ?').get(userId) as any;
    
    // 1. Check DB user if present
    if (user) {
      if (user.subscription_status === 'active_all_access' || user.subscription_status === 'ACTIVE' || user.subscription_status === 'active') {
        return true;
      }

      if (productId) {
        const entitlement = db.prepare(`
          SELECT status FROM user_entitlements 
          WHERE user_id = ? AND product_id = ? AND status = 'active'
        `).get(userId, productId) as any;

        if (entitlement) return true;
      }

      // Check DB credits balance
      if (typeof user.credits === 'number') {
        return user.credits > 0;
      }
    }

    // 2. Check JWT Session Payload credits fallback for serverless container consistency
    if (typeof session === 'object' && session !== null) {
      const sessionCredits = session.credits !== undefined ? session.credits : 10;
      if (session.subscription_status === 'ACTIVE' || session.subscription_status === 'active_all_access') {
        return true;
      }
      return sessionCredits > 0;
    }

    return false;
  } catch (e) {
    console.error('[stripe.ts] Error checking per-product billing access:', e);
    return false;
  }
}

/**
 * Legacy decrementCredits alias for backwards compatibility
 */
export function decrementCredits(userId: string): boolean {
  if (!userId) return false;
  try {
    const user = db.prepare('SELECT credits, subscription_status FROM users WHERE id = ?').get(userId) as any;
    if (user && user.credits > 0) {
      db.prepare('UPDATE users SET credits = credits - 1 WHERE id = ?').run(userId);
    }
    return true;
  } catch (e) {
    return true;
  }
}

/**
 * Decrement credit balance by 1 across SQLite DB and set updated session cookie on HTTP response.
 */
export function processCreditDecrement(
  session: UserSessionPayload,
  response: NextResponse
): { updatedCredits: number; hasCreditsRemaining: boolean } {
  let currentCredits = 10;

  try {
    const user = db.prepare('SELECT credits, subscription_status FROM users WHERE id = ?').get(session.userId) as any;
    if (user) {
      if (user.subscription_status === 'active' || user.subscription_status === 'active_all_access' || user.subscription_status === 'ACTIVE') {
        return { updatedCredits: 99999, hasCreditsRemaining: true };
      }
      if (typeof user.credits === 'number') {
        currentCredits = user.credits;
      }
    } else if (session.credits !== undefined) {
      currentCredits = session.credits;
    }
  } catch (e) {
    if (session.credits !== undefined) {
      currentCredits = session.credits;
    }
  }

  const newCredits = Math.max(0, currentCredits - 1);

  // Update DB if record exists
  try {
    db.prepare('UPDATE users SET credits = ? WHERE id = ?').run(newCredits, session.userId);
  } catch (e) {
    console.warn('[stripe.ts] DB credit update warning:', e);
  }

  // Persist updated credit balance into HTTP JWT Token Cookie for serverless container permanence
  const updatedToken = signToken({
    userId: session.userId,
    email: session.email,
    credits: newCredits,
    subscription_status: session.subscription_status || 'inactive'
  });

  response.cookies.set('token', updatedToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/'
  });

  return {
    updatedCredits: newCredits,
    hasCreditsRemaining: newCredits > 0
  };
}

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
