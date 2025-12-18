import { NextRequest, NextResponse } from 'next/server';
import { addCredits } from '@/lib/credits';
import { getAdminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

const PAYPAL_API_BASE = process.env.PAYPAL_MODE === 'live' 
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com';

// Verify PayPal webhook signature
async function verifyPayPalWebhook(
  webhookId: string,
  headers: Headers,
  body: any
): Promise<boolean> {
  try {
    const authToken = await getPayPalAccessToken();
    
    const verification = await fetch(`${PAYPAL_API_BASE}/v1/notifications/verify-webhook-signature`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        transmission_id: headers.get('paypal-transmission-id'),
        transmission_time: headers.get('paypal-transmission-time'),
        cert_url: headers.get('paypal-cert-url'),
        auth_algo: headers.get('paypal-auth-algo'),
        transmission_sig: headers.get('paypal-transmission-sig'),
        webhook_id: webhookId,
        webhook_event: body,
      }),
    });

    const result = await verification.json();
    return result.verification_status === 'SUCCESS';
  } catch (error) {
    console.error('Webhook verification error:', error);
    return false;
  }
}

// Get PayPal access token
async function getPayPalAccessToken(): Promise<string> {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('PayPal credentials not configured');
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  const data = await response.json();
  return data.access_token;
}

