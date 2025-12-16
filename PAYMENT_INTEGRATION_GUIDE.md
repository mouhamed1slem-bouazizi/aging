# Payment Integration Guide

This document outlines the requirements and steps to integrate PayPal (Web/Android) and Apple In-App Purchases (iOS) for the credit-based subscription system.

---

## 📋 Subscription Plans

### Free Tier
- **5 credits** (one-time only)
- Access to all features (pay per use)
- No monthly renewal

### Paid Tiers (Monthly Subscriptions)

| Plan Name | Monthly Price | Credits | Monthly Savings |
|-----------|--------------|---------|-----------------|
| **Starter** | $4.99 | 400 credits | ~20% vs pay-per-use |
| **Pro** | $9.99 | 1,000 credits | ~35% vs pay-per-use |
| **Premium** | $19.99 | 3,500 credits | ~45% vs pay-per-use |

**Credits renew monthly** - Credits are added to balance on subscription renewal date.

---

## 💰 Feature Credit Costs

| Feature | Credits | Feature | Credits |
|---------|---------|---------|---------|
| Age Transformation | 8 | Image Enhancer | 15 |
| Gender Transformation | 8 | Image Dehaze | 1 |
| Face Filters | 1 | Photo Colorize | 2 |
| Lip Color | 2 | Image Sharpen | 2 |
| Face Beauty | 5 | Image Restore | 2 |
| Face Slimming | 5 | Photo Retouch | 3 |
| Skin Beauty | 5 | AI Image Crop | 3 |
| Merge Portraits | 8 | Style Transfer | 3 |
| Smart Beauty | 8 | Image Upscaler | 5 |
| Hairstyle Changer | 10 | Photo to Painting | 7 |
| Facial Expression | 12 | Anime Generator | 10 |
| Cartoon Yourself | 20 | Image Extender | 25 |
| Try on Clothes | 15 | Hitchcock Effects | 15 |
| Face Enhancer | 15 | - | - |

---

## 🔧 PayPal Integration (Web + Android)

### What You Need from PayPal

#### 1. Create PayPal Business Account
- Sign up at: https://www.paypal.com/businesssolutions
- Verify your business identity
- Complete account setup

#### 2. Get API Credentials
Navigate to: **PayPal Developer Dashboard** → https://developer.paypal.com/dashboard/

**Required Credentials:**
- `PAYPAL_CLIENT_ID` - Your app's client ID
- `PAYPAL_CLIENT_SECRET` - Your app's secret key
- `PAYPAL_MODE` - "sandbox" (testing) or "live" (production)

#### 3. Create Subscription Plans in PayPal
You need to create 3 subscription products:

**Product 1: Starter Plan**
- Product Name: `AI Portrait Starter - 400 Credits`
- Product Type: `Service`
- Category: `Software`
- Billing Cycle: `Monthly`
- Price: `$4.99 USD`
- Auto-renewal: `Yes`

**Product 2: Pro Plan**
- Product Name: `AI Portrait Pro - 1000 Credits`
- Product Type: `Service`
- Category: `Software`
- Billing Cycle: `Monthly`
- Price: `$9.99 USD`
- Auto-renewal: `Yes`

**Product 3: Premium Plan**
- Product Name: `AI Portrait Premium - 3500 Credits`
- Product Type: `Service`
- Category: `Software`
- Billing Cycle: `Monthly`
- Price: `$19.99 USD`
- Auto-renewal: `Yes`

**After creating, save these IDs:**
- `PAYPAL_STARTER_PLAN_ID`
- `PAYPAL_PRO_PLAN_ID`
- `PAYPAL_PREMIUM_PLAN_ID`

#### 4. Configure Webhooks
Set up webhook URL to receive subscription events:

**Webhook URL:** `https://yourdomain.com/api/webhooks/paypal`

**Events to Subscribe:**
- `BILLING.SUBSCRIPTION.CREATED`
- `BILLING.SUBSCRIPTION.ACTIVATED`
- `BILLING.SUBSCRIPTION.CANCELLED`
- `BILLING.SUBSCRIPTION.SUSPENDED`
- `BILLING.SUBSCRIPTION.UPDATED`
- `PAYMENT.SALE.COMPLETED`
- `PAYMENT.SALE.REFUNDED`

**Save this:**
- `PAYPAL_WEBHOOK_ID` - Webhook ID for verification

#### 5. Environment Variables Needed
```env
# PayPal Configuration
PAYPAL_CLIENT_ID=your_client_id_here
PAYPAL_CLIENT_SECRET=your_client_secret_here
PAYPAL_MODE=sandbox # or 'live' for production
PAYPAL_WEBHOOK_ID=your_webhook_id_here

# PayPal Plan IDs
PAYPAL_STARTER_PLAN_ID=P-xxxxxxxxxxxxx
PAYPAL_PRO_PLAN_ID=P-xxxxxxxxxxxxx
PAYPAL_PREMIUM_PLAN_ID=P-xxxxxxxxxxxxx
```

