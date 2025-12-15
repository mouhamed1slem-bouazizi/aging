'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Check } from 'lucide-react';
import { AnimeStyleIndex } from '@/types';

interface AnimeStyleOption {
  index: AnimeStyleIndex;
  label: string;
  description: string;
  emoji: string;
}

const ANIME_STYLES: AnimeStyleOption[] = [
  {
    index: 0,
    label: 'Vintage Comic',
    description: 'Classic comic book style',
    emoji: '📚',
  },
  {
    index: 1,
    label: '3D Fairy Tale',
    description: 'Magical 3D animation',
    emoji: '🧚',
  },
  {
    index: 2,
    label: 'Two-Dimensional',
    description: 'Pure 2D anime aesthetic',
    emoji: '🎭',
  },
  {
    index: 3,
    label: 'Refreshing & Elegant',
    description: 'Light and graceful style',
    emoji: '🌸',
  },
  {
    index: 4,
    label: 'Future Technology',
    description: 'Sci-fi cyberpunk look',
    emoji: '🤖',
  },
  {
    index: 5,
    label: 'Chinese Painting',
    description: 'Traditional ink art',
    emoji: '🎨',
  },
  {
    index: 6,
    label: 'Battle General',
    description: 'Epic warrior aesthetic',
    emoji: '⚔️',
  },
  {
    index: 7,
    label: 'Colorful Cartoon',
    description: 'Vibrant animated style',
    emoji: '🌈',
  },
  {
    index: 8,
    label: 'Graceful Chinese',
    description: 'Elegant oriental charm',
    emoji: '🏮',
  },
];

interface AnimeStyleSelectorProps {
  onSelect: (styleIndex: AnimeStyleIndex) => void;
}

export default function AnimeStyleSelector({ onSelect }: AnimeStyleSelectorProps) {
  const [selectedStyle, setSelectedStyle] = useState<AnimeStyleIndex | null>(null);
  const [hoveredStyle, setHoveredStyle] = useState<AnimeStyleIndex | null>(null);

  const handleStyleClick = useCallback((styleIndex: AnimeStyleIndex) => {
    setSelectedStyle(styleIndex);
    // Auto-submit after selection
    setTimeout(() => {
      onSelect(styleIndex);
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
          className="w-16 h-16 mx-auto bg-gradient-to-br from-fuchsia-500 to-purple-500 rounded-2xl flex items-center justify-center"
        >
          <Sparkles className="w-8 h-8 text-white" />
        </motion.div>
        <h2 className="text-2xl font-bold text-gray-900">Choose Anime Style</h2>
        <p className="text-gray-600">
          Transform your photo into stunning anime artwork
        </p>
      </div>

      {/* Style Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {ANIME_STYLES.map((style, idx) => {
          const isSelected = selectedStyle === style.index;
          const isHovered = hoveredStyle === style.index;

          return (
            <motion.button
              key={style.index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => handleStyleClick(style.index)}
              onMouseEnter={() => setHoveredStyle(style.index)}
              onMouseLeave={() => setHoveredStyle(null)}
              className={`relative p-6 rounded-2xl border-2 transition-all ${
                isSelected
                  ? 'border-fuchsia-500 bg-gradient-to-br from-fuchsia-50 to-purple-50 shadow-lg shadow-fuchsia-500/20'
                  : isHovered
                  ? 'border-fuchsia-300 bg-fuchsia-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-fuchsia-200'
              }`}
              disabled={selectedStyle !== null && selectedStyle !== style.index}
            >
              {/* Selection Indicator */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-3 right-3 w-6 h-6 bg-fuchsia-500 rounded-full flex items-center justify-center"
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
                  className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/5 to-purple-500/5 rounded-2xl"
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
        className="bg-gradient-to-br from-fuchsia-50 to-purple-50 rounded-2xl p-4 border border-fuchsia-100"
      >
        <p className="text-sm text-gray-600 text-center">
          ✨ Select a style to transform your photo into anime art (Processing may take a moment)
        </p>
      </motion.div>
    </div>
  );
}
