'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ZoomIn, ArrowRight } from 'lucide-react';
import { UpscaleParams, UpscaleFactor, UpscaleMode, OutputFormat } from '@/types';

interface UpscaleParamsSelectorProps {
  onSelect: (params: UpscaleParams) => void;
}

export default function UpscaleParamsSelector({ onSelect }: UpscaleParamsSelectorProps) {
  const [upscaleFactor, setUpscaleFactor] = useState<UpscaleFactor>(2);
  const [mode, setMode] = useState<UpscaleMode>('base');
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('png');
  const [outputQuality, setOutputQuality] = useState<number>(95);

  const handleConfirm = useCallback(() => {
    onSelect({
      upscaleFactor,
      mode,
      outputFormat,
      outputQuality,
    });
  }, [upscaleFactor, mode, outputFormat, outputQuality, onSelect]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-16 h-16 mx-auto bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center"
        >
          <ZoomIn className="w-8 h-8 text-white" />
        </motion.div>
        <h2 className="text-2xl font-bold text-gray-900">Upscale Settings</h2>
        <p className="text-gray-600">
          Configure upscaling parameters for best results
        </p>
      </div>

      {/* Upscale Factor */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-3"
      >
        <label className="block text-sm font-semibold text-gray-700">
          Upscale Factor
        </label>
        <div className="grid grid-cols-3 gap-3">
          {[2, 3, 4].map((factor) => (
            <button
              key={factor}
              onClick={() => setUpscaleFactor(factor as UpscaleFactor)}
              className={`p-4 rounded-xl border-2 transition-all ${
                upscaleFactor === factor
                  ? 'border-emerald-500 bg-emerald-50'
                  : 'border-gray-200 hover:border-emerald-300 bg-white'
              }`}
            >
              <div className="text-3xl font-bold text-gray-900">{factor}×</div>
              <div className="text-xs text-gray-500 mt-1">Enlargement</div>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Mode Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-3"
      >
        <label className="block text-sm font-semibold text-gray-700">
          Processing Mode
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setMode('base')}
            className={`p-4 rounded-xl border-2 transition-all text-left ${
              mode === 'base'
                ? 'border-emerald-500 bg-emerald-50'
                : 'border-gray-200 hover:border-emerald-300 bg-white'
            }`}
          >
            <div className="font-semibold text-gray-900">Base Mode</div>
            <div className="text-xs text-gray-500 mt-1">
              Stable super-resolution
            </div>
          </button>
          <button
            onClick={() => setMode('enhancement')}
            className={`p-4 rounded-xl border-2 transition-all text-left ${
              mode === 'enhancement'
                ? 'border-emerald-500 bg-emerald-50'
                : 'border-gray-200 hover:border-emerald-300 bg-white'
            }`}
          >
            <div className="font-semibold text-gray-900">Enhancement</div>
            <div className="text-xs text-gray-500 mt-1">
              Extra clarity & sharpness
            </div>
          </button>
        </div>
      </motion.div>

      {/* Output Format */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-3"
      >
        <label className="block text-sm font-semibold text-gray-700">
          Output Format
        </label>
        <div className="grid grid-cols-3 gap-3">
          {(['png', 'jpg', 'bmp'] as OutputFormat[]).map((format) => (
            <button
              key={format}
              onClick={() => setOutputFormat(format)}
              className={`p-4 rounded-xl border-2 transition-all ${
                outputFormat === format
                  ? 'border-emerald-500 bg-emerald-50'
                  : 'border-gray-200 hover:border-emerald-300 bg-white'
              }`}
            >
              <div className="font-semibold text-gray-900 uppercase">{format}</div>
              <div className="text-xs text-gray-500 mt-1">
                {format === 'png' && 'Best quality'}
                {format === 'jpg' && 'Smaller size'}
                {format === 'bmp' && 'Lossless'}
              </div>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Quality Slider (only for JPG) */}
      {outputFormat === 'jpg' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-3"
        >
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold text-gray-700">
              JPG Quality
            </label>
            <span className="text-lg font-bold text-emerald-600">{outputQuality}%</span>
          </div>
          <input
            type="range"
            min="30"
            max="100"
            value={outputQuality}
            onChange={(e) => setOutputQuality(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Lower Size</span>
            <span>Higher Quality</span>
          </div>
        </motion.div>
      )}

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100"
      >
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Enlargement:</span>
            <span className="font-semibold text-gray-900">{upscaleFactor}× larger</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Mode:</span>
            <span className="font-semibold text-gray-900 capitalize">{mode}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Format:</span>
            <span className="font-semibold text-gray-900 uppercase">{outputFormat}</span>
          </div>
          {outputFormat === 'jpg' && (
            <div className="flex justify-between">
              <span className="text-gray-600">Quality:</span>
              <span className="font-semibold text-gray-900">{outputQuality}%</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Confirm Button */}
      <button
        onClick={handleConfirm}
        className="w-full px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg shadow-emerald-500/30 font-medium flex items-center justify-center gap-2"
      >
        <span>Upscale Image</span>
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
}
