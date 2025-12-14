'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Smile, Laugh, Frown, Meh, Eye } from 'lucide-react';
import { FacialExpression, ExpressionParams } from '@/types';

interface ExpressionSelectorProps {
  onExpressionSelect: (params: ExpressionParams) => void;
  disabled?: boolean;
}

interface ExpressionOption {
  value: FacialExpression;
  label: string;
  description: string;
  icon: 'smile' | 'laugh' | 'frown' | 'meh' | 'eye';
  gradient: string;
}

const expressions: ExpressionOption[] = [
  {
    value: 10,
    label: 'Dimple Smile',
    description: 'Sweet smile with dimples',
    icon: 'smile',
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    value: 11,
    label: 'Pear Dimple Smile',
    description: 'Charming pear-shaped dimples',
    icon: 'smile',
    gradient: 'from-rose-500 to-pink-500',
  },
  {
    value: 12,
    label: 'Big Grin',
    description: 'Wide, happy grin',
    icon: 'laugh',
    gradient: 'from-yellow-500 to-orange-500',
  },
  {
    value: 13,
    label: 'Standard Grin',
    description: 'Classic friendly smile',
    icon: 'smile',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    value: 14,
    label: 'Cool Pose',
    description: 'Confident, cool expression',
    icon: 'meh',
    gradient: 'from-purple-500 to-indigo-500',
  },
  {
    value: 15,
    label: 'Sad',
    description: 'Melancholic expression',
    icon: 'frown',
    gradient: 'from-gray-500 to-slate-500',
  },
  {
    value: 16,
    label: 'Forced Smile',
    description: 'Polite, reserved smile',
    icon: 'smile',
    gradient: 'from-teal-500 to-cyan-500',
  },
  {
    value: 100,
    label: 'Open Eyes',
    description: 'Brighten and open eyes',
    icon: 'eye',
    gradient: 'from-green-500 to-emerald-500',
  },
];

const getIcon = (iconType: string) => {
  switch (iconType) {
    case 'smile':
      return <Smile className="w-12 h-12" />;
    case 'laugh':
      return <Laugh className="w-12 h-12" />;
    case 'frown':
      return <Frown className="w-12 h-12" />;
    case 'meh':
      return <Meh className="w-12 h-12" />;
    case 'eye':
      return <Eye className="w-12 h-12" />;
    default:
      return <Smile className="w-12 h-12" />;
  }
};

export default function ExpressionSelector({
  onExpressionSelect,
  disabled = false,
}: ExpressionSelectorProps) {
  const [selectedExpression, setSelectedExpression] = useState<FacialExpression | null>(null);

  const handleSelect = (expression: FacialExpression) => {
    if (disabled) return;
    setSelectedExpression(expression);
  };

  const handleApply = () => {
    if (!selectedExpression || disabled) return;
    onExpressionSelect({ expression: selectedExpression });
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
          Change Your Expression
        </h2>
        <p className="text-gray-600">
          Select an expression to transform your facial emotion
        </p>
      </motion.div>

      {/* Expression Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {expressions.map((expr, index) => (
          <motion.button
            key={expr.value}
            onClick={() => handleSelect(expr.value)}
            disabled={disabled}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: disabled ? 1 : 1.05 }}
            whileTap={{ scale: disabled ? 1 : 0.95 }}
            className={`relative group p-6 rounded-2xl transition-all duration-300 ${
              selectedExpression === expr.value
                ? `bg-gradient-to-br ${expr.gradient} text-white shadow-xl ring-4 ring-purple-300`
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            {/* Icon */}
            <div className={`flex justify-center mb-3 ${
              selectedExpression === expr.value ? 'text-white' : 'text-purple-500'
            }`}>
              {getIcon(expr.icon)}
            </div>

            {/* Label */}
            <h3 className="text-lg font-bold mb-1">
              {expr.label}
            </h3>

            {/* Description */}
            <p className={`text-sm ${
              selectedExpression === expr.value ? 'text-white/90' : 'text-gray-500'
            }`}>
              {expr.description}
            </p>

            {/* Selection indicator */}
            {selectedExpression === expr.value && (
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
        transition={{ delay: 0.4 }}
        className="flex justify-center"
      >
        <button
          onClick={handleApply}
          disabled={disabled || !selectedExpression}
          className={`px-12 py-4 rounded-xl font-bold text-lg transition-all ${
            disabled || !selectedExpression
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-xl hover:scale-105'
          }`}
        >
          {disabled ? 'Processing...' : 'Apply Expression'}
        </button>
      </motion.div>

      {/* Selection Summary */}
      {selectedExpression && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center p-4 bg-purple-50 rounded-xl"
        >
          <div className="text-sm text-gray-600">
            Selected: <span className="font-semibold text-purple-700">
              {expressions.find(e => e.value === selectedExpression)?.label}
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
