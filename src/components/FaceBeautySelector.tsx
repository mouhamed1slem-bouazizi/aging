'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, Sun } from 'lucide-react';
import { FaceBeautyParams } from '@/types';

interface FaceBeautySelectorProps {
  onBeautySelect: (params: FaceBeautyParams) => void;
  disabled?: boolean;
}

export default function FaceBeautySelector({
  onBeautySelect,
  disabled = false,
}: FaceBeautySelectorProps) {
  const [sharp, setSharp] = useState(0.5);
  const [smooth, setSmooth] = useState(0.5);
  const [white, setWhite] = useState(0.3);

  const handleApply = () => {
    onBeautySelect({
      sharp,
      smooth,
      white,
    });
  };

  const presets = [
    {
      id: 'natural',
      label: 'Natural',
      icon: '🌿',
      description: 'Subtle enhancement',
      values: { sharp: 0.3, smooth: 0.3, white: 0.2 },
    },
    {
      id: 'soft',
      label: 'Soft Glow',
      icon: '✨',
      description: 'Smooth and gentle',
      values: { sharp: 0.2, smooth: 0.6, white: 0.4 },
    },
    {
      id: 'bright',
      label: 'Bright',
      icon: '☀️',
      description: 'Radiant and clear',
      values: { sharp: 0.6, smooth: 0.4, white: 0.6 },
    },
    {
      id: 'flawless',
      label: 'Flawless',
      icon: '💎',
      description: 'Maximum beauty',
      values: { sharp: 0.7, smooth: 0.8, white: 0.5 },
    },
  ];

  const handlePresetSelect = (values: { sharp: number; smooth: number; white: number }) => {
    setSharp(values.sharp);
    setSmooth(values.smooth);
    setWhite(values.white);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Face Beauty Enhancement
        </h2>
        <p className="text-gray-600">
          Adjust sharpness, smoothness, and whitening levels
        </p>
      </div>

      {/* Presets */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Quick Presets</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {presets.map((preset) => (
            <motion.button
              key={preset.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handlePresetSelect(preset.values)}
              className="p-4 rounded-xl bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 hover:border-purple-400 transition-all shadow-sm hover:shadow-md"
            >
              <div className="text-3xl mb-2">{preset.icon}</div>
              <div className="text-sm font-semibold text-gray-800">{preset.label}</div>
              <div className="text-xs text-gray-500 mt-1">{preset.description}</div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Manual Controls */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-5">Custom Adjustment</h3>
        
        {/* Sharpness Control */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-500" />
              <label className="text-sm font-medium text-gray-700">Sharpness</label>
            </div>
            <span className="text-sm font-semibold text-purple-600">{Math.round(sharp * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={sharp}
            onChange={(e) => setSharp(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
          />
          <p className="text-xs text-gray-500 mt-1">Higher values increase detail and clarity</p>
        </div>

        {/* Smoothness Control */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-pink-500" />
              <label className="text-sm font-medium text-gray-700">Smoothness</label>
            </div>
            <span className="text-sm font-semibold text-purple-600">{Math.round(smooth * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={smooth}
            onChange={(e) => setSmooth(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-600"
          />
          <p className="text-xs text-gray-500 mt-1">Higher values create smoother skin texture</p>
        </div>

        {/* Whitening Control */}
        <div className="mb-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-500" />
              <label className="text-sm font-medium text-gray-700">Whitening</label>
            </div>
            <span className="text-sm font-semibold text-purple-600">{Math.round(white * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={white}
            onChange={(e) => setWhite(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
          />
          <p className="text-xs text-gray-500 mt-1">Higher values brighten skin tone</p>
        </div>
      </div>

      {/* Apply Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleApply}
        disabled={disabled}
        className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5" />
          Apply Beauty Enhancement
        </span>
      </motion.button>
    </div>
  );
}
