# PayPal Webhook Setup Guide

This guide will help you set up PayPal webhooks to automatically sync subscription data (next billing date, status, etc.) from PayPal to your Firebase database.

## 🎯 What the Webhook Does

Once configured, the webhook will automatically:
- ✅ Add credits when a subscription is activated
- ✅ Add credits on monthly renewals
- ✅ Update next billing date from PayPal
- ✅ Update subscription status (active/cancelled/suspended)
- ✅ Handle subscription cancellations
- ✅ Track all payment transactions

---

## 📋 Prerequisites

Before setting up the webhook, make sure you have:
- ✅ Deployed your app to a public URL (e.g., https://agefx.onrender.com)
- ✅ PayPal Developer account
- ✅ PayPal Sandbox/Live credentials in your `.env.local`

---

## 🚀 Step-by-Step Setup

### Step 1: Deploy Your App First

Your webhook URL needs to be publicly accessible. Deploy to:
- Render.com (your current setup)
- Vercel
- Netlify
- Or any hosting platform

**Your webhook URL will be:** `https://agefx.onrender.com/api/webhooks/paypal`

---

### Step 2: Access PayPal Developer Dashboard

#### For Sandbox (Testing):
1. Go to: https://developer.paypal.com/dashboard/
2. Click **"Apps & Credentials"**
3. Make sure you're on the **"Sandbox"** tab

#### For Live (Production):
1. Go to: https://developer.paypal.com/dashboard/
2. Click **"Apps & Credentials"**
3. Switch to the **"Live"** tab

---

### Step 3: Create/Select Your App

1. If you already have an app, **click on it**
2. If not, click **"Create App"** and give it a name (e.g., "AgeFX Subscriptions")
3. Select **"Merchant"** as the app type
4. Click **"Create App"**

---

### Step 4: Configure Webhooks

1. Scroll down to the **"Webhooks"** section
2. Click **"Add Webhook"**

3. **Webhook URL:** Enter your webhook endpoint
   ```
   https://agefx.onrender.com/api/webhooks/paypal
   ```

4. **Event Types:** Select the following events:
   - ✅ `BILLING.SUBSCRIPTION.ACTIVATED` - Subscription starts
   - ✅ `BILLING.SUBSCRIPTION.CANCELLED` - User cancels
   - ✅ `BILLING.SUBSCRIPTION.SUSPENDED` - Payment fails
   - ✅ `BILLING.SUBSCRIPTION.EXPIRED` - Subscription ends
   - ✅ `PAYMENT.SALE.COMPLETED` - Monthly renewal payment

5. Click **"Save"**

---

### Step 5: Copy Webhook ID

After saving, PayPal will show you a **Webhook ID** (looks like: `7AB12345CD678EF90`)

**IMPORTANT:** Copy this ID!

---

### Step 6: Add Webhook ID to Environment Variables

#### On Render.com:
1. Go to your Render dashboard
2. Click on your service (agefx)
3. Click **"Environment"** tab
4. Click **"Add Environment Variable"**
5. Add:
   - **Key:** `PAYPAL_WEBHOOK_ID`
   - **Value:** `7AB12345CD678EF90` (your actual webhook ID)
6. Click **"Save Changes"**
7. Your app will redeploy automatically

#### Locally (for testing):
Add to your `.env.local` file:
```env
PAYPAL_WEBHOOK_ID=7AB12345CD678EF90
```

---

### Step 7: Test the Webhook

#### Option A: Create a Test Subscription (Recommended)
1. Go to your app's subscription page: https://agefx.onrender.com/subscription
2. Subscribe to a plan using **PayPal Sandbox test account**
3. Check Firebase to see if:
   - Credits were added
   - `subscriptionRenewDate` is set
   - `subscriptionStatus` is "active"

#### Option B: Use PayPal Webhook Simulator
1. In PayPal Developer Dashboard, go to your webhook
2. Click **"Webhook Simulator"**
3. Select event: `BILLING.SUBSCRIPTION.ACTIVATED`
4. Fill in test data
5. Click **"Send Test"**
6. Check if webhook endpoint returns 200 OK

---

### Step 8: Monitor Webhooks

To see webhook activity:
1. Go to PayPal Developer Dashboard
2. Click on your webhook
3. Click **"Webhook Events"** tab
4. You'll see all webhook deliveries and their status

**Successful webhook:** ✅ Status 200  
**Failed webhook:** ❌ Status 4xx/5xx

---

## 🔍 Troubleshooting

### Webhook Returns 401 (Unauthorized)
- ❌ Problem: Webhook signature verification failed
- ✅ Solution: Make sure `PAYPAL_WEBHOOK_ID` matches the ID from PayPal dashboard

### Webhook Returns 500 (Server Error)
- ❌ Problem: Error in webhook handler code
- ✅ Solution: Check Render logs for error details
  1. Go to Render dashboard
  2. Click **"Logs"** tab
  3. Look for errors when webhook is triggered

### Subscription Data Not Updating
- ❌ Problem: Webhook not receiving events
- ✅ Solution: 
  1. Verify webhook URL is correct
  2. Make sure you selected all required events
  3. Check if webhook is enabled in PayPal

### Firebase Data Not Updating
- ❌ Problem: User ID mapping failed
- ✅ Solution: Make sure `custom_id` is being passed to PayPal during subscription creation (already implemented in code)

---

## 📊 What Data Gets Synced

When webhook processes events, it updates Firebase with:

```javascript
{
  // User document: users/{userId}
  subscriptionTier: 'pro',
  subscriptionStatus: 'active',
  subscriptionPlatform: 'paypal',
  subscriptionId: 'I-BSXXEL079419',
  subscriptionStartDate: Timestamp,
  subscriptionRenewDate: Date(2026-01-18), // ← Accurate date from PayPal!
  autoRenew: true,
  credits: 1000,
  totalCreditsEarned: 1000,
  
  // Subscription document: subscriptions/{subscriptionId}
  userId: 'xxx',
  platform: 'paypal',
  planId: 'P-xxxxx',
  tier: 'pro',
  status: 'active',
  monthlyCredits: 1000,
  monthlyPrice: 9.99,
  nextBillingDate: Date(2026-01-18), // ← Accurate date from PayPal!
  paypalSubscriptionId: 'I-BSXXEL079419'
}
```

---

## ✅ Verification Checklist

After setup, verify everything works:

- [ ] Webhook URL is publicly accessible
- [ ] Webhook ID added to environment variables
- [ ] All 5 event types are selected in PayPal
- [ ] Test subscription was created successfully
- [ ] Credits were added to Firebase
- [ ] `subscriptionRenewDate` shows correct date from PayPal
- [ ] Profile page shows accurate "Next Billing Date"
- [ ] Webhook events show "200 OK" in PayPal dashboard

---

## 🎉 Success!

Once configured, your app will automatically:
- Get accurate billing dates from PayPal (no more 30-day estimates)
- Handle monthly renewals automatically
- Keep subscription status in sync
- Track all payment transactions

Your users will see the **exact** next billing date from PayPal on their profile page!

---

## 📝 Notes

- **Sandbox vs Live:** You need to configure webhooks separately for Sandbox and Live environments
- **Multiple Webhooks:** You can have multiple webhooks for different environments
- **Webhook Retries:** PayPal retries failed webhooks automatically
- **Security:** Webhook signature verification is enabled for security

---

## 🆘 Need Help?

If you encounter issues:
1. Check Render logs for errors
2. Verify all environment variables are set
3. Test webhook using PayPal's webhook simulator
4. Check Firebase to see if data is being written

---

**Current Status:**
- ✅ Webhook code: Already implemented
- ⏳ Webhook configuration: Follow steps above
- ⏳ Testing: After configuration

Your webhook endpoint is ready at: `https://agefx.onrender.com/api/webhooks/paypal`
