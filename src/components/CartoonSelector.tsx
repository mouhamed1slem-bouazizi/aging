'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { CartoonType, CartoonParams } from '@/types';

interface CartoonSelectorProps {
  onCartoonSelect: (params: CartoonParams) => void;
  disabled?: boolean;
}

interface CartoonOption {
  type: CartoonType;
  label: string;
  description: string;
  category: string;
}

const cartoonStyles: CartoonOption[] = [
  // Full-Body Cartoonization
  { type: 'jpcartoon', label: 'Japanese Manga I', description: 'Classic Japanese manga style', category: 'Full-Body' },
  { type: 'anime', label: 'Japanese Manga II', description: 'Modern anime style', category: 'Full-Body' },
  { type: 'claborate', label: 'Chinese Fine Brushwork', description: 'Traditional Chinese painting', category: 'Full-Body' },
  { type: 'hongkong', label: 'Hong Kong Comic', description: 'Hong Kong comic style', category: 'Full-Body' },
  { type: 'comic', label: 'Comic', description: 'Classic comic book style', category: 'Full-Body' },
  { type: 'animation3d', label: '3D Animation', description: '3D animated character', category: 'Full-Body' },
  { type: 'handdrawn', label: 'Hand-painted', description: 'Hand-drawn artistic style', category: 'Full-Body' },
  { type: 'sketch', label: 'Pencil Drawing I', description: 'Realistic pencil sketch', category: 'Full-Body' },
  { type: 'full', label: 'Pencil Drawing II', description: 'Detailed pencil art', category: 'Full-Body' },
  { type: 'artstyle', label: 'Artistic Effects', description: 'Artistic interpretation', category: 'Full-Body' },
  { type: 'classic_cartoon', label: 'Retro Cartoon', description: 'Classic cartoon style', category: 'Full-Body' },
  { type: 'tccartoon', label: 'Moe Manga', description: 'Cute moe style', category: 'Full-Body' },
  { type: 'hkcartoon', label: 'China Comics', description: 'Chinese comic style', category: 'Full-Body' },
  
  // Facial Cartoonization
  { type: '3d_cartoon', label: '3D Cartoon', description: '3D cartoon character', category: 'Facial' },
  { type: 'pixar', label: 'Pixar', description: 'Pixar animation style', category: 'Facial' },
  { type: 'pixar_plus', label: 'Pixar Pro', description: 'Enhanced Pixar style', category: 'Facial' },
  { type: 'angel', label: 'Angel', description: 'Angelic cartoon style', category: 'Facial' },
  { type: 'angel_plus', label: 'Angel Pro', description: 'Enhanced angel style', category: 'Facial' },
  { type: 'demon', label: 'Demon', description: 'Demonic cartoon style', category: 'Facial' },
  { type: 'ukiyoe_cartoon', label: 'Ukiyo-e', description: 'Japanese woodblock print', category: 'Facial' },
  { type: 'amcartoon', label: 'American Manga', description: 'American comic style', category: 'Facial' },
  { type: '3d', label: '3D Effects', description: '3D visual effects', category: 'Facial' },
  { type: '3d_game', label: '3D Game', description: '3D game character', category: 'Facial' },
  
  // Avatar Cartoonization
  { type: 'jpcartoon_head', label: 'Japanese Manga Head', description: 'Manga-style avatar', category: 'Avatar' },
  { type: 'head', label: 'Pencil Drawing Head', description: 'Sketch-style avatar', category: 'Avatar' },
];

const categories = ['All', 'Full-Body', 'Facial', 'Avatar'];

export default function CartoonSelector({
  onCartoonSelect,
  disabled = false,
}: CartoonSelectorProps) {
  const [selectedCartoon, setSelectedCartoon] = useState<CartoonType | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredStyles = selectedCategory === 'All'
    ? cartoonStyles
    : cartoonStyles.filter(style => style.category === selectedCategory);

  const handleSelect = (cartoonType: CartoonType) => {
    if (disabled) return;
    setSelectedCartoon(cartoonType);
  };

  const handleApply = () => {
    if (!selectedCartoon || disabled) return;
    onCartoonSelect({ cartoonType: selectedCartoon });
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="w-8 h-8 text-purple-500" />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            Cartoon Yourself
          </h2>
        </div>
        <p className="text-gray-600">
          Transform your photo into amazing cartoon styles
        </p>
      </motion.div>

      {/* Category Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap justify-center gap-2"
      >
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            disabled={disabled}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedCategory === category
                ? 'bg-purple-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            {category}
          </button>
        ))}
      </motion.div>

      {/* Cartoon Styles Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-[500px] overflow-y-auto p-4 bg-gray-50 rounded-xl"
      >
        {filteredStyles.map((style, index) => (
          <motion.button
            key={style.type}
            onClick={() => handleSelect(style.type)}
            disabled={disabled}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.03 }}
            whileHover={{ scale: disabled ? 1 : 1.05 }}
            whileTap={{ scale: disabled ? 1 : 0.95 }}
            className={`relative group p-4 rounded-xl text-center transition-all ${
              selectedCartoon === style.type
                ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-xl ring-4 ring-purple-300'
                : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            {/* Icon */}
            <div className="flex justify-center mb-2">
              <Sparkles className={`w-8 h-8 ${
                selectedCartoon === style.type ? 'text-white' : 'text-purple-500'
              }`} />
            </div>

            {/* Label */}
            <h3 className="text-sm font-bold mb-1 line-clamp-2">
              {style.label}
            </h3>

            {/* Description */}
            <p className={`text-xs line-clamp-2 ${
              selectedCartoon === style.type ? 'text-white/90' : 'text-gray-500'
            }`}>
              {style.description}
            </p>

            {/* Category Badge */}
            {selectedCategory === 'All' && (
              <div className={`mt-2 text-xs px-2 py-1 rounded-full ${
                selectedCartoon === style.type
                  ? 'bg-white/20 text-white'
                  : 'bg-purple-100 text-purple-700'
              }`}>
                {style.category}
              </div>
            )}

            {/* Selection indicator */}
            {selectedCartoon === style.type && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center"
              >
                <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </motion.div>
            )}
          </motion.button>
        ))}
      </motion.div>

      {/* Apply Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex justify-center"
      >
        <button
          onClick={handleApply}
          disabled={disabled || !selectedCartoon}
          className={`px-12 py-4 rounded-xl font-bold text-lg transition-all ${
            disabled || !selectedCartoon
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-xl hover:scale-105'
          }`}
        >
          {disabled ? 'Processing...' : 'Apply Cartoon Style'}
        </button>
      </motion.div>

      {/* Selection Summary */}
      {selectedCartoon && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center p-4 bg-purple-50 rounded-xl"
        >
          <div className="text-sm text-gray-600">
            Selected: <span className="font-semibold text-purple-700">
              {cartoonStyles.find(s => s.type === selectedCartoon)?.label}
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
