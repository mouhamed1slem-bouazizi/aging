'use client';

import { useState } from 'react';
import { ReactCompareSlider, ReactCompareSliderImage, ReactCompareSliderHandle } from 'react-compare-slider';
import { motion } from 'framer-motion';

interface ImageComparisonProps {
  originalImage: string;
  transformedImage: string;
  originalLabel?: string;
  transformedLabel?: string;
}

export default function ImageComparison({
  originalImage,
  transformedImage,
  originalLabel = 'Before',
  transformedLabel = 'After',
}: ImageComparisonProps) {
  const [position, setPosition] = useState(50);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="relative rounded-3xl overflow-hidden shadow-2xl ring-1 ring-gray-200">
        <ReactCompareSlider
          position={position}
          onPositionChange={setPosition}
          itemOne={
            <ReactCompareSliderImage
              src={originalImage}
              alt="Original"
              className="w-full h-full object-cover"
            />
          }
          itemTwo={
            <ReactCompareSliderImage
              src={transformedImage}
              alt="Transformed"
              className="w-full h-full object-cover"
            />
          }
          handle={
            <ReactCompareSliderHandle
              buttonStyle={{
                backdropFilter: 'blur(8px)',
                background: 'rgba(255, 255, 255, 0.9)',
                border: 'none',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                color: '#7c3aed',
                width: 44,
                height: 44,
              }}
              linesStyle={{
                width: 3,
                background: 'linear-gradient(to bottom, #a855f7, #ec4899)',
              }}
            />
          }
          style={{
            height: 'auto',
            aspectRatio: '1/1',
          }}
        />

        {/* Labels */}
        <div className="absolute top-4 left-4 px-3 py-1.5 bg-black/50 backdrop-blur-sm rounded-full">
          <span className="text-white text-sm font-medium">{originalLabel}</span>
        </div>
        <div className="absolute top-4 right-4 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full">
          <span className="text-white text-sm font-medium">{transformedLabel}</span>
        </div>
      </div>

      {/* Instructions */}
      <p className="text-center text-gray-500 text-sm mt-4">
        Drag the slider to compare before and after
      </p>
    </motion.div>
  );
}
