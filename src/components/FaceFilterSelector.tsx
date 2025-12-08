'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { FaceFilterType } from '@/types';
import { FACE_FILTERS } from '@/lib/constants';
import { Sparkles } from 'lucide-react';

interface FaceFilterSelectorProps {
  onFilterSelect: (filter: FaceFilterType, strength: number) => void;
  disabled?: boolean;
}

export default function FaceFilterSelector({
  onFilterSelect,
  disabled = false,
}: FaceFilterSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<'natural' | 'vintage' | 'vibrant' | 'artistic'>('natural');
  const [filterStrength, setFilterStrength] = useState(0.7);

  const categories = [
    { id: 'natural' as const, label: 'Natural', icon: '🌿' },
    { id: 'vintage' as const, label: 'Vintage', icon: '📷' },
    { id: 'vibrant' as const, label: 'Vibrant', icon: '🌈' },
    { id: 'artistic' as const, label: 'Artistic', icon: '🎨' },
  ];

  const filteredFilters = FACE_FILTERS.filter(f => f.category === selectedCategory);

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Choose Face Filter
        </h2>
        <p className="text-gray-600">
          Select a filter style and adjust the intensity
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex justify-center gap-3 mb-8">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all ${
              selectedCategory === cat.id
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span className="text-xl">{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Filter Strength Slider */}
      <div className="mb-8 p-6 bg-white rounded-2xl shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Filter Intensity
          </label>
          <span className="text-sm font-bold text-purple-600">
            {Math.round(filterStrength * 100)}%
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={filterStrength}
          onChange={(e) => setFilterStrength(parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>Subtle</span>
          <span>Strong</span>
        </div>
      </div>

      {/* Filter Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredFilters.map((filter, index) => (
          <motion.button
            key={filter.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onFilterSelect(filter.id, filterStrength)}
            disabled={disabled}
            className="relative group p-6 rounded-2xl bg-white border-2 border-gray-200 hover:border-purple-500 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Filter Preview Image */}
            <div className="relative mb-3 overflow-hidden rounded-xl">
              <Image
                src={filter.previewUrl}
                alt={filter.label}
                width={200}
                height={200}
                className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-110"
                unoptimized
              />
              {/* Overlay gradient for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>

            {/* Label */}
            <h3 className="relative text-sm font-bold text-gray-800 mb-1">
              {filter.label}
            </h3>

            {/* Description */}
            <p className="relative text-xs text-gray-600">
              {filter.description}
            </p>

            {/* Hover indicator */}
            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <Sparkles className="w-4 h-4 text-purple-500" />
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
