'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Wand2, Sun } from 'lucide-react';
import { SkinBeautyParams } from '@/types';

interface SkinBeautySelectorProps {
  onSkinSelect: (params: SkinBeautyParams) => void;
  disabled?: boolean;
}

export default function SkinBeautySelector({
  onSkinSelect,
  disabled = false,
}: SkinBeautySelectorProps) {
  const [retouchDegree, setRetouchDegree] = useState(1.0);
  const [whiteningDegree, setWhiteningDegree] = useState(1.0);

  const handleApply = () => {
    onSkinSelect({
      retouchDegree,
      whiteningDegree,
    });
  };

  const presets = [
    {
      id: 'natural',
      label: 'Natural',
      icon: '🌿',
      description: 'Subtle skin enhancement',
      values: { retouchDegree: 0.5, whiteningDegree: 0.4 },
    },
    {
      id: 'balanced',
      label: 'Balanced',
      icon: '✨',
      description: 'Standard effect',
      values: { retouchDegree: 1.0, whiteningDegree: 1.0 },
    },
    {
      id: 'radiant',
      label: 'Radiant',
      icon: '💫',
      description: 'Bright and smooth',
      values: { retouchDegree: 1.2, whiteningDegree: 1.3 },
    },
    {
      id: 'flawless',
      label: 'Flawless',
      icon: '⭐',
      description: 'Maximum enhancement',
      values: { retouchDegree: 1.5, whiteningDegree: 1.5 },
    },
  ];

  const handlePresetClick = (preset: typeof presets[0]) => {
    setRetouchDegree(preset.values.retouchDegree);
    setWhiteningDegree(preset.values.whiteningDegree);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
          Skin Beauty Enhancement
        </h2>
        <p className="text-gray-600">
          Adjust skin retouch and whitening levels for perfect results
        </p>
      </div>

      {/* Quick Presets */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {presets.map((preset, index) => (
          <motion.button
            key={preset.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handlePresetClick(preset)}
            disabled={disabled}
            className={`p-6 rounded-2xl bg-white border-2 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ${
              retouchDegree === preset.values.retouchDegree && whiteningDegree === preset.values.whiteningDegree
                ? 'border-pink-500 bg-gradient-to-br from-pink-50 to-purple-50'
                : 'border-gray-200 hover:border-pink-300'
            }`}
          >
            <span className="text-4xl mb-2 block">{preset.icon}</span>
            <h3 className="font-bold text-gray-800 mb-1">{preset.label}</h3>
            <p className="text-xs text-gray-600">{preset.description}</p>
          </motion.button>
        ))}
      </div>

      {/* Custom Controls */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-100"
      >
        <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Wand2 className="w-5 h-5 text-pink-500" />
          Custom Adjustment
        </h3>

        {/* Retouch Degree Slider */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-pink-500" />
              Dermabrasion Intensity
            </label>
            <span className="text-sm font-bold text-pink-600 bg-pink-50 px-3 py-1 rounded-full">
              {retouchDegree.toFixed(1)}x
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1.5"
            step="0.1"
            value={retouchDegree}
            onChange={(e) => setRetouchDegree(parseFloat(e.target.value))}
            disabled={disabled}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-500 disabled:cursor-not-allowed"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Natural (0)</span>
            <span>Balanced (1.0)</span>
            <span>Maximum (1.5)</span>
          </div>
        </div>

        {/* Whitening Degree Slider */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Sun className="w-4 h-4 text-purple-500" />
              Whitening Strength
            </label>
            <span className="text-sm font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
              {whiteningDegree.toFixed(1)}x
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1.5"
            step="0.1"
            value={whiteningDegree}
            onChange={(e) => setWhiteningDegree(parseFloat(e.target.value))}
            disabled={disabled}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-500 disabled:cursor-not-allowed"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Natural (0)</span>
            <span>Balanced (1.0)</span>
            <span>Maximum (1.5)</span>
          </div>
        </div>

        {/* Apply Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleApply}
          disabled={disabled}
          className="w-full py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Sparkles className="w-5 h-5" />
          Apply Skin Beauty
        </motion.button>
      </motion.div>
    </div>
  );
}
