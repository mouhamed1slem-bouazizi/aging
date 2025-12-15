'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Crop, ArrowRight } from 'lucide-react';
import { CropParams } from '@/types';

interface CropDimensionsSelectorProps {
  onSelect: (crop: CropParams) => void;
  originalImage?: string;
}

// Common aspect ratios and presets
const PRESETS = [
  { label: '1:1 Square', width: 1080, height: 1080, ratio: '1:1' },
  { label: '4:3 Standard', width: 1024, height: 768, ratio: '4:3' },
  { label: '16:9 Widescreen', width: 1920, height: 1080, ratio: '16:9' },
  { label: '9:16 Portrait', width: 1080, height: 1920, ratio: '9:16' },
  { label: '3:2 Photo', width: 1500, height: 1000, ratio: '3:2' },
  { label: '2:3 Portrait Photo', width: 1000, height: 1500, ratio: '2:3' },
  { label: '21:9 Ultrawide', width: 2560, height: 1080, ratio: '21:9' },
  { label: '4:5 Instagram', width: 1080, height: 1350, ratio: '4:5' },
];

export default function CropDimensionsSelector({ onSelect, originalImage }: CropDimensionsSelectorProps) {
  const [width, setWidth] = useState<number>(1080);
  const [height, setHeight] = useState<number>(1080);
  const [customMode, setCustomMode] = useState(false);

  const handlePresetSelect = useCallback((preset: typeof PRESETS[0]) => {
    setWidth(preset.width);
    setHeight(preset.height);
    setCustomMode(false);
  }, []);

  const handleConfirm = useCallback(() => {
    if (width > 0 && height > 0 && width <= 2000 && height <= 2000) {
      onSelect({ width, height });
    } else {
      alert('Please enter valid dimensions (1-2000 pixels)');
    }
  }, [width, height, onSelect]);

  const currentRatio = width && height ? (width / height).toFixed(2) : '1.00';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center"
        >
          <Crop className="w-8 h-8 text-white" />
        </motion.div>
        <h2 className="text-2xl font-bold text-gray-900">Set Crop Dimensions</h2>
        <p className="text-gray-600">
          Choose a preset or enter custom dimensions
        </p>
      </div>

      {/* Current Selection Display */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100"
      >
        <div className="text-center space-y-2">
          <p className="text-sm font-medium text-gray-600">Selected Dimensions</p>
          <div className="flex items-center justify-center gap-3 text-3xl font-bold text-gray-900">
            <span>{width}</span>
            <span className="text-blue-500">×</span>
            <span>{height}</span>
          </div>
          <p className="text-sm text-gray-500">
            Aspect Ratio: {currentRatio}:1
          </p>
        </div>
      </motion.div>

      {/* Preset Selection */}
      {!customMode && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-3"
        >
          <h3 className="text-sm font-semibold text-gray-700">Common Presets</h3>
          <div className="grid grid-cols-2 gap-3">
            {PRESETS.map((preset) => (
              <button
                key={preset.label}
                onClick={() => handlePresetSelect(preset)}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  width === preset.width && height === preset.height
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300 bg-white'
                }`}
              >
                <div className="font-semibold text-gray-900 text-sm">{preset.label}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {preset.width} × {preset.height}
                </div>
                <div className="text-xs text-blue-600 font-medium mt-1">
                  {preset.ratio}
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Custom Dimensions */}
      {customMode && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-4"
        >
          <h3 className="text-sm font-semibold text-gray-700">Custom Dimensions</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Width (px)
              </label>
              <input
                type="number"
                min="1"
                max="2000"
                value={width}
                onChange={(e) => setWidth(parseInt(e.target.value) || 0)}
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-gray-900"
                placeholder="Width"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Height (px)
              </label>
              <input
                type="number"
                min="1"
                max="2000"
                value={height}
                onChange={(e) => setHeight(parseInt(e.target.value) || 0)}
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-gray-900"
                placeholder="Height"
              />
            </div>
          </div>
          <p className="text-xs text-gray-500">
            Maximum dimensions: 2000 × 2000 pixels
          </p>
        </motion.div>
      )}

      {/* Toggle Custom Mode */}
      <button
        onClick={() => setCustomMode(!customMode)}
        className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
      >
        {customMode ? 'Use Presets' : 'Enter Custom Dimensions'}
      </button>

      {/* Confirm Button */}
      <button
        onClick={handleConfirm}
        disabled={!width || !height || width > 2000 || height > 2000}
        className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg shadow-blue-500/30 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <span>Crop Image</span>
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
}
