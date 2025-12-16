'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Check } from 'lucide-react';
import { LivePhotoType, LivePhotoParams } from '@/types';

interface LivePhotoTypeOption {
  type: LivePhotoType;
  label: string;
  description: string;
  emoji: string;
}

const LIVE_PHOTO_TYPES: LivePhotoTypeOption[] = [
  {
    type: 0,
    label: 'Avatar Version',
    description: 'Animated avatar with subtle movements',
    emoji: '👤',
  },
  {
    type: 1,
    label: 'Full Body Version',
    description: 'Full body animated portrait',
    emoji: '🧍',
  },
];

interface LivePhotoSelectorProps {
  onSelect: (params: LivePhotoParams) => void;
}

export default function LivePhotoSelector({ onSelect }: LivePhotoSelectorProps) {
  const [selectedType, setSelectedType] = useState<LivePhotoType>(0);

  const handleConfirm = useCallback(() => {
    onSelect({ type: selectedType });
  }, [selectedType, onSelect]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-16 h-16 mx-auto bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center"
        >
          <Sparkles className="w-8 h-8 text-white" />
        </motion.div>
        <h2 className="text-2xl font-bold text-gray-900">Live Photos</h2>
        <p className="text-gray-600">
          Bring your photos to life with animation
        </p>
      </div>

      {/* Type Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-3"
      >
        <h3 className="text-sm font-semibold text-gray-700">Animation Type</h3>
        <div className="grid grid-cols-1 gap-3">
          {LIVE_PHOTO_TYPES.map((typeOption) => (
            <button
              key={typeOption.type}
              onClick={() => setSelectedType(typeOption.type)}
              className={`p-4 rounded-xl border-2 transition-all text-left flex items-center gap-4 ${
                selectedType === typeOption.type
                  ? 'border-pink-500 bg-pink-50'
                  : 'border-gray-200 hover:border-pink-300 bg-white'
              }`}
            >
              <div className="text-3xl">{typeOption.emoji}</div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900">{typeOption.label}</div>
                <div className="text-xs text-gray-500">{typeOption.description}</div>
              </div>
              {selectedType === typeOption.type && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center"
                >
                  <Check className="w-4 h-4 text-white" />
                </motion.div>
              )}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-4 border border-pink-200"
      >
        <h4 className="text-sm font-semibold text-gray-700 mb-2">✨ What are Live Photos?</h4>
        <p className="text-xs text-gray-600 mb-3">
          Transform your static portraits into dynamic, lifelike animations with subtle movements and expressions.
        </p>
        <div className="space-y-1 text-xs text-gray-600">
          <div className="flex items-start gap-2">
            <span className="text-pink-500">•</span>
            <span><strong>Avatar:</strong> Best for headshots and profile pictures</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-pink-500">•</span>
            <span><strong>Full Body:</strong> Perfect for full-length portraits</span>
          </div>
        </div>
      </motion.div>

      {/* Summary & Confirm */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-3"
      >
        <div className="bg-gradient-to-r from-pink-100 to-rose-100 rounded-xl p-4 border border-pink-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">📋 Summary</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="text-gray-600">Animation Type:</div>
            <div className="font-semibold text-gray-900">
              {LIVE_PHOTO_TYPES.find(t => t.type === selectedType)?.label}
            </div>
            <div className="text-gray-600">Output:</div>
            <div className="font-semibold text-gray-900">Animated Video</div>
          </div>
        </div>

        <button
          onClick={handleConfirm}
          className="w-full px-6 py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all font-medium shadow-lg shadow-pink-500/30 flex items-center justify-center gap-2"
        >
          <span>Create Live Photo</span>
          <Sparkles className="w-5 h-5" />
        </button>

        <p className="text-xs text-center text-gray-500">
          ⏱️ Processing typically takes 30-60 seconds
        </p>
      </motion.div>
    </div>
  );
}
