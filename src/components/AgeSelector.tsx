'use client';

import { motion } from 'framer-motion';
import { AGE_CATEGORIES } from '@/lib/constants';
import { AgeCategory } from '@/types';

interface AgeSelectorProps {
  selectedAge: AgeCategory | null;
  onSelect: (age: AgeCategory) => void;
  originalImage: string;
}

export default function AgeSelector({ selectedAge, onSelect, originalImage }: AgeSelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto"
    >
      {/* Preview Image */}
      <div className="mb-8 flex justify-center">
        <div className="relative">
          <img
            src={originalImage}
            alt="Your photo"
            className="w-40 h-40 md:w-48 md:h-48 object-cover rounded-3xl shadow-xl ring-4 ring-white"
          />
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          Choose Your Age
        </h2>
        <p className="text-gray-500 mt-2">
          Select how old you want to appear in the transformed image
        </p>
      </div>

      {/* Age Options Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {AGE_CATEGORIES.map((category, index) => (
          <motion.button
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onSelect(category.id)}
            className={`
              relative p-4 md:p-6 rounded-2xl border-2 transition-all duration-300
              flex flex-col items-center gap-2 group
              ${selectedAge === category.id
                ? 'border-purple-500 bg-purple-50 shadow-lg shadow-purple-200'
                : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-md'
              }
            `}
          >
            {/* Selection indicator */}
            {selectedAge === category.id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center"
              >
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
            )}

            {/* Icon */}
            <span className="text-4xl md:text-5xl group-hover:scale-110 transition-transform">
              {category.icon}
            </span>

            {/* Label */}
            <span className={`
              font-semibold text-lg
              ${selectedAge === category.id ? 'text-purple-700' : 'text-gray-800'}
            `}>
              {category.label}
            </span>

            {/* Age Range */}
            <span className="text-xs text-gray-400">
              {category.ageRange}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Continue Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: selectedAge ? 1 : 0.5 }}
        className="mt-8 flex justify-center"
      >
        <button
          disabled={!selectedAge}
          onClick={() => selectedAge && onSelect(selectedAge)}
          className={`
            px-8 py-4 rounded-full font-semibold text-lg transition-all
            ${selectedAge
              ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          Transform My Face
        </button>
      </motion.div>
    </motion.div>
  );
}