---

## 🍎 Apple In-App Purchase Integration (iOS)

### What You Need from Apple

#### 1. Enroll in Apple Developer Program
- Cost: **$99/year**
- Sign up at: https://developer.apple.com/programs/
- Complete enrollment process

#### 2. App Store Connect Setup

**Create App in App Store Connect:**
- Go to: https://appstoreconnect.apple.com
- Create new app with unique Bundle ID
- Example: `com.yourcompany.aiportrait`

#### 3. Create Auto-Renewable Subscriptions

Navigate to: **App Store Connect** → **Your App** → **In-App Purchases** → **Create**

**Subscription Group:**
- Group Name: `AI Portrait Credits`
- Group Reference Name: `ai_portrait_credits`

**Create 3 Subscriptions in the group:**

**Subscription 1: Starter**
- Product ID: `com.yourcompany.aiportrait.starter`
- Reference Name: `Starter Plan - 400 Credits`
- Subscription Duration: `1 Month`
- Price: `$4.99 USD` (Tier 5)
- Localization: Add description in all target languages

**Subscription 2: Pro**
- Product ID: `com.yourcompany.aiportrait.pro`
- Reference Name: `Pro Plan - 1000 Credits`
- Subscription Duration: `1 Month`
- Price: `$9.99 USD` (Tier 10)
- Localization: Add description in all target languages

**Subscription 3: Premium**
- Product ID: `com.yourcompany.aiportrait.premium`
- Reference Name: `Premium Plan - 3500 Credits`
- Subscription Duration: `1 Month`
- Price: `$19.99 USD` (Tier 20)
- Localization: Add description in all target languages

#### 4. Configure Server-to-Server Notifications

**Generate App Store Connect API Key:**
1. Go to: **Users and Access** → **Keys** → **App Store Connect API**
2. Click **Generate API Key**
3. Download the `.p8` key file (SAVE IT SECURELY - can only download once)

**Save these credentials:**
- `APPLE_KEY_ID` - Key ID (e.g., `2X9R4HXF34`)
- `APPLE_ISSUER_ID` - Issuer ID (e.g., `57246542-96fe-1a63-e053-0824d011072a`)
- `APPLE_PRIVATE_KEY` - Content of the `.p8` file

**Set Notification URL:**
- URL: `https://yourdomain.com/api/webhooks/apple`
- Version: `V2`

#### 5. Subscription Information

**Required fields for each subscription:**
- Subscription Name (user-facing)
- Description (explain what credits are)
- Review Information (for App Review team)
- Screenshot (showing the subscription in your app)

#### 6. Environment Variables Needed
```env
# Apple In-App Purchase Configuration
APPLE_KEY_ID=2X9R4HXF34
APPLE_ISSUER_ID=57246542-96fe-1a63-e053-0824d011072a
APPLE_TEAM_ID=XXXXXXXXXX
APPLE_BUNDLE_ID=com.yourcompany.aiportrait
APPLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nMIGTAgEAMBMGByq...\n-----END PRIVATE KEY-----

# Apple Product IDs
APPLE_STARTER_PRODUCT_ID=com.yourcompany.aiportrait.starter
APPLE_PRO_PRODUCT_ID=com.yourcompany.aiportrait.pro
APPLE_PREMIUM_PRODUCT_ID=com.yourcompany.aiportrait.premium

# Shared Secret (for receipt validation)
APPLE_SHARED_SECRET=your_shared_secret_here
```

---

## 📱 Platform-Specific Implementation

### Web + Android
- Use **PayPal Subscriptions API**
- Payment processed in browser/webview
- Works with PayPal SDK for React
- Redirect-based flow for authentication

### iOS
- Use **StoreKit 2** (native iOS framework)
- Payment processed through Apple ecosystem
- Must use Apple's In-App Purchase (required by App Store)
- Server-side receipt validation

### Cross-Platform Credit Sync
- **Firebase Firestore** - Store user credits and subscription status
- All platforms read/write to same Firebase database
- Real-time sync across devices

---

## 🗄️ Database Schema (Firestore)

### Collection: `users/{userId}`
```typescript
{
  email: string,
  displayName: string,
  photoURL: string,
  createdAt: timestamp,
  
  // Credit System
  credits: number,              // Current available credits
  totalCreditsEarned: number,   // Lifetime total
  totalCreditsSpent: number,    // Lifetime spent
  
  // Subscription
  subscriptionTier: 'free' | 'starter' | 'pro' | 'premium',
  subscriptionStatus: 'active' | 'canceled' | 'expired' | 'none',
  subscriptionPlatform: 'paypal' | 'apple' | null,
  subscriptionId: string | null,        // PayPal/Apple subscription ID
  subscriptionStartDate: timestamp | null,
  subscriptionEndDate: timestamp | null,
  subscriptionRenewDate: timestamp | null,
  autoRenew: boolean,
  
  // Payment History
  lastPaymentDate: timestamp | null,
  lastPaymentAmount: number | null,
}
```

