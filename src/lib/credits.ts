import { db, auth } from './firebase';
import { doc, getDoc, setDoc, updateDoc, increment, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { TransformationType } from '@/types';

// Feature credit costs
export const FEATURE_COSTS: Record<TransformationType, number> = {
  'age': 8,
  'gender': 8,
  'filter': 1,
  'lip-color': 2,
  'face-beauty': 5,
  'face-slimming': 5,
  'skin-beauty': 5,
  'face-fusion': 8,
  'smart-beauty': 8,
  'hairstyle': 10,
  'expression': 12,
  'cartoon': 20,
  'image-enhance': 15,
  'image-dehaze': 1,
  'photo-colorize': 2,
  'image-sharpen': 2,
  'image-restore': 2,
  'photo-retouch': 3,
  'image-crop': 3,
  'style-transfer': 3,
  'image-upscale': 5,
  'photo-painting': 7,
  'anime-generator': 10,
  'image-extender': 25,
  'try-on-clothes': 15,
  'face-enhancer': 15,
  'hitchcock': 15,
};

// Subscription tiers
export type SubscriptionTier = 'free' | 'starter' | 'pro' | 'premium';
export type SubscriptionStatus = 'active' | 'cancelled' | 'suspended' | 'expired' | 'none';
export type PaymentPlatform = 'paypal' | 'apple' | null;

export interface UserCredits {
  credits: number;
  totalCreditsEarned: number;
  totalCreditsSpent: number;
  subscriptionTier: SubscriptionTier;
  subscriptionStatus: SubscriptionStatus;
  subscriptionPlatform: PaymentPlatform;
  subscriptionId: string | null;
  subscriptionStartDate: Date | null;
  subscriptionEndDate: Date | null;
  subscriptionRenewDate: Date | null;
  autoRenew: boolean;
  lastPaymentDate: Date | null;
  lastPaymentAmount: number | null;
}

export interface Transaction {
  userId: string;
  type: 'credit_purchase' | 'credit_usage' | 'subscription_renewal' | 'refund' | 'free_credits';
  credits: number;
  amount: number | null;
  currency: string;
  featureType: string | null;
  featureCost: number | null;
  platform: 'paypal' | 'apple' | 'free';
  paymentId: string | null;
  subscriptionId: string | null;
  timestamp: Date;
  metadata: Record<string, any>;
}

/**
 * Initialize user credits (called on first sign-up)
 */
export const initializeUserCredits = async (userId: string): Promise<void> => {
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    // New user - give 5 free credits
    await setDoc(userRef, {
      credits: 5,
      totalCreditsEarned: 5,
      totalCreditsSpent: 0,
      subscriptionTier: 'free',
      subscriptionStatus: 'none',
      subscriptionPlatform: null,
      subscriptionId: null,
      subscriptionStartDate: null,
      subscriptionEndDate: null,
      subscriptionRenewDate: null,
      autoRenew: false,
      lastPaymentDate: null,
      lastPaymentAmount: null,
      createdAt: serverTimestamp(),
    });

    // Log the free credits transaction
    await addDoc(collection(db, 'transactions'), {
      userId,
      type: 'free_credits',
      credits: 5,
      amount: null,
      currency: 'USD',
      featureType: null,
      featureCost: null,
      platform: 'free',
      paymentId: null,
      subscriptionId: null,
      timestamp: serverTimestamp(),
      metadata: {
        reason: 'new_user_bonus',
      },
    });

    console.log('Initialized user credits:', userId);
  }
};

/**
 * Get user's current credit balance
 */
export const getUserCredits = async (userId?: string): Promise<UserCredits | null> => {
  const uid = userId || auth.currentUser?.uid;
  if (!uid) return null;

  const userRef = doc(db, 'users', uid);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    await initializeUserCredits(uid);
    return getUserCredits(uid);
  }

  const data = userDoc.data();
  return {
    credits: data.credits || 0,
    totalCreditsEarned: data.totalCreditsEarned || 0,
    totalCreditsSpent: data.totalCreditsSpent || 0,
    subscriptionTier: data.subscriptionTier || 'free',
    subscriptionStatus: data.subscriptionStatus || 'none',
    subscriptionPlatform: data.subscriptionPlatform || null,
    subscriptionId: data.subscriptionId || null,
    subscriptionStartDate: data.subscriptionStartDate?.toDate() || null,
    subscriptionEndDate: data.subscriptionEndDate?.toDate() || null,
    subscriptionRenewDate: data.subscriptionRenewDate?.toDate() || null,
    autoRenew: data.autoRenew || false,
    lastPaymentDate: data.lastPaymentDate?.toDate() || null,
    lastPaymentAmount: data.lastPaymentAmount || null,
  };
};

