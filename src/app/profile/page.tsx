'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getUserCredits, UserCredits } from '@/lib/credits';
import { ProtectedRoute } from '@/components';
import { 
  User, 
  Mail, 
  Calendar, 
  CreditCard, 
  TrendingUp, 
  TrendingDown,
  Crown,
  Zap,
  Coins,
  AlertCircle,
  CheckCircle,
  ArrowUpCircle,
  ArrowDownCircle,
  XCircle
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: 4.99,
    credits: 400,
    icon: <Coins className="w-6 h-6" />,
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 9.99,
    credits: 1000,
    icon: <Zap className="w-6 h-6" />,
    gradient: 'from-purple-500 to-pink-500',
    popular: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 19.99,
    credits: 3500,
    icon: <Crown className="w-6 h-6" />,
    gradient: 'from-yellow-500 to-orange-500',
  },
];

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [credits, setCredits] = useState<UserCredits | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);

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

  const getCurrentPlan = () => {
    return plans.find(p => p.id === credits?.subscriptionTier) || null;
  };

  const getAvailableUpgrades = () => {
    const currentPlan = getCurrentPlan();
    if (!currentPlan) return plans;
    
    const currentIndex = plans.findIndex(p => p.id === currentPlan.id);
    return plans.filter((_, index) => index > currentIndex);
  };

  const getAvailableDowngrades = () => {
    const currentPlan = getCurrentPlan();
    if (!currentPlan) return [];
    
    const currentIndex = plans.findIndex(p => p.id === currentPlan.id);
    return plans.filter((_, index) => index < currentIndex);
  };

  const handleCancelSubscription = async () => {
    setCancelling(true);
    try {
      // TODO: Call PayPal API to cancel subscription
      alert('To cancel your subscription, please log in to your PayPal account and manage your subscriptions there.');
      setShowCancelModal(false);
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
      alert('Failed to cancel subscription. Please try again or contact support.');
    } finally {
      setCancelling(false);
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'N/A';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const getDaysUntilRenewal = () => {
    if (!credits?.subscriptionRenewDate) return null;
    const now = new Date();
    const renewDate = new Date(credits.subscriptionRenewDate);
    const diffTime = renewDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading profile...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const currentPlan = getCurrentPlan();
  const upgrades = getAvailableUpgrades();
  const downgrades = getAvailableDowngrades();
  const daysUntilRenewal = getDaysUntilRenewal();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mb-4">
              My Profile
            </h1>
            <p className="text-gray-600 text-lg">
              Manage your account and subscription
            </p>
          </div>

          {/* Profile Info Card */}
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
            <div className="flex items-center gap-6 mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{user?.displayName || 'User'}</h2>
                <div className="flex items-center gap-2 text-gray-600 mt-1">
                  <Mail className="w-4 h-4" />
                  <span>{user?.email}</span>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Coins className="w-6 h-6 text-blue-600" />
                  <span className="text-sm font-medium text-gray-600">Current Credits</span>
                </div>
                <p className="text-3xl font-bold text-blue-600">{credits?.credits || 0}</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                  <span className="text-sm font-medium text-gray-600">Total Earned</span>
                </div>
                <p className="text-3xl font-bold text-green-600">{credits?.totalCreditsEarned || 0}</p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingDown className="w-6 h-6 text-orange-600" />
                  <span className="text-sm font-medium text-gray-600">Total Spent</span>
                </div>
                <p className="text-3xl font-bold text-orange-600">{credits?.totalCreditsSpent || 0}</p>
              </div>
            </div>
          </div>

          {/* Subscription Info Card */}
          {credits?.subscriptionStatus === 'active' && currentPlan ? (
            <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Current Subscription</h3>
              
              <div className={`bg-gradient-to-r ${currentPlan.gradient} rounded-2xl p-6 text-white mb-6`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {currentPlan.icon}
                    <h4 className="text-2xl font-bold">{currentPlan.name} Plan</h4>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold">${currentPlan.price}</p>
                    <p className="text-sm opacity-90">per month</p>
                  </div>
                </div>
                <p className="text-white/90">{currentPlan.credits} credits monthly</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-purple-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Subscription Started</p>
                    <p className="font-semibold text-gray-800">{formatDate(credits.subscriptionStartDate)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-purple-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Next Billing Date</p>
                    <p className="font-semibold text-gray-800">
                      {formatDate(credits.subscriptionRenewDate)}
                      {daysUntilRenewal !== null && (
                        <span className="text-sm text-purple-600 ml-2">
                          ({daysUntilRenewal} days)
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CreditCard className="w-5 h-5 text-purple-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Payment Platform</p>
                    <p className="font-semibold text-gray-800 capitalize">{credits.subscriptionPlatform || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Auto-Renewal</p>
                    <p className="font-semibold text-gray-800">{credits.autoRenew ? 'Enabled' : 'Disabled'}</p>
                  </div>
                </div>
              </div>

              {/* Cancel Subscription */}
              <div className="pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                  Cancel Subscription
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
              <div className="text-center py-8">
                <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 mb-2">No Active Subscription</h3>
                <p className="text-gray-600 mb-6">Subscribe to get monthly credits and exclusive benefits</p>
                <Link
                  href="/subscription"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity"
                >
                  View Subscription Plans
                </Link>
              </div>
            </div>
          )}

          {/* Upgrade Options */}
          {upgrades.length > 0 && (
            <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
              <div className="flex items-center gap-3 mb-6">
                <ArrowUpCircle className="w-8 h-8 text-green-600" />
                <h3 className="text-2xl font-bold text-gray-800">Upgrade Your Plan</h3>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                {upgrades.map((plan) => (
                  <div key={plan.id} className="border-2 border-gray-200 rounded-2xl p-6 hover:border-purple-400 transition-colors">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${plan.gradient} flex items-center justify-center text-white mb-4`}>
                      {plan.icon}
                    </div>
                    <h4 className="text-xl font-bold text-gray-800 mb-2">{plan.name}</h4>
                    <p className="text-3xl font-bold text-purple-600 mb-2">${plan.price}<span className="text-sm text-gray-600">/mo</span></p>
                    <p className="text-gray-600 mb-4">{plan.credits} credits monthly</p>
                    <Link
                      href="/subscription"
                      className={`block w-full py-3 rounded-xl font-semibold text-center bg-gradient-to-r ${plan.gradient} text-white hover:opacity-90 transition-opacity`}
                    >
                      Upgrade to {plan.name}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Downgrade Options */}
          {downgrades.length > 0 && (
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <ArrowDownCircle className="w-8 h-8 text-orange-600" />
                <h3 className="text-2xl font-bold text-gray-800">Downgrade Options</h3>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                {downgrades.map((plan) => (
                  <div key={plan.id} className="border-2 border-gray-200 rounded-2xl p-6 hover:border-orange-400 transition-colors">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${plan.gradient} flex items-center justify-center text-white mb-4`}>
                      {plan.icon}
                    </div>
                    <h4 className="text-xl font-bold text-gray-800 mb-2">{plan.name}</h4>
                    <p className="text-3xl font-bold text-orange-600 mb-2">${plan.price}<span className="text-sm text-gray-600">/mo</span></p>
                    <p className="text-gray-600 mb-4">{plan.credits} credits monthly</p>
                    <Link
                      href="/subscription"
                      className="block w-full py-3 rounded-xl font-semibold text-center border-2 border-orange-600 text-orange-600 hover:bg-orange-50 transition-colors"
                    >
                      Switch to {plan.name}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Cancel Subscription Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Cancel Subscription?</h3>
              <p className="text-gray-600">
                Are you sure you want to cancel your subscription? You'll lose access to monthly credits.
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> Your subscription will remain active until the end of your current billing period ({formatDate(credits?.subscriptionRenewDate)}).
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              >
                Keep Subscription
              </button>
              <button
                onClick={handleCancelSubscription}
                disabled={cancelling}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {cancelling ? 'Cancelling...' : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}
