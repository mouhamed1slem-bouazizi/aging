'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Palette, Check } from 'lucide-react';
import { PaintingStyle } from '@/types';

interface PaintingStyleOption {
  id: PaintingStyle;
  label: string;
  description: string;
  emoji: string;
}

const PAINTING_STYLES: PaintingStyleOption[] = [
  {
    id: 'cartoon',
    label: 'Cartoon',
    description: 'Vibrant cartoon style',
    emoji: '🎨',
  },
  {
    id: 'pencil',
    label: 'Pencil Sketch',
    description: 'Classic pencil drawing',
    emoji: '✏️',
  },
  {
    id: 'color_pencil',
    label: 'Color Pencil',
    description: 'Colored pencil art',
    emoji: '🖍️',
  },
  {
    id: 'warm',
    label: 'Warm Sugar Cube',
    description: 'Colorful oil painting',
    emoji: '🧊',
  },
  {
    id: 'wave',
    label: 'Kanagawa Wave',
    description: 'Japanese wave style',
    emoji: '🌊',
  },
  {
    id: 'lavender',
    label: 'Lavender',
    description: 'Soft lavender tones',
    emoji: '🪻',
  },
  {
    id: 'mononoke',
    label: 'Mononoke',
    description: 'Mystical oil painting',
    emoji: '🎭',
  },
  {
    id: 'scream',
    label: 'The Scream',
    description: 'Expressionist style',
    emoji: '😱',
  },
  {
    id: 'gothic',
    label: 'Gothic',
    description: 'Dark gothic art',
    emoji: '🏰',
  },
];

interface PaintingStyleSelectorProps {
  onSelect: (style: PaintingStyle) => void;
}

export default function PaintingStyleSelector({ onSelect }: PaintingStyleSelectorProps) {
  const [selectedStyle, setSelectedStyle] = useState<PaintingStyle | null>(null);
  const [hoveredStyle, setHoveredStyle] = useState<PaintingStyle | null>(null);

  const handleStyleClick = useCallback((style: PaintingStyle) => {
    setSelectedStyle(style);
    // Auto-submit after selection
    setTimeout(() => {
      onSelect(style);
    }, 300);
  }, [onSelect]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-16 h-16 mx-auto bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center"
        >
          <Palette className="w-8 h-8 text-white" />
        </motion.div>
        <h2 className="text-2xl font-bold text-gray-900">Choose Painting Style</h2>
        <p className="text-gray-600">
          Transform your photo into beautiful artwork
        </p>
      </div>

      {/* Style Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {PAINTING_STYLES.map((style, index) => {
          const isSelected = selectedStyle === style.id;
          const isHovered = hoveredStyle === style.id;

          return (
            <motion.button
              key={style.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handleStyleClick(style.id)}
              onMouseEnter={() => setHoveredStyle(style.id)}
              onMouseLeave={() => setHoveredStyle(null)}
              className={`relative p-6 rounded-2xl border-2 transition-all ${
                isSelected
                  ? 'border-amber-500 bg-gradient-to-br from-amber-50 to-orange-50 shadow-lg shadow-amber-500/20'
                  : isHovered
                  ? 'border-amber-300 bg-amber-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-amber-200'
              }`}
              disabled={selectedStyle !== null && selectedStyle !== style.id}
            >
              {/* Selection Indicator */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-3 right-3 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center"
                >
                  <Check className="w-4 h-4 text-white" />
                </motion.div>
              )}

              {/* Style Content */}
              <div className="space-y-2">
                <div className="text-4xl mb-2">{style.emoji}</div>
                <h3 className="font-semibold text-gray-900 text-sm">
                  {style.label}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-2">
                  {style.description}
                </p>
              </div>

              {/* Hover Effect */}
              {isHovered && !isSelected && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 rounded-2xl"
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-100"
      >
        <p className="text-sm text-gray-600 text-center">
          💡 Select a style to instantly transform your photo into artistic painting
        </p>
      </motion.div>
    </div>
  );
}
