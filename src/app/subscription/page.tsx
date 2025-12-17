'use client';

import { useState, useEffect } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { useAuth } from '@/contexts/AuthContext';
import { getUserCredits, UserCredits, getSubscriptionBenefits, FEATURE_COSTS } from '@/lib/credits';
import { Check, Crown, Zap, Coins, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components';

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '';

interface SubscriptionPlan {
  id: 'starter' | 'pro' | 'premium';
  name: string;
  price: number;
  credits: number;
  features: string[];
  icon: React.ReactNode;
  gradient: string;
  popular?: boolean;
}

const plans: SubscriptionPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 4.99,
    credits: 400,
    features: [
      '400 credits monthly',
      'All AI features access',
      'Auto-renewal',
      '~20% savings vs pay-per-use',
      'Email support',
    ],
    icon: <Coins className="w-8 h-8" />,
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 9.99,
    credits: 1000,
    features: [
      '1,000 credits monthly',
      'All AI features access',
      'Auto-renewal',
      '~35% savings vs pay-per-use',
      'Priority email support',
      'Early access to beta features',
    ],
    icon: <Zap className="w-8 h-8" />,
    gradient: 'from-purple-500 to-pink-500',
    popular: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 19.99,
    credits: 3500,
    features: [
      '3,500 credits monthly',
      'All AI features access',
      'Auto-renewal',
      '~45% savings vs pay-per-use',
      '24/7 priority support',
      'Early access to all new features',
      'Custom API integration',
    ],
    icon: <Crown className="w-8 h-8" />,
    gradient: 'from-yellow-500 to-orange-500',
  },
];

// Feature costs for display
const featureCostsList = [
  { name: 'Face Filters', cost: 1 },
  { name: 'Image Dehaze', cost: 1 },
  { name: 'Lip Color', cost: 2 },
  { name: 'Photo Colorize', cost: 2 },
  { name: 'Image Sharpen', cost: 2 },
  { name: 'Image Restore', cost: 2 },
  { name: 'Photo Retouch', cost: 3 },
  { name: 'AI Image Crop', cost: 3 },
  { name: 'Style Transfer', cost: 3 },
  { name: 'Face Beauty', cost: 5 },
  { name: 'Face Slimming', cost: 5 },
  { name: 'Skin Beauty', cost: 5 },
  { name: 'Image Upscaler', cost: 5 },
  { name: 'Photo to Painting', cost: 7 },
  { name: 'Age Transformation', cost: 8 },
  { name: 'Gender Transformation', cost: 8 },
  { name: 'Merge Portraits', cost: 8 },
  { name: 'Smart Beauty', cost: 8 },
  { name: 'Hairstyle Changer', cost: 10 },
  { name: 'Anime Generator', cost: 10 },
  { name: 'Facial Expression', cost: 12 },
  { name: 'Image Enhancer', cost: 15 },
  { name: 'Face Enhancer', cost: 15 },
  { name: 'Hitchcock Effects', cost: 15 },
  { name: 'Try on Clothes', cost: 15 },
  { name: 'Cartoon Yourself', cost: 20 },
  { name: 'Image Extender', cost: 25 },
];

export default function SubscriptionPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [credits, setCredits] = useState<UserCredits | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadCredits();
    }
  }, [user]);

  const loadCredits = async () => {
    try {
      const userCredits = await getUserCredits();
      setCredits(userCredits);
    } catch (error) {
      console.error('Failed to load credits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayPalSuccess = async (details: any, planId: string) => {
    console.log('Payment successful:', details);
    // TODO: Call your backend API to verify payment and add credits
    alert('Subscription successful! Credits will be added shortly.');
    router.push('/transform');
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mb-4">
              Choose Your Plan
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get more credits and unlock amazing AI transformations at a discounted rate
            </p>
            
            {/* Current Credits Display */}
            {credits && (
              <div className="mt-6 inline-flex items-center gap-3 px-6 py-3 bg-white rounded-2xl shadow-lg">
                <Sparkles className="w-6 h-6 text-purple-600" />
                <div className="text-left">
                  <p className="text-sm text-gray-600">Current Balance</p>
                  <p className="text-2xl font-bold text-purple-600">{credits.credits} Credits</p>
                </div>
              </div>
            )}
          </div>

          {/* Subscription Plans */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative bg-white rounded-3xl shadow-xl overflow-hidden transition-transform hover:scale-105 ${
                  plan.popular ? 'ring-4 ring-purple-500' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-2 rounded-bl-2xl font-semibold">
                    Most Popular
                  </div>
                )}

                <div className={`bg-gradient-to-r ${plan.gradient} p-8 text-white`}>
                  <div className="flex items-center gap-3 mb-4">
                    {plan.icon}
                    <h3 className="text-2xl font-bold">{plan.name}</h3>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold">${plan.price}</span>
                    <span className="text-lg opacity-90">/month</span>
                  </div>
                  <p className="mt-2 text-lg font-semibold">{plan.credits} Credits Monthly</p>
                </div>

                <div className="p-8">
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {PAYPAL_CLIENT_ID ? (
                    <PayPalScriptProvider options={{ clientId: PAYPAL_CLIENT_ID, vault: true, intent: 'subscription' }}>
                      <PayPalButtons
                        style={{ layout: 'vertical', shape: 'pill' }}
                        createSubscription={(data, actions) => {
                          // TODO: Use actual PayPal Plan IDs from your PayPal dashboard
                          return actions.subscription.create({
                            plan_id: `PLAN_ID_${plan.id.toUpperCase()}`, // Replace with real plan IDs
                          });
                        }}
                        onApprove={(data, actions) => {
                          handlePayPalSuccess(data, plan.id);
                        }}
                        onError={(err) => {
                          console.error('PayPal error:', err);
                          alert('Payment failed. Please try again.');
                        }}
                      />
                    </PayPalScriptProvider>
                  ) : (
                    <button
                      className={`w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r ${plan.gradient} hover:shadow-lg transition-shadow`}
                    >
                      Configure PayPal First
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Free Plan */}
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-16">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Free Plan</h3>
                <p className="text-gray-600">Get 5 free credits when you sign up. Perfect to try our features!</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-gray-800">5 Credits</p>
                <p className="text-sm text-gray-500">One-time only</p>
              </div>
            </div>
          </div>

          {/* Feature Costs Table */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              Credit Costs Per Feature
            </h2>
            <p className="text-gray-600 text-center mb-8">
              See how many credits each AI transformation costs
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {featureCostsList.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl hover:shadow-md transition-shadow"
                >
                  <span className="font-medium text-gray-800">{feature.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-purple-600">{feature.cost}</span>
                    <Coins className="w-5 h-5 text-purple-600" />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl">
              <p className="text-center text-gray-700">
                💡 <strong>Pro Tip:</strong> Subscribe to a monthly plan to save up to 45% compared to pay-per-use!
              </p>
            </div>
          </div>

        </div>
      </div>
    </ProtectedRoute>
  );
}
