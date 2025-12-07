'use client';

import { motion } from 'framer-motion';
import { AGE_CATEGORIES } from '@/lib/constants';
import { AgeCategory } from '@/types';

interface LoadingAnimationProps {
  ageCategory?: AgeCategory;
}

export default function LoadingAnimation({ ageCategory }: LoadingAnimationProps) {
  const category = ageCategory ? AGE_CATEGORIES.find((c) => c.id === ageCategory) : null;

  const loadingMessages = [
    'Analyzing facial features...',
    'Applying age transformation...',
    'Enhancing details...',
    'Almost there...',
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-12 px-4"
    >
      {/* Main animation container */}
      <div className="relative w-48 h-48 md:w-64 md:h-64 mb-8">
        {/* Outer rotating ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-500 border-r-pink-500"
        />
        
        {/* Middle pulsing ring */}
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-4 rounded-full bg-gradient-to-br from-purple-100 to-pink-100"
        />
        
        {/* Inner content */}
        <div className="absolute inset-8 rounded-full bg-white shadow-xl flex items-center justify-center">
          <motion.span
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="text-5xl md:text-6xl"
          >
            {category?.icon || '✨'}
          </motion.span>
        </div>

        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -20, 0],
              x: [0, Math.sin(i) * 10, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.3,
              ease: 'easeInOut',
            }}
            className="absolute w-3 h-3 rounded-full bg-gradient-to-r from-purple-400 to-pink-400"
            style={{
              left: `${50 + Math.cos((i * 60 * Math.PI) / 180) * 40}%`,
              top: `${50 + Math.sin((i * 60 * Math.PI) / 180) * 40}%`,
            }}
          />
        ))}
      </div>

      {/* Text content */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          {category ? `Transforming to ${category.label}` : 'Transforming...'}
        </h2>
        
        {/* Animated loading text */}
        <motion.div className="h-6 overflow-hidden">
          <motion.div
            animate={{ y: [0, -24, -48, -72, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="space-y-0"
          >
            {loadingMessages.map((message, index) => (
              <p key={index} className="h-6 text-gray-500">
                {message}
              </p>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Progress bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="w-full max-w-xs mt-8"
      >
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 10, ease: 'easeInOut' }}
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
          />
        </div>
        <p className="text-center text-sm text-gray-400 mt-2">
          This may take a moment...
        </p>
      </motion.div>

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-8 p-4 bg-purple-50 rounded-2xl max-w-sm"
      >
        <p className="text-sm text-purple-700 text-center">
          💡 <span className="font-medium">Did you know?</span> AI analyzes over 100 facial landmarks to create realistic age transformations.
        </p>
      </motion.div>
    </motion.div>
  );
}
