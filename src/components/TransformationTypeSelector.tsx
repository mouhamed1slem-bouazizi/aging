'use client';

import { motion } from 'framer-motion';
import { TransformationType } from '@/types';

interface TransformationTypeSelectorProps {
  onTypeSelect: (type: TransformationType) => void;
  disabled?: boolean;
}

const TRANSFORMATION_TYPES = [
  {
    id: 'age' as TransformationType,
    label: 'Age Transformation',
    description: 'Make yourself younger or older',
    icon: '⏳',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    id: 'gender' as TransformationType,
    label: 'Gender Transformation',
    description: 'See yourself in a different gender',
    icon: '⚧️',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'filter' as TransformationType,
    label: 'Face Filters',
    description: 'Apply artistic filters to your photo',
    icon: '✨',
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    id: 'lip-color' as TransformationType,
    label: 'Lip Color',
    description: 'Try different lipstick colors',
    icon: '💄',
    gradient: 'from-rose-500 to-red-500',
  },
  {
    id: 'face-beauty' as TransformationType,
    label: 'Face Beauty',
    description: 'Enhance skin with beauty filters',
    icon: '💎',
    gradient: 'from-purple-500 to-indigo-500',
  },
  {
    id: 'face-slimming' as TransformationType,
    label: 'Face Slimming',
    description: 'Slim your face naturally',
    icon: '🌟',
    gradient: 'from-blue-500 to-purple-500',
  },
  {
    id: 'skin-beauty' as TransformationType,
    label: 'Skin Beauty',
    description: 'Smooth and brighten skin',
    icon: '🌸',
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    id: 'face-fusion' as TransformationType,
    label: 'Merge Portraits',
    description: 'Blend faces with template',
    icon: '🎭',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    id: 'smart-beauty' as TransformationType,
    label: 'Smart Beauty',
    description: 'AI-powered beauty enhancement',
    icon: '✨',
    gradient: 'from-pink-500 to-purple-500',
  },
  {
    id: 'hairstyle' as TransformationType,
    label: 'Hairstyle Changer',
    description: 'Try different hairstyles and colors',
    icon: '✂️',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    id: 'expression' as TransformationType,
    label: 'Facial Expression',
    description: 'Change your facial emotions',
    icon: '😊',
    gradient: 'from-yellow-500 to-orange-500',
  },
  {
    id: 'cartoon' as TransformationType,
    label: 'Cartoon Yourself',
    description: 'Transform into cartoon styles',
    icon: '🎨',
    gradient: 'from-indigo-500 to-purple-500',
  },
  {
    id: 'image-enhance' as TransformationType,
    label: 'Image Enhancer',
    description: 'Enhance image contrast and quality',
    icon: '✨',
    gradient: 'from-green-500 to-teal-500',
  },
  {
    id: 'image-dehaze' as TransformationType,
    label: 'Image Dehaze',
    description: 'Remove fog and haze from images',
    icon: '🌫️',
    gradient: 'from-cyan-500 to-blue-500',
  },
  {
    id: 'photo-colorize' as TransformationType,
    label: 'Photo Colorize',
    description: 'Add color to black and white photos',
    icon: '🎨',
    gradient: 'from-pink-500 to-purple-500',
  },
];

export default function TransformationTypeSelector({
  onTypeSelect,
  disabled = false,
}: TransformationTypeSelectorProps) {
  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Choose Transformation Type
        </h2>
        <p className="text-gray-600">
          Select what type of transformation you want to apply
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {TRANSFORMATION_TYPES.map((type, index) => (
          <motion.button
            key={type.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onTypeSelect(type.id)}
            disabled={disabled}
            className="relative group p-6 rounded-2xl bg-white border-2 border-gray-200 hover:border-transparent transition-all duration-300 shadow-lg hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
          >
            {/* Gradient background on hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${type.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

            {/* Icon */}
            <div className="text-5xl md:text-6xl mb-3 transform group-hover:scale-110 transition-transform duration-300">
              {type.icon}
            </div>

            {/* Label */}
            <h3 className="text-lg md:text-xl font-bold mb-2 text-gray-800 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-gray-800 group-hover:to-gray-600 transition-all duration-300">
              {type.label}
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
              {type.description}
            </p>

            {/* Arrow indicator */}
            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
              <svg
                className="w-6 h-6 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
