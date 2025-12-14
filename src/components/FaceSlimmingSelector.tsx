'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { FaceSlimmingParams } from '@/types';

interface FaceSlimmingSelectorProps {
  onSlimmingSelect: (params: FaceSlimmingParams) => void;
  disabled?: boolean;
}

export default function FaceSlimmingSelector({
  onSlimmingSelect,
  disabled = false,
}: FaceSlimmingSelectorProps) {
  const [slimDegree, setSlimDegree] = useState(1.0);

  const handleApply = () => {
    onSlimmingSelect({
      slimDegree,
    });
  };

  const presets = [
    {
      id: 'subtle',
      label: 'Subtle',
      icon: '🌸',
      description: 'Natural slimming',
      value: 0.5,
    },
    {
      id: 'standard',
      label: 'Standard',
      icon: '✨',
      description: 'Balanced effect',
      value: 1.0,
    },
    {
      id: 'enhanced',
      label: 'Enhanced',
      icon: '💫',
      description: 'Noticeable slimming',
      value: 1.5,
    },
    {
      id: 'maximum',
      label: 'Maximum',
      icon: '⭐',
      description: 'Maximum effect',
      value: 2.0,
    },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Face Slimming
        </h2>
        <p className="text-gray-600">
          Adjust the face slimming intensity for your perfect look
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
              onClick={() => setSlimDegree(preset.value)}
              className={`p-4 rounded-xl bg-gradient-to-br transition-all shadow-sm hover:shadow-md ${
                slimDegree === preset.value
                  ? 'from-blue-500 to-purple-500 text-white border-2 border-blue-600'
                  : 'from-white to-gray-50 border-2 border-gray-200 hover:border-blue-400'
              }`}
            >
              <div className="text-3xl mb-2">{preset.icon}</div>
              <div className={`text-sm font-semibold ${slimDegree === preset.value ? 'text-white' : 'text-gray-800'}`}>
                {preset.label}
              </div>
              <div className={`text-xs mt-1 ${slimDegree === preset.value ? 'text-blue-100' : 'text-gray-500'}`}>
                {preset.description}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Slider Control */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-5">Custom Adjustment</h3>
        
        <div className="mb-2">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Slimming Strength</label>
            <span className="text-sm font-semibold text-blue-600">{slimDegree.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={slimDegree}
            onChange={(e) => setSlimDegree(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>Natural (0)</span>
            <span>Standard (1.0)</span>
            <span>Maximum (2.0)</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">Higher values create a more pronounced slimming effect</p>
        </div>
      </div>

      {/* Apply Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleApply}
        disabled={disabled}
        className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5" />
          Apply Face Slimming
        </span>
      </motion.button>
    </div>
  );
}
