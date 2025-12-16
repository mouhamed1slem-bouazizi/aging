'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Maximize2, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Settings, ArrowRight as ArrowRightIcon } from 'lucide-react';
import { ImageExtenderParams } from '@/types';

interface ImageExtenderSelectorProps {
  onSelect: (params: ImageExtenderParams) => void;
}

export default function ImageExtenderSelector({ onSelect }: ImageExtenderSelectorProps) {
  const [top, setTop] = useState<number>(0.1);
  const [bottom, setBottom] = useState<number>(0.1);
  const [left, setLeft] = useState<number>(0.1);
  const [right, setRight] = useState<number>(0.1);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [steps, setSteps] = useState<number>(30);
  const [strength, setStrength] = useState<number>(0.8);
  const [scale, setScale] = useState<number>(7);
  const [seed, setSeed] = useState<number>(0);
  const [maxHeight, setMaxHeight] = useState<number>(1920);
  const [maxWidth, setMaxWidth] = useState<number>(1920);

  const handleConfirm = useCallback(() => {
    onSelect({
      top,
      bottom,
      left,
      right,
      steps,
      strength,
      scale,
      seed,
      maxHeight,
      maxWidth,
    });
  }, [top, bottom, left, right, steps, strength, scale, seed, maxHeight, maxWidth, onSelect]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-16 h-16 mx-auto bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center"
        >
          <Maximize2 className="w-8 h-8 text-white" />
        </motion.div>
        <h2 className="text-2xl font-bold text-gray-900">Image Expansion</h2>
        <p className="text-gray-600">
          Expand your image in any direction
        </p>
      </div>

      {/* Visual Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-8 border border-cyan-100"
      >
        <div className="flex flex-col items-center space-y-4">
          {/* Top */}
          <div className="flex flex-col items-center">
            <ArrowUp className="w-6 h-6 text-cyan-600" />
            <span className="text-sm font-semibold text-gray-700">{(top * 100).toFixed(0)}%</span>
          </div>
          
          {/* Middle Row */}
          <div className="flex items-center space-x-4">
            {/* Left */}
            <div className="flex flex-col items-center">
              <ArrowLeft className="w-6 h-6 text-cyan-600" />
              <span className="text-sm font-semibold text-gray-700">{(left * 100).toFixed(0)}%</span>
            </div>
            
            {/* Center Image Placeholder */}
            <div className="w-32 h-32 bg-white rounded-lg border-2 border-cyan-400 flex items-center justify-center">
              <span className="text-sm text-gray-500">Original</span>
            </div>
            
            {/* Right */}
            <div className="flex flex-col items-center">
              <ArrowRight className="w-6 h-6 text-cyan-600" />
              <span className="text-sm font-semibold text-gray-700">{(right * 100).toFixed(0)}%</span>
            </div>
          </div>
          
          {/* Bottom */}
          <div className="flex flex-col items-center">
            <ArrowDown className="w-6 h-6 text-cyan-600" />
            <span className="text-sm font-semibold text-gray-700">{(bottom * 100).toFixed(0)}%</span>
          </div>
        </div>
      </motion.div>

      {/* Expansion Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <h3 className="text-sm font-semibold text-gray-700">Expansion Ratios</h3>
        
        {/* Top */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm text-gray-600">Top</label>
            <span className="text-sm font-bold text-cyan-600">{(top * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={top}
            onChange={(e) => setTop(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
        </div>

        {/* Bottom */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm text-gray-600">Bottom</label>
            <span className="text-sm font-bold text-cyan-600">{(bottom * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={bottom}
            onChange={(e) => setBottom(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
        </div>

        {/* Left */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm text-gray-600">Left</label>
            <span className="text-sm font-bold text-cyan-600">{(left * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={left}
            onChange={(e) => setLeft(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
        </div>

        {/* Right */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm text-gray-600">Right</label>
            <span className="text-sm font-bold text-cyan-600">{(right * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={right}
            onChange={(e) => setRight(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
        </div>
      </motion.div>

      {/* Advanced Settings Toggle */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="w-full flex items-center justify-between p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-cyan-300 transition-all"
      >
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-gray-600" />
          <span className="font-medium text-gray-700">Advanced Settings</span>
        </div>
        <motion.div
          animate={{ rotate: showAdvanced ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ArrowRightIcon className="w-5 h-5 text-gray-400" />
        </motion.div>
      </motion.button>

      {/* Advanced Settings Panel */}
      {showAdvanced && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-4 bg-gray-50 rounded-xl p-4 border border-gray-200"
        >
          {/* Steps */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm text-gray-600">Sampling Steps</label>
              <span className="text-sm font-bold text-gray-900">{steps}</span>
            </div>
            <input
              type="range"
              min="1"
              max="50"
              step="1"
              value={steps}
              onChange={(e) => setSteps(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
            <p className="text-xs text-gray-500">Higher values = better quality but slower</p>
          </div>

          {/* Strength */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm text-gray-600">Strength</label>
              <span className="text-sm font-bold text-gray-900">{strength.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.05"
              value={strength}
              onChange={(e) => setStrength(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
            <p className="text-xs text-gray-500">Lower = closer to original</p>
          </div>

          {/* Scale */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm text-gray-600">Guidance Scale</label>
              <span className="text-sm font-bold text-gray-900">{scale}</span>
            </div>
            <input
              type="range"
              min="1"
              max="20"
              step="1"
              value={scale}
              onChange={(e) => setScale(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
          </div>

          {/* Max Dimensions */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-600">Max Width</label>
              <input
                type="number"
                min="512"
                max="4096"
                step="128"
                value={maxWidth}
                onChange={(e) => setMaxWidth(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-600">Max Height</label>
              <input
                type="number"
                min="512"
                max="4096"
                step="128"
                value={maxHeight}
                onChange={(e) => setMaxHeight(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Confirm Button */}
      <button
        onClick={handleConfirm}
        className="w-full px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg shadow-cyan-500/30 font-medium flex items-center justify-center gap-2"
      >
        <span>Expand Image</span>
        <Maximize2 className="w-5 h-5" />
      </button>
    </div>
  );
}