/**
 * Check if user has enough credits for a feature
 */
export const hasEnoughCredits = async (
  featureType: TransformationType,
  userId?: string
): Promise<boolean> => {
  const cost = FEATURE_COSTS[featureType];
  const userCredits = await getUserCredits(userId);
  
  if (!userCredits) return false;
  
  return userCredits.credits >= cost;
};

/**
 * Deduct credits for using a feature
 */
export const deductCredits = async (
  userId: string,
  cost: number,
  featureType: TransformationType
): Promise<{ success: boolean; remainingCredits: number; error?: string }> => {
  if (!userId) {
    return { success: false, remainingCredits: 0, error: 'User not authenticated' };
  }

  const userCredits = await getUserCredits(userId);

  if (!userCredits) {
    return { success: false, remainingCredits: 0, error: 'User credits not found' };
  }

  if (userCredits.credits < cost) {
    return {
      success: false,
      remainingCredits: userCredits.credits,
      error: `Insufficient credits. Need ${cost} credits, have ${userCredits.credits}`,
    };
  }

  // Deduct credits
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    credits: increment(-cost),
    totalCreditsSpent: increment(cost),
  });

  // Log transaction
  await addDoc(collection(db, 'transactions'), {
    userId,
    type: 'credit_usage',
    credits: -cost,
    amount: null,
    currency: 'USD',
    featureType,
    featureCost: cost,
    platform: 'free',
    paymentId: null,
    subscriptionId: userCredits.subscriptionId,
    timestamp: serverTimestamp(),
    metadata: {
      subscriptionTier: userCredits.subscriptionTier,
    },
  });

  return {
    success: true,
    remainingCredits: userCredits.credits - cost,
  };
};

/**
 * Add credits to user account (for purchases/renewals)
 */
export const addCredits = async (
  userId: string,
  credits: number,
  platform: 'paypal' | 'apple',
  paymentId: string,
  amount: number,
  subscriptionId?: string
): Promise<void> => {
  const userRef = doc(db, 'users', userId);
  
  await updateDoc(userRef, {
    credits: increment(credits),
    totalCreditsEarned: increment(credits),
    lastPaymentDate: serverTimestamp(),
    lastPaymentAmount: amount,
  });

  // Log transaction
  await addDoc(collection(db, 'transactions'), {
    userId,
    type: subscriptionId ? 'subscription_renewal' : 'credit_purchase',
    credits,
    amount,
    currency: 'USD',
    featureType: null,
    featureCost: null,
    platform,
    paymentId,
    subscriptionId: subscriptionId || null,
    timestamp: serverTimestamp(),
    metadata: {},
  });

  console.log(`Added ${credits} credits to user ${userId}`);
};

/**
 * Get credit cost for a feature
 */
export const getFeatureCost = (featureType: TransformationType): number => {
  return FEATURE_COSTS[featureType] || 0;
};

/**
 * Get subscription tier benefits
 */
export const getSubscriptionBenefits = (tier: SubscriptionTier) => {
  const benefits = {
    free: {
      credits: 5,
      price: 0,
      monthly: false,
      features: ['One-time 5 credits', 'Access to all features', 'Pay per use'],
    },
    starter: {
      credits: 400,
      price: 4.99,
      monthly: true,
      features: ['400 credits monthly', 'Auto-renewal', '~20% savings'],
    },
    pro: {
      credits: 1000,
      price: 9.99,
      monthly: true,
      features: ['1,000 credits monthly', 'Auto-renewal', '~35% savings', 'Priority support'],
    },
    premium: {
      credits: 3500,
      price: 19.99,
      monthly: true,
      features: ['3,500 credits monthly', 'Auto-renewal', '~45% savings', 'Priority support', 'Early access to new features'],
    },
  };

  return benefits[tier];
};
