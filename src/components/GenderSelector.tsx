'use client';

import { motion } from 'framer-motion';
import { GenderOption } from '@/types';
import { GENDER_OPTIONS } from '@/lib/constants';

interface GenderSelectorProps {
  onGenderSelect: (gender: GenderOption) => void;
  disabled?: boolean;
}

export default function GenderSelector({
  onGenderSelect,
  disabled = false,
}: GenderSelectorProps) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Choose Gender
        </h2>
        <p className="text-gray-600">
          Transform your appearance to a different gender
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {GENDER_OPTIONS.map((gender, index) => (
          <motion.button
            key={gender.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onGenderSelect(gender.id)}
            disabled={disabled}
            className="relative group p-8 rounded-2xl bg-white border-2 border-gray-200 hover:border-blue-500 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {/* Icon */}
            <div className="text-6xl mb-4">{gender.icon}</div>

            {/* Label */}
            <h3 className="text-xl font-bold mb-2 text-gray-800">
              {gender.label}
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-3">
              {gender.description}
            </p>

            {/* Hover effect overlay */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.button>
        ))}
      </div>
    </div>
  );
}
