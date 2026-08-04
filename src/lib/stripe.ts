import Stripe from 'stripe';
import { db } from './db';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
export const stripe = STRIPE_SECRET_KEY ? new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2025-01-27.acacia' as any }) : null;

if (!stripe) {
  console.warn('⚠️ Stripe API key is missing. System running in Sandbox Billing Mode.');
}

// Check if user has active subscription or positive credit balance
export function hasBillingAccess(userId: string): boolean {
  try {
    const user = db.prepare('SELECT subscription_status, credits FROM users WHERE id = ?').get(userId) as {
      subscription_status: string;
      credits: number;
    } | undefined;
    
    if (!user) return false;
    
    // User can access if subscription is active OR they have remaining credits
    return user.subscription_status === 'active' || user.credits > 0;
  } catch (error) {
    console.error('Error checking billing access:', error);
    return false;
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
    
    // Subscribed users have unlimited generations. Free/trial credits are decremented
    if (user.subscription_status !== 'active' && user.credits > 0) {
      db.prepare('UPDATE users SET credits = credits - 1 WHERE id = ?').run(userId);
    }
  } catch (error) {
    console.error('Error decrementing credits:', error);
  }
}

// Generate checkout URL
export async function createCheckoutSession(userId: string, email: string, baseUrl: string): Promise<string> {
  if (stripe) {
    // Real Stripe payment link creation
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'RFP Engine Professional Plan',
              description: 'Unlimited RFP drafts, PDF analysis, and semantic grounding.',
            },
            unit_amount: 49900, // $499.00 USD
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
    // Sandbox Billing mode: simulate a checkout and return a developer callback link
    return `${baseUrl}/api/billing/sandbox-callback?userId=${encodeURIComponent(userId)}`;
  }
}