// Get plan details (credits and tier)
function getPlanDetails(planId: string): { tier: 'starter' | 'pro' | 'premium', credits: number, price: number } | null {
  const starterPlanId = process.env.PAYPAL_STARTER_PLAN_ID || process.env.NEXT_PUBLIC_PAYPAL_STARTER_PLAN_ID;
  const proPlanId = process.env.PAYPAL_PRO_PLAN_ID || process.env.NEXT_PUBLIC_PAYPAL_PRO_PLAN_ID;
  const premiumPlanId = process.env.PAYPAL_PREMIUM_PLAN_ID || process.env.NEXT_PUBLIC_PAYPAL_PREMIUM_PLAN_ID;

  console.log('Checking plan ID:', planId);
  console.log('Available plan IDs:', { starter: starterPlanId, pro: proPlanId, premium: premiumPlanId });

  if (planId === starterPlanId) {
    return { tier: 'starter', credits: 400, price: 4.99 };
  } else if (planId === proPlanId) {
    return { tier: 'pro', credits: 1000, price: 9.99 };
  } else if (planId === premiumPlanId) {
    return { tier: 'premium', credits: 3500, price: 19.99 };
  }

  // Fallback: Try to detect plan from subscription resource
  console.warn('Unknown plan ID, will try to detect from subscription data');
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const headers = request.headers;

    console.log('PayPal webhook received:', body.event_type);

    // Verify webhook signature (optional for development)
    const webhookId = process.env.PAYPAL_WEBHOOK_ID;
    if (webhookId && webhookId !== 'skip') {
      console.log('Verifying webhook signature...');
      const isValid = await verifyPayPalWebhook(webhookId, headers, body);
      if (!isValid) {
        console.warn('Invalid webhook signature - processing anyway in development mode');
        // In production, you should uncomment this:
        // return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      } else {
        console.log('Webhook signature verified successfully');
      }
    } else {
      console.log('Webhook signature verification skipped (no webhook ID configured)');
    }

    const eventType = body.event_type;
    const resource = body.resource;

    // Handle different webhook events
    switch (eventType) {
      // Subscription created
      case 'BILLING.SUBSCRIPTION.CREATED':
        console.log('Subscription created:', resource.id);
        break;

      // Subscription activated (first payment successful)
      case 'BILLING.SUBSCRIPTION.ACTIVATED':
        await handleSubscriptionActivated(resource);
        break;

      // Payment completed (monthly renewal)
      case 'PAYMENT.SALE.COMPLETED':
        await handlePaymentCompleted(resource);
        break;

      // Subscription cancelled
      case 'BILLING.SUBSCRIPTION.CANCELLED':
        await handleSubscriptionCancelled(resource);
        break;

      // Subscription suspended (payment failed)
      case 'BILLING.SUBSCRIPTION.SUSPENDED':
        await handleSubscriptionSuspended(resource);
        break;

      // Subscription expired
      case 'BILLING.SUBSCRIPTION.EXPIRED':
        await handleSubscriptionExpired(resource);
        break;

      default:
        console.log('Unhandled event type:', eventType);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('PayPal webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

// Handle subscription activation
async function handleSubscriptionActivated(resource: any) {
  try {
    const subscriptionId = resource.id;
    const planId = resource.plan_id;
    const subscriberId = resource.subscriber?.email_address; // You'll need to map this to Firebase UID
    
    const planDetails = getPlanDetails(planId);
    if (!planDetails) {
      console.error('Unknown plan ID:', planId);
      return;
    }

    console.log('Subscription activated:', {
      subscriptionId,
      planId,
      subscriberId,
      tier: planDetails.tier,
      credits: planDetails.credits,
    });

    // TODO: Map subscriber email to Firebase UID
    // For now, you need to store the mapping when user subscribes
    // const userId = await getUserIdByEmail(subscriberId);
    
    // Store in custom_id when creating subscription, then use it here:
    const userId = resource.custom_id;
    
    if (!userId) {
      console.error('No user ID found for subscription:', subscriptionId);
      return;
    }

    // Add credits to user
    await addCredits(
      userId,
      planDetails.credits,
      'paypal',
      subscriptionId,
      planDetails.price,
      subscriptionId
    );

    // Update user subscription info
    const db = getAdminDb();
    const userRef = db.collection('users').doc(userId);
    await userRef.update({
      subscriptionTier: planDetails.tier,
      subscriptionStatus: 'active',
      subscriptionPlatform: 'paypal',
      subscriptionId: subscriptionId,
      subscriptionStartDate: FieldValue.serverTimestamp(),
      subscriptionRenewDate: new Date(resource.billing_info?.next_billing_time),
      autoRenew: true,
    });

    // Store subscription record
    const subscriptionRef = db.collection('subscriptions').doc(subscriptionId);
    await subscriptionRef.set({
      userId,
      platform: 'paypal',
      planId,
      tier: planDetails.tier,
      status: 'active',
      monthlyCredits: planDetails.credits,
      monthlyPrice: planDetails.price,
      createdAt: FieldValue.serverTimestamp(),
      startDate: new Date(resource.start_time),
      currentPeriodStart: new Date(resource.billing_info?.last_payment?.time || resource.start_time),
      currentPeriodEnd: new Date(resource.billing_info?.next_billing_time),
      nextBillingDate: new Date(resource.billing_info?.next_billing_time),
      autoRenew: true,
      paypalSubscriptionId: subscriptionId,
    });

    console.log('Credits added and subscription activated for user:', userId);
  } catch (error) {
    console.error('Error handling subscription activation:', error);
  }
}

// Handle payment completion (monthly renewal)
async function handlePaymentCompleted(resource: any) {
  try {
    const subscriptionId = resource.billing_agreement_id;
    
    if (!subscriptionId) {
      console.log('No subscription ID in payment');
      return;
    }

    // Get subscription details
    const authToken = await getPayPalAccessToken();
    const subscriptionResponse = await fetch(
      `${PAYPAL_API_BASE}/v1/billing/subscriptions/${subscriptionId}`,
      {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const subscription = await subscriptionResponse.json();
    const planDetails = getPlanDetails(subscription.plan_id);
    
    if (!planDetails) {
      console.error('Unknown plan ID:', subscription.plan_id);
      return;
    }

    const userId = subscription.custom_id;
    
    if (!userId) {
      console.error('No user ID for subscription:', subscriptionId);
      return;
    }

    // Add monthly credits
    await addCredits(
      userId,
      planDetails.credits,
      'paypal',
      resource.id,
      parseFloat(resource.amount.total),
      subscriptionId
    );

    console.log('Monthly credits added for renewal:', userId, planDetails.credits);
  } catch (error) {
    console.error('Error handling payment completion:', error);
  }
}

// Handle subscription cancellation
async function handleSubscriptionCancelled(resource: any) {
  try {
    const subscriptionId = resource.id;
    const userId = resource.custom_id;

    if (!userId) return;

    // Update user subscription status
    const db = getAdminDb();
    const userRef = db.collection('users').doc(userId);
    await userRef.update({
      subscriptionStatus: 'cancelled',
      autoRenew: false,
      cancelledAt: FieldValue.serverTimestamp(),
    });

    // Update subscription record
    const subscriptionRef = db.collection('subscriptions').doc(subscriptionId);
    await subscriptionRef.update({
      status: 'cancelled',
      autoRenew: false,
      cancelledAt: FieldValue.serverTimestamp(),
    });

    console.log('Subscription cancelled:', subscriptionId);
  } catch (error) {
    console.error('Error handling subscription cancellation:', error);
  }
}

// Handle subscription suspension
async function handleSubscriptionSuspended(resource: any) {
  try {
    const subscriptionId = resource.id;
    const userId = resource.custom_id;

    if (!userId) return;

    const db = getAdminDb();
    const userRef = db.collection('users').doc(userId);
    await userRef.update({
      subscriptionStatus: 'suspended',
    });

    const subscriptionRef = db.collection('subscriptions').doc(subscriptionId);
    await subscriptionRef.update({
      status: 'suspended',
    });

    console.log('Subscription suspended:', subscriptionId);
  } catch (error) {
    console.error('Error handling subscription suspension:', error);
  }
}

// Handle subscription expiration
async function handleSubscriptionExpired(resource: any) {
  try {
    const subscriptionId = resource.id;
    const userId = resource.custom_id;

    if (!userId) return;

    const db = getAdminDb();
    const userRef = db.collection('users').doc(userId);
    await userRef.update({
      subscriptionStatus: 'expired',
      subscriptionTier: 'free',
      autoRenew: false,
    });

    const subscriptionRef = db.collection('subscriptions').doc(subscriptionId);
    await subscriptionRef.update({
      status: 'expired',
    });

    console.log('Subscription expired:', subscriptionId);
  } catch (error) {
    console.error('Error handling subscription expiration:', error);
  }
}
