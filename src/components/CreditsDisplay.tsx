'use client';

import { useEffect, useState } from 'react';
import { getUserCredits, UserCredits } from '@/lib/credits';
import { useAuth } from '@/contexts/AuthContext';
import { Coins, Crown, Zap } from 'lucide-react';
import Link from 'next/link';

export default function CreditsDisplay() {
  const { user } = useAuth();
  const [credits, setCredits] = useState<UserCredits | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (!user || loading) {
    return null;
  }

  const getTierIcon = () => {
    switch (credits?.subscriptionTier) {
      case 'premium':
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case 'pro':
        return <Zap className="w-5 h-5 text-purple-500" />;
      case 'starter':
        return <Coins className="w-5 h-5 text-blue-500" />;
      default:
        return <Coins className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTierColor = () => {
    switch (credits?.subscriptionTier) {
      case 'premium':
        return 'from-yellow-500 to-orange-500';
      case 'pro':
        return 'from-purple-500 to-pink-500';
      case 'starter':
        return 'from-blue-500 to-cyan-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <Link
      href="/subscription"
      className={`flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r ${getTierColor()} text-white hover:opacity-90 transition-opacity shadow-lg`}
    >
      {getTierIcon()}
      <div className="flex flex-col">
        <span className="text-xs font-medium opacity-90">Credits</span>
        <span className="text-lg font-bold leading-none">{credits?.credits || 0}</span>
      </div>
    </Link>
  );
}
