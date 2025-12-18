import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';

const PAYPAL_API_BASE = process.env.PAYPAL_MODE === 'live' 
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com';

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

export async function POST(request: NextRequest) {
  try {
    const { subscriptionId, userId, reason } = await request.json();

    if (!subscriptionId || !userId) {
      return NextResponse.json(
        { error: 'Missing subscription ID or user ID' },
        { status: 400 }
      );
    }

    // Get PayPal access token
    const accessToken = await getPayPalAccessToken();

    // Cancel subscription via PayPal API
    const cancelResponse = await fetch(
      `${PAYPAL_API_BASE}/v1/billing/subscriptions/${subscriptionId}/cancel`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reason: reason || 'Customer requested cancellation',
        }),
      }
    );

    if (!cancelResponse.ok) {
      const errorData = await cancelResponse.json();
      console.error('PayPal cancellation error:', errorData);
      throw new Error(errorData.message || 'Failed to cancel subscription with PayPal');
    }

    // Update user subscription status in Firebase
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      subscriptionStatus: 'cancelled',
      autoRenew: false,
      cancelledAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // Update subscription record
    const subscriptionRef = doc(db, 'subscriptions', subscriptionId);
    await updateDoc(subscriptionRef, {
      status: 'cancelled',
      cancelledAt: serverTimestamp(),
      autoRenew: false,
    });

    console.log('Subscription cancelled successfully:', subscriptionId);

    return NextResponse.json({
      success: true,
      message: 'Subscription cancelled successfully',
    });

  } catch (error) {
    console.error('Cancel subscription error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to cancel subscription',
        success: false,
      },
      { status: 500 }
    );
  }
}
