'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { compressImage } from '@/lib/utils';

interface StyleImageSelectorProps {
  onSelect: (styleImage: string) => void;
  onBack: () => void;
}

export default function StyleImageSelector({ onSelect, onBack }: StyleImageSelectorProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

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
        setPreview(result);
        
        // Compress image
        try {
          const compressed = await compressImage(result, 1024, 0.85);
          setPreview(compressed);
        } catch (compressionError) {
          console.error('Compression error:', compressionError);
          // Use original if compression fails
        }
        setIsProcessing(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error reading file:', error);
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

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleConfirm = useCallback(() => {
    if (preview) {
      onSelect(preview);
    }
  }, [preview, onSelect]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-16 h-16 mx-auto bg-gradient-to-br from-violet-500 to-purple-500 rounded-2xl flex items-center justify-center"
        >
          <ImageIcon className="w-8 h-8 text-white" />
        </motion.div>
        <h2 className="text-2xl font-bold text-gray-900">Upload Style Reference</h2>
        <p className="text-gray-600">
          Upload a reference image to apply its style to your photo
        </p>
      </div>

      {/* Upload Area */}
      {!preview && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-colors ${
            isDragging
              ? 'border-violet-500 bg-violet-50'
              : 'border-gray-300 hover:border-violet-400'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isProcessing}
          />
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-violet-100 to-purple-100 rounded-full flex items-center justify-center">
              <Upload className="w-8 h-8 text-violet-600" />
            </div>
            <div>
              <p className="text-lg font-medium text-gray-900">
                {isDragging ? 'Drop your style image here' : 'Drop your style image or click to browse'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                PNG, JPG up to 3MB
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Preview */}
      {preview && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-4"
        >
          <div className="relative rounded-2xl overflow-hidden bg-gray-100">
            <img
              src={preview}
              alt="Style reference preview"
              className="w-full h-auto max-h-96 object-contain mx-auto"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                setPreview(null);
                setIsProcessing(false);
              }}
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
            >
              Change Image
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-xl hover:from-violet-600 hover:to-purple-600 transition-all shadow-lg shadow-violet-500/30 font-medium"
            >
              Confirm Style
            </button>
          </div>
        </motion.div>
      )}

      {/* Back Button */}
      <button
        onClick={onBack}
        className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
      >
        Back
      </button>
    </div>
  );
}
