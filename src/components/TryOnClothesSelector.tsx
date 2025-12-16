'use client';

import { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Shirt, Upload, Check, ArrowLeft } from 'lucide-react';
import { ClothesType, TryOnClothesParams } from '@/types';
import { compressImage } from '@/lib/utils';

interface ClothesTypeOption {
  id: ClothesType;
  label: string;
  description: string;
  icon: string;
}

const CLOTHES_TYPES: ClothesTypeOption[] = [
  {
    id: 'upper_body',
    label: 'Upper Body',
    description: 'Shirts, T-shirts, Jackets',
    icon: '👔',
  },
  {
    id: 'lower_body',
    label: 'Lower Body',
    description: 'Pants, Jeans, Skirts',
    icon: '👖',
  },
  {
    id: 'full_body',
    label: 'Full Body',
    description: 'Dresses, Suits, Jumpsuits',
    icon: '👗',
  },
];

interface TryOnClothesSelectorProps {
  onSelect: (params: TryOnClothesParams) => void;
  onBack: () => void;
}

export default function TryOnClothesSelector({ onSelect, onBack }: TryOnClothesSelectorProps) {
  const [clothesImage, setClothesImage] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<ClothesType | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    setIsProcessing(true);

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const result = e.target?.result as string;
        setClothesImage(result);
        
        // Compress image
        try {
          const compressed = await compressImage(result, 1024, 0.85);
          setClothesImage(compressed);
        } catch (error) {
          console.error('Compression error:', error);
          setClothesImage(result);
        }
        
        setIsProcessing(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('File read error:', error);
      setIsProcessing(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleConfirm = useCallback(() => {
    if (!clothesImage || !selectedType) return;

    onSelect({
      clothesImage,
      clothesType: selectedType,
    });
  }, [clothesImage, selectedType, onSelect]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-16 h-16 mx-auto bg-gradient-to-br from-rose-500 to-pink-500 rounded-2xl flex items-center justify-center"
        >
          <Shirt className="w-8 h-8 text-white" />
        </motion.div>
        <h2 className="text-2xl font-bold text-gray-900">Upload Clothing</h2>
        <p className="text-gray-600">
          Upload a clothing item and select its type
        </p>
      </div>

      {/* Clothing Image Upload */}
      {!clothesImage ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-rose-500 bg-rose-50'
              : 'border-gray-300 hover:border-rose-400 hover:bg-rose-50/50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileSelect(file);
            }}
            className="hidden"
          />

          <Upload className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Upload Clothing Image
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Drag & drop or click to select
          </p>
          <p className="text-xs text-gray-400">
            Clear, flat-lay image • Simple background • Single item only
          </p>

          {isProcessing && (
            <div className="absolute inset-0 bg-white/80 rounded-2xl flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-rose-500 border-t-transparent" />
            </div>
          )}
        </motion.div>
      ) : (
        <>
          {/* Image Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <img
              src={clothesImage}
              alt="Clothing"
              className="w-full h-64 object-contain rounded-2xl border-2 border-gray-200 bg-gray-50"
            />
            <button
              onClick={() => {
                setClothesImage(null);
                setSelectedType(null);
              }}
              className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
            >
              <span className="text-lg">✕</span>
            </button>
          </motion.div>

          {/* Clothing Type Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-3"
          >
            <h3 className="text-sm font-semibold text-gray-700">Select Clothing Type</h3>
            <div className="grid grid-cols-1 gap-3">
              {CLOTHES_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`p-4 rounded-xl border-2 transition-all text-left flex items-center gap-4 ${
                    selectedType === type.id
                      ? 'border-rose-500 bg-rose-50'
                      : 'border-gray-200 hover:border-rose-300 bg-white'
                  }`}
                >
                  <div className="text-3xl">{type.icon}</div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{type.label}</div>
                    <div className="text-xs text-gray-500">{type.description}</div>
                  </div>
                  {selectedType === type.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center"
                    >
                      <Check className="w-4 h-4 text-white" />
                    </motion.div>
                  )}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Guidelines */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-4 border border-rose-100"
          >
            <h4 className="text-sm font-semibold text-gray-700 mb-2">📋 Guidelines</h4>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>✓ Clear, well-aligned flat-lay image</li>
              <li>✓ Simple, clean background</li>
              <li>✓ Single clothing item only</li>
              <li>✗ No multiple items or layering</li>
              <li>✗ Avoid folded or wrinkled clothing</li>
            </ul>
          </motion.div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onBack}
              className="flex-1 px-6 py-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-medium flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedType}
              className={`flex-1 px-6 py-4 rounded-xl transition-all font-medium flex items-center justify-center gap-2 ${
                selectedType
                  ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:from-rose-600 hover:to-pink-600 shadow-lg shadow-rose-500/30'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <span>Try On Clothes</span>
              <Shirt className="w-5 h-5" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
