import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature') || '';
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: any;

  try {
    if (stripe && webhookSecret && signature) {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } else {
      // Direct JSON parsing fallback for sandbox environments
      event = JSON.parse(body);
    }
  } catch (err: any) {
    console.error('Stripe Webhook Verification Error:', err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle Stripe Webhook Events
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const userId = session.client_reference_id || session.metadata?.userId;
      
      if (userId) {
        db.prepare(`
          UPDATE users 
          SET subscription_status = 'active', credits = 9999 
          WHERE id = ?
        `).run(userId);
        console.log(`[Stripe Webhook] Successfully activated PRO subscription for user ${userId}`);
      }
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object;
      const userId = subscription.metadata?.userId;

      if (userId) {
        db.prepare(`
          UPDATE users 
          SET subscription_status = 'inactive', credits = 10 
          WHERE id = ?
        `).run(userId);
        console.log(`[Stripe Webhook] Subscription cancelled for user ${userId}`);
      }
      break;
    }

    case 'invoice.payment_succeeded': {
      const invoice = event.data.object;
      const userId = invoice.subscription_details?.metadata?.userId;

      if (userId) {
        db.prepare(`
          UPDATE users 
          SET subscription_status = 'active', credits = 9999 
          WHERE id = ?
        `).run(userId);
      }
      break;
    }

    default:
      console.log(`Unhandled Stripe event type: ${event.type}`);
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
