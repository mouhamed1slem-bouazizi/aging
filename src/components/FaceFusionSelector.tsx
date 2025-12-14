'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Upload, Image as ImageIcon } from 'lucide-react';
import { FaceFusionParams } from '@/types';

interface FaceFusionSelectorProps {
  onFusionSelect: (params: FaceFusionParams) => void;
  disabled?: boolean;
}

export default function FaceFusionSelector({
  onFusionSelect,
  disabled = false,
}: FaceFusionSelectorProps) {
  const [templateImage, setTemplateImage] = useState<string | null>(null);
  const [sourceSimilarity, setSourceSimilarity] = useState(0.5);
  const [isUploading, setIsUploading] = useState(false);

  const handleTemplateUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setTemplateImage(result);
      setIsUploading(false);
    };
    reader.onerror = () => {
      setIsUploading(false);
      alert('Failed to load template image');
    };
    reader.readAsDataURL(file);
  }, []);

  const handleApply = () => {
    if (!templateImage) {
      alert('Please upload a template image first');
      return;
    }
    
    onFusionSelect({
      templateImage,
      sourceSimilarity,
    });
  };

  const presets = [
    {
      id: 'template-focused',
      label: 'Template Focused',
      icon: '🎭',
      description: 'More like template',
      value: 0.2,
    },
    {
      id: 'balanced',
      label: 'Balanced',
      icon: '⚖️',
      description: 'Equal blend',
      value: 0.5,
    },
    {
      id: 'target-focused',
      label: 'Target Focused',
      icon: '👤',
      description: 'More like your photo',
      value: 0.8,
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Merge Portraits
        </h2>
        <p className="text-gray-600">
          Upload a template image and adjust fusion similarity
        </p>
      </div>

      {/* Template Upload Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-100 mb-6"
      >
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-purple-500" />
          Step 1: Upload Template Image
        </h3>

        <div className="flex flex-col md:flex-row gap-6 items-center">
          {/* Upload Area */}
          <div className="flex-1 w-full">
            <label
              htmlFor="template-upload"
              className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                templateImage
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
              }`}
            >
              {templateImage ? (
                <div className="relative w-full h-full p-4">
                  <img
                    src={templateImage}
                    alt="Template"
                    className="w-full h-full object-contain rounded-lg"
                  />
                  <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    ✓ Loaded
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-12 h-12 text-gray-400 mb-3" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> template image
                  </p>
                  <p className="text-xs text-gray-400">PNG, JPG, BMP (MAX. 4MB)</p>
                </div>
              )}
              <input
                id="template-upload"
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/bmp"
                onChange={handleTemplateUpload}
                disabled={disabled || isUploading}
                className="hidden"
              />
            </label>
          </div>

          {/* Preview Info */}
          <div className="flex-1 w-full">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
              <h4 className="font-bold text-gray-800 mb-3">Template Requirements:</h4>
              <ul className="text-sm text-gray-700 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-purple-500">•</span>
                  <span>Clear face visibility (at least 200x200px)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500">•</span>
                  <span>Front-facing or slight angle preferred</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500">•</span>
                  <span>Good lighting and no occlusions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500">•</span>
                  <span>High quality for best results</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Similarity Control Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-100 mb-6"
      >
        <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-pink-500" />
          Step 2: Adjust Fusion Similarity
        </h3>

        {/* Quick Presets */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {presets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => setSourceSimilarity(preset.value)}
              disabled={disabled}
              className={`p-4 rounded-xl border-2 transition-all ${
                Math.abs(sourceSimilarity - preset.value) < 0.1
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-purple-300'
              }`}
            >
              <span className="text-3xl mb-2 block">{preset.icon}</span>
              <h4 className="font-bold text-sm text-gray-800 mb-1">{preset.label}</h4>
              <p className="text-xs text-gray-600">{preset.description}</p>
            </button>
          ))}
        </div>

        {/* Similarity Slider */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-semibold text-gray-700">
              Similarity Level
            </label>
            <span className="text-sm font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
              {(sourceSimilarity * 100).toFixed(0)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={sourceSimilarity}
            onChange={(e) => setSourceSimilarity(parseFloat(e.target.value))}
            disabled={disabled}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-500 disabled:cursor-not-allowed"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Template (0%)</span>
            <span>Balanced (50%)</span>
            <span>Target (100%)</span>
          </div>
        </div>
      </motion.div>

      {/* Apply Button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleApply}
        disabled={disabled || !templateImage || isUploading}
        className="w-full py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <Sparkles className="w-5 h-5" />
        {!templateImage ? 'Upload Template First' : 'Merge Portraits'}
      </motion.button>
    </div>
  );
}
