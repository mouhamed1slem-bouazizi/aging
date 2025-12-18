import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, updateDoc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

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

    // First, check the subscription status in PayPal
    const statusResponse = await fetch(
      `${PAYPAL_API_BASE}/v1/billing/subscriptions/${subscriptionId}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    let subscriptionAlreadyCancelled = false;

    if (statusResponse.ok) {
      const subscriptionData = await statusResponse.json();
      const currentStatus = subscriptionData.status;
      
      console.log('Current PayPal subscription status:', currentStatus);
      
      // Check if already cancelled
      if (currentStatus === 'CANCELLED' || currentStatus === 'EXPIRED') {
        console.log('Subscription already cancelled/expired in PayPal');
        subscriptionAlreadyCancelled = true;
      }
    }

    // Only attempt to cancel if not already cancelled
    if (!subscriptionAlreadyCancelled) {
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
        
        // Check if subscription is already cancelled
        if (errorData.details?.[0]?.issue === 'SUBSCRIPTION_STATUS_INVALID') {
          // Subscription already cancelled in PayPal, just update Firebase
          console.log('Subscription already cancelled in PayPal, updating Firebase only');
        } else {
          throw new Error(errorData.message || 'Failed to cancel subscription with PayPal');
        }
      }
    }

    // Update user subscription status in Firebase
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      subscriptionStatus: 'cancelled',
      autoRenew: false,
      cancelledAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // Update subscription record if it exists
    try {
      const subscriptionRef = doc(db, 'subscriptions', subscriptionId);
      const subscriptionDoc = await getDoc(subscriptionRef);
      
      if (subscriptionDoc.exists()) {
        await updateDoc(subscriptionRef, {
          status: 'cancelled',
          cancelledAt: serverTimestamp(),
          autoRenew: false,
        });
      } else {
        // Create the subscription document if it doesn't exist
        await setDoc(subscriptionRef, {
          userId,
          subscriptionId,
          status: 'cancelled',
          cancelledAt: serverTimestamp(),
          autoRenew: false,
          platform: 'paypal',
        });
      }
    } catch (subscriptionError) {
      console.error('Error updating subscription record:', subscriptionError);
      // Continue even if subscription record update fails
    }

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
