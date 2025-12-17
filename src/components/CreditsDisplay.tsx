'use client';

import { useEffect, useState } from 'react';
import { getUserCredits, UserCredits } from '@/lib/credits';
import { useAuth } from '@/contexts/AuthContext';
import { Coins, Crown, Zap } from 'lucide-react';
import Link from 'next/link';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function CreditsDisplay() {
  const { user } = useAuth();
  const [credits, setCredits] = useState<UserCredits | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setCredits(null);
      setLoading(false);
      return;
    }

    // Set up real-time listener for credit updates
    const userRef = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setCredits({
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
        });
      }
      setLoading(false);
    }, (error) => {
      console.error('Error listening to credits:', error);
      setLoading(false);
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [user]);

  if (!user || loading) {
    return null;
  }

  const getTierIcon = () => {
    switch (credits?.subscriptionTier) {
      case 'premium':
        return <Crown className="w-5 h-5 text-white" />;
      case 'pro':
        return <Zap className="w-5 h-5 text-white" />;
      case 'starter':
        return <Coins className="w-5 h-5 text-white" />;
      default:
        return <Coins className="w-5 h-5 text-white" />;
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
