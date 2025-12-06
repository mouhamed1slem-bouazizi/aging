'use client';

import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import {
  CameraCapture,
  ImageUpload,
  AgeSelector,
  LoadingAnimation,
  ImageComparison,
  ResultActions,
  ErrorDisplay,
} from '@/components';
import { AgeCategory, TransformResponse } from '@/types';
import { AGE_CATEGORIES } from '@/lib/constants';
import { compressImage } from '@/lib/utils';

type Step = 'upload' | 'select-age' | 'processing' | 'result' | 'error';

export default function TransformPage() {
  const [step, setStep] = useState<Step>('upload');
  const [showCamera, setShowCamera] = useState(false);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [transformedImage, setTransformedImage] = useState<string | null>(null);
  const [selectedAge, setSelectedAge] = useState<AgeCategory | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = useCallback(async (imageSrc: string) => {
    try {
      // Compress image for faster processing
      const compressed = await compressImage(imageSrc, 1024, 0.85);
      setOriginalImage(compressed);
      setStep('select-age');
      setShowCamera(false);
    } catch (err) {
      console.error('Image compression error:', err);
      setOriginalImage(imageSrc);
      setStep('select-age');
      setShowCamera(false);
    }
  }, []);

  const handleAgeSelect = useCallback(async (age: AgeCategory) => {
    setSelectedAge(age);
    
    if (!originalImage) {
      setError('No image selected');
      setStep('error');
      return;
    }

    setStep('processing');
    setError(null);

    try {
      const response = await fetch('/api/transform', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: originalImage,
          ageCategory: age,
        }),
      });

      const data: TransformResponse = await response.json();

      if (!data.success || !data.transformedImage) {
        throw new Error(data.error || 'Transformation failed');
      }

      setTransformedImage(data.transformedImage);
      setStep('result');
    } catch (err) {
      console.error('Transform error:', err);
      setError(err instanceof Error ? err.message : 'Failed to transform image');
      setStep('error');
    }
  }, [originalImage]);

  const handleStartOver = useCallback(() => {
    setOriginalImage(null);
    setTransformedImage(null);
    setSelectedAge(null);
    setError(null);
    setStep('upload');
  }, []);

  const handleTryAnother = useCallback(() => {
    setTransformedImage(null);
    setSelectedAge(null);
    setError(null);
    setStep('select-age');
  }, []);

  const handleGoBack = useCallback(() => {
    if (step === 'select-age') {
      setStep('upload');
      setOriginalImage(null);
    } else if (step === 'error') {
      if (originalImage) {
        setStep('select-age');
      } else {
        setStep('upload');
      }
    }
  }, [step, originalImage]);

  const handleRetry = useCallback(() => {
    if (selectedAge && originalImage) {
      handleAgeSelect(selectedAge);
    } else {
      handleGoBack();
    }
  }, [selectedAge, originalImage, handleAgeSelect, handleGoBack]);

  const getStepTitle = () => {
    switch (step) {
      case 'upload':
        return 'Upload Your Photo';
      case 'select-age':
        return 'Select Age';
      case 'processing':
        return 'Processing';
      case 'result':
        const category = AGE_CATEGORIES.find((c) => c.id === selectedAge);
        return `Your ${category?.label} Look`;
      case 'error':
        return 'Error';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="sticky top-16 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            {(step === 'select-age' || step === 'error') && (
              <button
                onClick={handleGoBack}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
            )}
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">{getStepTitle()}</h1>
              {step !== 'processing' && step !== 'error' && (
                <p className="text-sm text-gray-500">
                  {step === 'upload' && 'Take a selfie or upload a photo'}
                  {step === 'select-age' && 'Choose your desired age'}
                  {step === 'result' && 'Your transformation is ready!'}
                </p>
              )}
            </div>
          </div>

          {/* Progress indicator */}
          <div className="flex gap-2 mt-4">
            {['upload', 'select-age', 'result'].map((s, index) => (
              <div
                key={s}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  ['upload', 'select-age', 'processing', 'result'].indexOf(step) >= index
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {/* Upload Step */}
          {step === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <ImageUpload
                onImageSelect={handleImageSelect}
                onOpenCamera={() => setShowCamera(true)}
              />
            </motion.div>
          )}

          {/* Age Selection Step */}
          {step === 'select-age' && originalImage && (
            <motion.div
              key="select-age"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <AgeSelector
                selectedAge={selectedAge}
                onSelect={handleAgeSelect}
                originalImage={originalImage}
              />
            </motion.div>
          )}

          {/* Processing Step */}
          {step === 'processing' && selectedAge && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <LoadingAnimation ageCategory={selectedAge} />
            </motion.div>
          )}

          {/* Result Step */}
          {step === 'result' && originalImage && transformedImage && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-8"
            >
              <ImageComparison
                originalImage={originalImage}
                transformedImage={transformedImage}
                originalLabel="Original"
                transformedLabel={AGE_CATEGORIES.find((c) => c.id === selectedAge)?.label || 'Transformed'}
              />
              <ResultActions
                transformedImage={transformedImage}
                onStartOver={handleStartOver}
                onTryAnother={handleTryAnother}
              />
            </motion.div>
          )}

          {/* Error Step */}
          {step === 'error' && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <ErrorDisplay
                message={error || 'An unexpected error occurred'}
                onRetry={handleRetry}
                onGoBack={handleGoBack}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Camera Modal */}
      <AnimatePresence>
        {showCamera && (
          <CameraCapture
            onCapture={handleImageSelect}
            onClose={() => setShowCamera(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
