'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Users, User } from 'lucide-react';
import { SmartBeautyParams } from '@/types';

interface SmartBeautySelectorProps {
  onBeautySelect: (params: SmartBeautyParams) => void;
  disabled?: boolean;
}

export default function SmartBeautySelector({
  onBeautySelect,
  disabled = false,
}: SmartBeautySelectorProps) {
  const [beautyLevel, setBeautyLevel] = useState(1.0);
  const [multiFace, setMultiFace] = useState(false);

  const handleApply = () => {
    onBeautySelect({
      beautyLevel,
      multiFace,
    });
  };

  const presets = [
    {
      id: 'natural',
      label: 'Natural',
      icon: '🌿',
      description: 'Subtle enhancement',
      value: 0.3,
    },
    {
      id: 'balanced',
      label: 'Balanced',
      icon: '✨',
      description: 'Standard beauty',
      value: 0.6,
    },
    {
      id: 'enhanced',
      label: 'Enhanced',
      icon: '💫',
      description: 'Strong enhancement',
      value: 0.8,
    },
    {
      id: 'maximum',
      label: 'Maximum',
      icon: '⭐',
      description: 'Full beauty effect',
      value: 1.0,
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Smart Beauty Enhancement
        </h2>
        <p className="text-gray-600">
          AI-powered comprehensive beauty enhancement
        </p>
      </div>

      {/* Multi-Face Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 mb-6"
      >
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-purple-500" />
          Face Processing Mode
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setMultiFace(false)}
            disabled={disabled}
            className={`p-4 rounded-xl border-2 transition-all ${
              !multiFace
                ? 'border-purple-500 bg-purple-50'
                : 'border-gray-200 hover:border-purple-300'
            }`}
          >
            <User className="w-8 h-8 mx-auto mb-2 text-purple-500" />
            <h4 className="font-bold text-sm text-gray-800 mb-1">Single Face</h4>
            <p className="text-xs text-gray-600">Process largest face only</p>
          </button>

          <button
            onClick={() => setMultiFace(true)}
            disabled={disabled}
            className={`p-4 rounded-xl border-2 transition-all ${
              multiFace
                ? 'border-purple-500 bg-purple-50'
                : 'border-gray-200 hover:border-purple-300'
            }`}
          >
            <Users className="w-8 h-8 mx-auto mb-2 text-purple-500" />
            <h4 className="font-bold text-sm text-gray-800 mb-1">Multiple Faces</h4>
            <p className="text-xs text-gray-600">Enhance all faces (max 18)</p>
          </button>
        </div>
      </motion.div>

      {/* Beauty Level Presets */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 mb-6"
      >
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-pink-500" />
          Beauty Level Presets
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {presets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => setBeautyLevel(preset.value)}
              disabled={disabled}
              className={`p-4 rounded-xl border-2 transition-all ${
                Math.abs(beautyLevel - preset.value) < 0.05
                  ? 'border-pink-500 bg-pink-50'
                  : 'border-gray-200 hover:border-pink-300'
              }`}
            >
              <span className="text-3xl mb-2 block">{preset.icon}</span>
              <h4 className="font-bold text-sm text-gray-800 mb-1">{preset.label}</h4>
              <p className="text-xs text-gray-600">{preset.description}</p>
            </button>
          ))}
        </div>

        {/* Custom Slider */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-semibold text-gray-700">
              Custom Beauty Level
            </label>
            <span className="text-sm font-bold text-pink-600 bg-pink-50 px-3 py-1 rounded-full">
              {(beautyLevel * 100).toFixed(0)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={beautyLevel}
            onChange={(e) => setBeautyLevel(parseFloat(e.target.value))}
            disabled={disabled}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-500 disabled:cursor-not-allowed"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Natural (0%)</span>
            <span>Balanced (60%)</span>
            <span>Maximum (100%)</span>
          </div>
        </div>
      </motion.div>

      {/* Feature Description */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200 mb-6"
      >
        <h4 className="font-bold text-gray-800 mb-3">Smart Beauty Includes:</h4>
        <ul className="text-sm text-gray-700 space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-purple-500">✓</span>
            <span>Intelligent skin smoothing and texture enhancement</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-500">✓</span>
            <span>Automatic face contouring and slimming</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-500">✓</span>
            <span>Eye enhancement and brightening</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-500">✓</span>
            <span>Skin tone improvement and color correction</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-500">✓</span>
            <span>AI-optimized comprehensive beauty enhancement</span>
          </li>
        </ul>
      </motion.div>

      {/* Apply Button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleApply}
        disabled={disabled}
        className="w-full py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <Sparkles className="w-5 h-5" />
        Apply Smart Beauty
      </motion.button>
    </div>
  );
}