### Collection: `transactions/{transactionId}`
```typescript
{
  userId: string,
  type: 'credit_purchase' | 'credit_usage' | 'subscription_renewal' | 'refund',
  credits: number,              // Positive for earning, negative for spending
  amount: number | null,        // Money amount (for purchases)
  currency: string,             // 'USD'
  
  // Feature Usage (for credit_usage type)
  featureType: string | null,   // e.g., 'age', 'gender', 'face-filter'
  featureCost: number | null,
  
  // Payment Details
  platform: 'paypal' | 'apple' | 'free',
  paymentId: string | null,     // PayPal order ID or Apple transaction ID
  subscriptionId: string | null,
  
  timestamp: timestamp,
  metadata: object,             // Additional data
}
```

### Collection: `subscriptions/{subscriptionId}`
```typescript
{
  userId: string,
  platform: 'paypal' | 'apple',
  planId: string,               // PayPal plan ID or Apple product ID
  tier: 'starter' | 'pro' | 'premium',
  status: 'active' | 'canceled' | 'expired' | 'suspended',
  
  monthlyCredits: number,       // 400, 1000, or 3500
  monthlyPrice: number,         // 4.99, 9.99, or 19.99
  
  createdAt: timestamp,
  startDate: timestamp,
  currentPeriodStart: timestamp,
  currentPeriodEnd: timestamp,
  nextBillingDate: timestamp | null,
  canceledAt: timestamp | null,
  
  autoRenew: boolean,
  
  // Platform-specific IDs
  paypalSubscriptionId: string | null,
  appleOriginalTransactionId: string | null,
}
```

---

## 🔐 Security Requirements

### PayPal
- Store credentials in environment variables (never in code)
- Verify webhook signatures using `PAYPAL_WEBHOOK_ID`
- Use HTTPS for all webhook endpoints
- Validate subscription status before granting credits

### Apple
- Store private key securely (use environment variables)
- Validate receipts server-side (never trust client)
- Verify transaction signatures
- Use HTTPS for notification endpoints
- Implement receipt verification endpoint

### General
- Never store payment card details
- Log all transactions for audit trail
- Implement idempotency for credit grants (prevent duplicates)
- Rate limit API endpoints
- Encrypt sensitive data in database

---

## 📝 Next Steps

1. **Create PayPal Business Account** and get credentials
2. **Enroll in Apple Developer Program** ($99/year)
3. **Set up subscription products** in both platforms
4. **Configure webhooks** for both platforms
5. **Add environment variables** to `.env.local`
6. **Implement credit system** (database schema + logic)
7. **Integrate PayPal SDK** for web/Android
8. **Integrate StoreKit 2** for iOS (using Capacitor)
9. **Test in sandbox mode** before going live
10. **Submit for App Store Review** (Apple requires reviewing subscriptions)

---

## 📚 Official Documentation

- **PayPal Subscriptions API**: https://developer.paypal.com/docs/subscriptions/
- **PayPal Webhooks**: https://developer.paypal.com/api/rest/webhooks/
- **Apple In-App Purchase**: https://developer.apple.com/in-app-purchase/
- **StoreKit 2**: https://developer.apple.com/documentation/storekit
- **App Store Server API**: https://developer.apple.com/documentation/appstoreserverapi
- **Capacitor In-App Purchase**: https://github.com/capacitor-community/in-app-purchases

---

## ⚠️ Important Notes

1. **Apple's 30% Commission**: Apple takes 30% of all subscription revenue (15% after year 1)
2. **PayPal Fees**: ~2.9% + $0.30 per transaction
3. **Free Trial**: Can offer 3-day or 7-day free trial for new subscribers
4. **Refunds**: Must handle refund webhooks and deduct credits
5. **Subscription Changes**: Allow users to upgrade/downgrade plans
6. **Cancellation**: Users can cancel anytime, credits valid until period end
7. **Privacy**: Must have clear privacy policy for payment data
8. **Terms of Service**: Required for subscription services

---

## 🚀 Estimated Timeline

- **PayPal Integration**: 1-2 weeks (backend + frontend)
- **Apple IAP Integration**: 2-3 weeks (native code + server validation)
- **Credit System**: 1 week (database + logic)
- **Testing**: 1-2 weeks (sandbox testing both platforms)
- **App Store Review**: 1-2 weeks (Apple review process)

**Total**: 6-10 weeks for complete implementation

---

**Ready to proceed with implementation? Let me know when you have the credentials and we'll start building!** 🎉
