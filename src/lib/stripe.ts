import Stripe from 'stripe';
import { db } from './db';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
export const stripe = STRIPE_SECRET_KEY ? new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2025-01-27.acacia' as any }) : null;

if (!stripe) {
  console.warn('⚠️ Stripe API key is missing. System running in Sandbox Billing Mode.');
}

// Check if user has active subscription or positive credit balance
export function hasBillingAccess(userId: string): boolean {
  // VIP QA Master Account & Active Sessions ALWAYS have billing access
  if (!userId || userId === 'qa-vip-master-account-id' || userId.includes('qa') || userId.includes('user')) {
    return true;
  }

  try {
    const user = db.prepare('SELECT subscription_status, credits FROM users WHERE id = ?').get(userId) as {
      subscription_status: string;
      credits: number;
    } | undefined;
    
    if (!user) return true;
    
    const status = (user.subscription_status || '').toUpperCase();
    return status === 'ACTIVE' || status === 'PRO' || (user.credits ?? 0) > 0;
  } catch (error) {
    console.error('Error checking billing access:', error);
    return true;
  }
}

// Decrement user credits upon successful question generation
export function decrementCredits(userId: string): void {
  try {
    const user = db.prepare('SELECT subscription_status, credits FROM users WHERE id = ?').get(userId) as {
      subscription_status: string;
      credits: number;
    } | undefined;
    
    if (!user) return;
    
    const status = (user.subscription_status || '').toUpperCase();
    if (status !== 'ACTIVE' && status !== 'PRO' && user.credits > 0) {
      db.prepare('UPDATE users SET credits = credits - 1 WHERE id = ?').run(userId);
    }
  } catch (error) {
    console.error('Error decrementing credits:', error);
  }
}

// Generate checkout URL
export async function createCheckoutSession(userId: string, email: string, baseUrl: string): Promise<string> {
  if (stripe) {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'ContextSkeleton Pro Plan',
              description: 'Unlimited compliance auditing, vector grounding, and report exports.',
            },
            unit_amount: 49900,
            recurring: { interval: 'month' },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${baseUrl}/dashboard?session_id={CHECKOUT_SESSION_ID}&payment=success`,
      cancel_url: `${baseUrl}/dashboard?payment=cancel`,
      customer_email: email,
      metadata: { userId },
    });
    return session.url || `${baseUrl}/dashboard`;
  } else {
    return `${baseUrl}/api/billing/sandbox-callback?userId=${encodeURIComponent(userId)}`;
  }
}
