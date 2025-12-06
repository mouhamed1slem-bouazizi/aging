'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from '@/lib/constants';
import { fileToBase64, isValidFileSize, isValidImageType, formatFileSize } from '@/lib/utils';

interface ImageUploadProps {
  onImageSelect: (imageSrc: string) => void;
  onOpenCamera: () => void;
}

export default function ImageUpload({ onImageSelect, onOpenCamera }: ImageUploadProps) {
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setError(null);
      const file = acceptedFiles[0];

      if (!file) {
        return;
      }

      if (!isValidImageType(file)) {
        setError('Please upload a valid image file (JPG, PNG, or WebP)');
        return;
      }

      if (!isValidFileSize(file)) {
        setError(`File size must be less than ${formatFileSize(MAX_FILE_SIZE)}`);
        return;
      }

      setIsProcessing(true);
      try {
        const base64 = await fileToBase64(file);
        onImageSelect(base64);
      } catch (err) {
        setError('Failed to process the image. Please try again.');
        console.error('Image processing error:', err);
      } finally {
        setIsProcessing(false);
      }
    },
    [onImageSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_IMAGE_TYPES,
    maxFiles: 1,
    disabled: isProcessing,
  });

  return (
    <div className="w-full max-w-xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Dropzone */}
        <div
          {...getRootProps()}
          className={`
            relative border-2 border-dashed rounded-3xl p-8 md:p-12 text-center cursor-pointer
            transition-all duration-300 ease-out
            ${isDragActive
              ? 'border-purple-500 bg-purple-50 scale-[1.02]'
              : 'border-gray-200 bg-gray-50/50 hover:border-purple-300 hover:bg-purple-50/50'
            }
            ${isProcessing ? 'opacity-50 cursor-wait' : ''}
          `}
        >
          <input {...getInputProps()} />
          
          <div className="space-y-4">
            <div className={`
              w-16 h-16 mx-auto rounded-2xl flex items-center justify-center
              transition-colors
              ${isDragActive ? 'bg-purple-500' : 'bg-gradient-to-br from-purple-500 to-pink-500'}
            `}>
              {isProcessing ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Upload className="w-7 h-7 text-white" />
              )}
            </div>

            <div>
              <p className="text-lg font-semibold text-gray-800">
                {isDragActive ? 'Drop your photo here' : 'Upload a photo'}
              </p>
              <p className="text-gray-500 mt-1">
                Drag and drop or click to browse
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
              <ImageIcon className="w-4 h-4" />
              <span>JPG, PNG, WebP up to {formatFileSize(MAX_FILE_SIZE)}</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-sm text-gray-400 font-medium">or</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Camera Button */}
        <button
          onClick={onOpenCamera}
          disabled={isProcessing}
          className="w-full py-4 px-6 bg-white border-2 border-gray-200 rounded-2xl font-semibold text-gray-700 hover:border-purple-300 hover:bg-purple-50/50 transition-all flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-purple-100 transition-colors">
            <svg className="w-5 h-5 text-gray-600 group-hover:text-purple-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <span>Take a photo with camera</span>
        </button>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
