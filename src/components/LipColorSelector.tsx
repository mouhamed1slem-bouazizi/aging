'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { LipColorRGBA } from '@/types';
import { LIP_COLORS } from '@/lib/constants';
import { Sparkles } from 'lucide-react';

interface LipColorSelectorProps {
  onColorSelect: (color: LipColorRGBA) => void;
  disabled?: boolean;
}

export default function LipColorSelector({
  onColorSelect,
  disabled = false,
}: LipColorSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<'natural' | 'nude' | 'bold' | 'vibrant'>('natural');

  const categories = [
    { id: 'natural' as const, label: 'Natural', icon: '💋' },
    { id: 'nude' as const, label: 'Nude', icon: '🤎' },
    { id: 'bold' as const, label: 'Bold', icon: '❤️' },
    { id: 'vibrant' as const, label: 'Vibrant', icon: '💕' },
  ];

  const filteredColors = LIP_COLORS.filter(c => c.category === selectedCategory);

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
          Choose Lip Color
        </h2>
        <p className="text-gray-600">
          Select a lipstick color to transform your look
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex justify-center gap-3 mb-8 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all ${
              selectedCategory === cat.id
                ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span className="text-xl">{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Color Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredColors.map((color, index) => (
          <motion.button
            key={color.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onColorSelect(color.rgba)}
            disabled={disabled}
            className="relative group p-6 rounded-2xl bg-white border-2 border-gray-200 hover:border-pink-500 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-rose-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Color Preview */}
            <div className="relative mb-3 flex justify-center">
              <div
                className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
                style={{
                  backgroundColor: `rgba(${color.rgba.r}, ${color.rgba.g}, ${color.rgba.b}, ${color.rgba.a / 100})`,
                }}
              />
            </div>

            {/* Label */}
            <h3 className="relative text-sm font-bold text-gray-800 mb-1">
              {color.label}
            </h3>

            {/* Description */}
            <p className="relative text-xs text-gray-600">
              {color.description}
            </p>

            {/* Color Code */}
            <p className="relative text-xs text-gray-400 mt-2 font-mono">
              RGB({color.rgba.r}, {color.rgba.g}, {color.rgba.b})
            </p>

            {/* Hover indicator */}
            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <Sparkles className="w-4 h-4 text-pink-500" />
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
