'use client';

import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import {
  CameraCapture,
  ImageUpload,
  AgeSelector,
  GenderSelector,
  FaceFilterSelector,
  LipColorSelector,
  TransformationTypeSelector,
  LoadingAnimation,
  ImageComparison,
  ResultActions,
  ErrorDisplay,
  ProtectedRoute,
} from '@/components';
import { AgeCategory, GenderOption, FaceFilterType, TransformationType, TransformResponse, LipColorRGBA } from '@/types';
import { AGE_CATEGORIES, GENDER_OPTIONS, FACE_FILTERS } from '@/lib/constants';
import { compressImage } from '@/lib/utils';

type Step = 'upload' | 'select-type' | 'select-age' | 'select-gender' | 'select-filter' | 'select-lip-color' | 'processing' | 'result' | 'error';

export default function TransformPage() {
  const [step, setStep] = useState<Step>('upload');
  const [showCamera, setShowCamera] = useState(false);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [transformedImage, setTransformedImage] = useState<string | null>(null);
  const [transformationType, setTransformationType] = useState<TransformationType | null>(null);
  const [selectedAge, setSelectedAge] = useState<AgeCategory | null>(null);
  const [selectedGender, setSelectedGender] = useState<GenderOption | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<FaceFilterType | null>(null);
  const [filterStrength, setFilterStrength] = useState<number>(0.7);
  const [selectedLipColor, setSelectedLipColor] = useState<LipColorRGBA | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = useCallback(async (imageSrc: string) => {
    try {
      // Compress image for faster processing (max 4MB for AILabAPI)
      const compressed = await compressImage(imageSrc, 1024, 0.85);
      setOriginalImage(compressed);
      setStep('select-type');
      setShowCamera(false);
    } catch (err) {
      console.error('Image compression error:', err);
      setOriginalImage(imageSrc);
      setStep('select-type');
      setShowCamera(false);
    }
  }, []);

  const handleTypeSelect = useCallback((type: TransformationType) => {
    setTransformationType(type);
    if (type === 'age') {
      setStep('select-age');
    } else if (type === 'gender') {
      setStep('select-gender');
    } else if (type === 'filter') {
      setStep('select-filter');
    } else if (type === 'lip-color') {
      setStep('select-lip-color');
    }
  }, []);

  const handleTransform = useCallback(async (type: TransformationType, value: AgeCategory | GenderOption) => {
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
          transformationType: type,
          ...(type === 'age' ? { ageCategory: value } : { gender: value }),
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

  const handleAgeSelect = useCallback(async (age: AgeCategory) => {
    setSelectedAge(age);
    await handleTransform('age', age);
  }, [handleTransform]);

  const handleGenderSelect = useCallback(async (gender: GenderOption) => {
    setSelectedGender(gender);
    await handleTransform('gender', gender);
  }, [handleTransform]);

  const handleFilterSelect = useCallback(async (filter: FaceFilterType, strength: number) => {
    setSelectedFilter(filter);
    setFilterStrength(strength);
    
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
          transformationType: 'filter',
          faceFilter: filter,
          filterStrength: strength,
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

  const handleLipColorSelect = useCallback(async (lipColor: LipColorRGBA) => {
    setSelectedLipColor(lipColor);
    
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
          transformationType: 'lip-color',
          lipColor: lipColor,
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
    setTransformationType(null);
    setSelectedAge(null);
    setSelectedGender(null);
    setSelectedFilter(null);
    setFilterStrength(0.7);
    setSelectedLipColor(null);
    setError(null);
    setStep('upload');
  }, []);

  const handleTryAnother = useCallback(() => {
    setTransformedImage(null);
    setSelectedAge(null);
    setSelectedGender(null);
    setSelectedFilter(null);
    setFilterStrength(0.7);
    setSelectedLipColor(null);
    setError(null);
    setStep('select-type');
  }, []);

  const handleGoBack = useCallback(() => {
    if (step === 'select-type') {
      setStep('upload');
      setOriginalImage(null);
      setTransformationType(null);
    } else if (step === 'select-age' || step === 'select-gender' || step === 'select-filter' || step === 'select-lip-color') {
      setStep('select-type');
      setSelectedAge(null);
      setSelectedGender(null);
      setSelectedFilter(null);
      setSelectedLipColor(null);
    } else if (step === 'error') {
      if (transformationType) {
        if (transformationType === 'age') {
          setStep('select-age');
        } else if (transformationType === 'gender') {
          setStep('select-gender');
        } else if (transformationType === 'filter') {
          setStep('select-filter');
        } else if (transformationType === 'lip-color') {
          setStep('select-lip-color');
        }
      } else if (originalImage) {
        setStep('select-type');
      } else {
        setStep('upload');
      }
    }
  }, [step, originalImage, transformationType]);

  const handleRetry = useCallback(() => {
    if (transformationType === 'age' && selectedAge && originalImage) {
      handleAgeSelect(selectedAge);
    } else if (transformationType === 'gender' && selectedGender && originalImage) {
      handleGenderSelect(selectedGender);
    } else if (transformationType === 'filter' && selectedFilter && originalImage) {
      handleFilterSelect(selectedFilter, filterStrength);
    } else if (transformationType === 'lip-color' && selectedLipColor && originalImage) {
      handleLipColorSelect(selectedLipColor);
    } else {
      handleGoBack();
    }
  }, [transformationType, selectedAge, selectedGender, selectedFilter, filterStrength, selectedLipColor, originalImage, handleAgeSelect, handleGenderSelect, handleFilterSelect, handleLipColorSelect, handleGoBack]);

  const getStepTitle = () => {
    switch (step) {
      case 'upload':
        return 'Upload Your Photo';
      case 'select-type':
        return 'Select Transformation';
      case 'select-age':
        return 'Select Age';
      case 'select-gender':
        return 'Select Gender';
      case 'select-filter':
        return 'Select Filter';
      case 'select-lip-color':
        return 'Select Lip Color';
      case 'processing':
        return 'Processing';
      case 'result':
        if (transformationType === 'age' && selectedAge) {
          const category = AGE_CATEGORIES.find((c) => c.id === selectedAge);
          return `Your ${category?.label} Look`;
        } else if (transformationType === 'gender' && selectedGender) {
          const genderOption = GENDER_OPTIONS.find((g) => g.id === selectedGender);
          return `Your ${genderOption?.label} Look`;
        } else if (transformationType === 'filter' && selectedFilter) {
          const filter = FACE_FILTERS.find((f) => f.id === selectedFilter);
          return `${filter?.label} Filter Applied`;
        } else if (transformationType === 'lip-color') {
          return 'Your New Lip Color';
        }
        return 'Your Transformation';
      case 'error':
        return 'Error';
      default:
        return '';
    }
  };

  const getResultLabel = () => {
    if (transformationType === 'age' && selectedAge) {
      return AGE_CATEGORIES.find((c) => c.id === selectedAge)?.label || 'Transformed';
    } else if (transformationType === 'gender' && selectedGender) {
      return GENDER_OPTIONS.find((g) => g.id === selectedGender)?.label || 'Transformed';
    } else if (transformationType === 'filter' && selectedFilter) {
      const filter = FACE_FILTERS.find((f) => f.id === selectedFilter);
      return filter?.label || 'Filtered';
    } else if (transformationType === 'lip-color') {
      return 'Lip Color';
    }
    return 'Transformed';
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="sticky top-16 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            {(step === 'select-type' || step === 'select-age' || step === 'select-gender' || step === 'select-filter' || step === 'select-lip-color' || step === 'error') && (
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
                  {step === 'select-type' && 'Choose transformation type'}
                  {step === 'select-age' && 'Choose your desired age'}
                  {step === 'select-gender' && 'Choose your desired gender'}
                  {step === 'select-filter' && 'Select and adjust filter'}
                  {step === 'select-lip-color' && 'Choose your perfect lip color'}
                  {step === 'result' && 'Your transformation is ready!'}
                </p>
              )}
            </div>
          </div>

          {/* Progress indicator */}
          <div className="flex gap-2 mt-4">
            {['upload', 'select-type', 'select-age', 'result'].map((s, index) => (
              <div
                key={s}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  ['upload', 'select-type', 'select-age', 'select-gender', 'select-filter', 'processing', 'result'].indexOf(step) >= index
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

          {/* Type Selection Step */}
          {step === 'select-type' && originalImage && (
            <motion.div
              key="select-type"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <TransformationTypeSelector onTypeSelect={handleTypeSelect} />
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

          {/* Gender Selection Step */}
          {step === 'select-gender' && originalImage && (
            <motion.div
              key="select-gender"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <GenderSelector onGenderSelect={handleGenderSelect} />
            </motion.div>
          )}

          {/* Face Filter Selection Step */}
          {step === 'select-filter' && originalImage && (
            <motion.div
              key="select-filter"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <FaceFilterSelector onFilterSelect={handleFilterSelect} />
            </motion.div>
          )}

          {/* Lip Color Selection Step */}
          {step === 'select-lip-color' && originalImage && (
            <motion.div
              key="select-lip-color"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <LipColorSelector onColorSelect={handleLipColorSelect} />
            </motion.div>
          )}

          {/* Processing Step */}
          {step === 'processing' && (selectedAge || selectedGender || selectedFilter || selectedLipColor) && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <LoadingAnimation 
                ageCategory={selectedAge || undefined} 
              />
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
                transformedLabel={getResultLabel()}
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
    </ProtectedRoute>
  );
}
