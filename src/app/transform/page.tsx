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
  FaceBeautySelector,
  FaceSlimmingSelector,
  SkinBeautySelector,
  FaceFusionSelector,
  SmartBeautySelector,
  HairstyleSelector,
  ExpressionSelector,
  CartoonSelector,
  TransformationTypeSelector,
  LoadingAnimation,
  ImageComparison,
  ResultActions,
  ErrorDisplay,
  ProtectedRoute,
} from '@/components';
import { AgeCategory, GenderOption, FaceFilterType, TransformationType, TransformResponse, LipColorRGBA, FaceBeautyParams, FaceSlimmingParams, SkinBeautyParams, FaceFusionParams, SmartBeautyParams, HairstyleParams, ExpressionParams, CartoonParams } from '@/types';
import { AGE_CATEGORIES, GENDER_OPTIONS, FACE_FILTERS } from '@/lib/constants';
import { compressImage } from '@/lib/utils';

type Step = 'upload' | 'select-type' | 'select-age' | 'select-gender' | 'select-filter' | 'select-lip-color' | 'select-beauty' | 'select-slimming' | 'select-skin' | 'select-fusion' | 'select-smart-beauty' | 'select-hairstyle' | 'select-expression' | 'select-cartoon' | 'processing' | 'result' | 'error';

export default function TransformPage() {
  const [step, setStep] = useState<Step>('select-type');
  const [showCamera, setShowCamera] = useState(false);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [transformedImage, setTransformedImage] = useState<string | null>(null);
  const [transformationType, setTransformationType] = useState<TransformationType | null>(null);
  const [selectedAge, setSelectedAge] = useState<AgeCategory | null>(null);
  const [selectedGender, setSelectedGender] = useState<GenderOption | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<FaceFilterType | null>(null);
  const [filterStrength, setFilterStrength] = useState<number>(0.7);
  const [selectedLipColor, setSelectedLipColor] = useState<LipColorRGBA | null>(null);
  const [selectedBeauty, setSelectedBeauty] = useState<FaceBeautyParams | null>(null);
  const [selectedSlimming, setSelectedSlimming] = useState<FaceSlimmingParams | null>(null);
  const [selectedSkin, setSelectedSkin] = useState<SkinBeautyParams | null>(null);
  const [selectedFusion, setSelectedFusion] = useState<FaceFusionParams | null>(null);
  const [selectedSmartBeauty, setSelectedSmartBeauty] = useState<SmartBeautyParams | null>(null);
  const [selectedHairstyle, setSelectedHairstyle] = useState<HairstyleParams | null>(null);
  const [selectedExpression, setSelectedExpression] = useState<ExpressionParams | null>(null);
  const [selectedCartoon, setSelectedCartoon] = useState<CartoonParams | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = useCallback(async (imageSrc: string) => {
    try {
      // Compress image for faster processing (max 4MB for AILabAPI)
      const compressed = await compressImage(imageSrc, 1024, 0.85);
      setOriginalImage(compressed);
      setShowCamera(false);
      
      // For image enhancement or dehaze, process immediately without selection step
      if (transformationType === 'image-enhance' || transformationType === 'image-dehaze' || transformationType === 'photo-colorize' || transformationType === 'image-sharpen') {
        setStep('processing');
        setError(null);

        // Use setTimeout to allow React to render the processing animation first
        setTimeout(async () => {
          try {
            const response = await fetch('/api/transform', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                image: compressed,
                transformationType: transformationType,
              }),
            });

            const data: TransformResponse = await response.json();

            if (!data.success || !data.transformedImage) {
              throw new Error(data.error || 'Processing failed');
            }

            setTransformedImage(data.transformedImage);
            setStep('result');
          } catch (err) {
            console.error('Processing error:', err);
            setError(err instanceof Error ? err.message : 'Failed to process image');
            setStep('error');
          }
        }, 100); // Small delay to allow UI to render
        return;
      }
      
      // After image upload, proceed to the specific transformation step
      if (transformationType === 'age') {
        setStep('select-age');
      } else if (transformationType === 'gender') {
        setStep('select-gender');
      } else if (transformationType === 'filter') {
        setStep('select-filter');
      } else if (transformationType === 'lip-color') {
        setStep('select-lip-color');
      } else if (transformationType === 'face-beauty') {
        setStep('select-beauty');
      } else if (transformationType === 'face-slimming') {
        setStep('select-slimming');
      } else if (transformationType === 'skin-beauty') {
        setStep('select-skin');
      } else if (transformationType === 'face-fusion') {
        setStep('select-fusion');
      } else if (transformationType === 'smart-beauty') {
        setStep('select-smart-beauty');
      } else if (transformationType === 'hairstyle') {
        setStep('select-hairstyle');
      } else if (transformationType === 'expression') {
        setStep('select-expression');
      } else if (transformationType === 'cartoon') {
        setStep('select-cartoon');
      }
    } catch (err) {
      console.error('Image compression error:', err);
      setOriginalImage(imageSrc);
      setShowCamera(false);
      
      // For image enhancement or dehaze, process immediately even with uncompressed image
      if (transformationType === 'image-enhance' || transformationType === 'image-dehaze' || transformationType === 'photo-colorize' || transformationType === 'image-sharpen') {
        setStep('processing');
        setError(null);

        // Use setTimeout to allow React to render the processing animation first
        setTimeout(async () => {
          try {
            const response = await fetch('/api/transform', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                image: imageSrc,
                transformationType: transformationType,
              }),
            });

            const data: TransformResponse = await response.json();

            if (!data.success || !data.transformedImage) {
              throw new Error(data.error || 'Processing failed');
            }

            setTransformedImage(data.transformedImage);
            setStep('result');
          } catch (enhanceErr) {
            console.error('Processing error:', enhanceErr);
            setError(enhanceErr instanceof Error ? enhanceErr.message : 'Failed to process image');
            setStep('error');
          }
        }, 100); // Small delay to allow UI to render
        return;
      }
      
      // After image upload, proceed to the specific transformation step
      if (transformationType === 'age') {
        setStep('select-age');
      } else if (transformationType === 'gender') {
        setStep('select-gender');
      } else if (transformationType === 'filter') {
        setStep('select-filter');
      } else if (transformationType === 'lip-color') {
        setStep('select-lip-color');
      } else if (transformationType === 'face-beauty') {
        setStep('select-beauty');
      } else if (transformationType === 'face-slimming') {
        setStep('select-slimming');
      } else if (transformationType === 'skin-beauty') {
        setStep('select-skin');
      } else if (transformationType === 'face-fusion') {
        setStep('select-fusion');
      } else if (transformationType === 'smart-beauty') {
        setStep('select-smart-beauty');
      } else if (transformationType === 'hairstyle') {
        setStep('select-hairstyle');
      } else if (transformationType === 'expression') {
        setStep('select-expression');
      } else if (transformationType === 'cartoon') {
        setStep('select-cartoon');
      }
    }
  }, [transformationType]);

  const handleTypeSelect = useCallback((type: TransformationType) => {
    setTransformationType(type);
    // After selecting type, go to upload step
    setStep('upload');
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

  const handleBeautySelect = useCallback(async (beautyParams: FaceBeautyParams) => {
    setSelectedBeauty(beautyParams);
    
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
          transformationType: 'face-beauty',
          faceBeauty: beautyParams,
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

  const handleSlimmingSelect = useCallback(async (slimmingParams: FaceSlimmingParams) => {
    setSelectedSlimming(slimmingParams);
    
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
          transformationType: 'face-slimming',
          faceSlimming: slimmingParams,
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

  const handleSkinSelect = useCallback(async (skinParams: SkinBeautyParams) => {
    setSelectedSkin(skinParams);
    
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
          transformationType: 'skin-beauty',
          skinBeauty: skinParams,
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

  const handleFusionSelect = useCallback(async (fusionParams: FaceFusionParams) => {
    setSelectedFusion(fusionParams);
    
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
          transformationType: 'face-fusion',
          faceFusion: fusionParams,
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

  const handleSmartBeautySelect = useCallback(async (smartBeautyParams: SmartBeautyParams) => {
    setSelectedSmartBeauty(smartBeautyParams);
    
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
          transformationType: 'smart-beauty',
          smartBeauty: smartBeautyParams,
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

  const handleHairstyleSelect = useCallback(async (hairstyleParams: HairstyleParams) => {
    setSelectedHairstyle(hairstyleParams);
    
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
          transformationType: 'hairstyle',
          hairstyle: hairstyleParams,
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

  const handleExpressionSelect = useCallback(async (expressionParams: ExpressionParams) => {
    setSelectedExpression(expressionParams);
    
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
          transformationType: 'expression',
          expression: expressionParams,
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

  const handleCartoonSelect = useCallback(async (cartoonParams: CartoonParams) => {
    setSelectedCartoon(cartoonParams);
    
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
          transformationType: 'cartoon',
          cartoon: cartoonParams,
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
    setSelectedBeauty(null);
    setSelectedSlimming(null);
    setSelectedSkin(null);
    setSelectedFusion(null);
    setSelectedSmartBeauty(null);
    setSelectedHairstyle(null);
    setSelectedExpression(null);
    setSelectedCartoon(null);
    setError(null);
    setStep('select-type');
  }, []);

  const handleTryAnother = useCallback(() => {
    setTransformedImage(null);
    setSelectedAge(null);
    setSelectedGender(null);
    setSelectedFilter(null);
    setFilterStrength(0.7);
    setSelectedLipColor(null);
    setSelectedBeauty(null);
    setSelectedSlimming(null);
    setSelectedSkin(null);
    setSelectedFusion(null);
    setSelectedSmartBeauty(null);
    setSelectedHairstyle(null);
    setSelectedExpression(null);
    setSelectedCartoon(null);
    setError(null);
    setStep('select-type');
  }, []);

  const handleGoBack = useCallback(() => {
    if (step === 'upload') {
      setStep('select-type');
      setOriginalImage(null);
    } else if (step === 'select-age' || step === 'select-gender' || step === 'select-filter' || step === 'select-lip-color' || step === 'select-beauty' || step === 'select-slimming' || step === 'select-skin' || step === 'select-fusion' || step === 'select-smart-beauty' || step === 'select-hairstyle' || step === 'select-expression' || step === 'select-cartoon') {
      setStep('upload');
      setSelectedAge(null);
      setSelectedGender(null);
      setSelectedFilter(null);
      setSelectedLipColor(null);
      setSelectedBeauty(null);
      setSelectedSlimming(null);
      setSelectedSkin(null);
      setSelectedFusion(null);
      setSelectedSmartBeauty(null);
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
        } else if (transformationType === 'face-beauty') {
          setStep('select-beauty');
        } else if (transformationType === 'face-slimming') {
          setStep('select-slimming');
        } else if (transformationType === 'skin-beauty') {
          setStep('select-skin');
        } else if (transformationType === 'face-fusion') {
          setStep('select-fusion');
        } else if (transformationType === 'smart-beauty') {
          setStep('select-smart-beauty');
        }
      } else if (originalImage) {
        setStep('upload');
      } else {
        setStep('select-type');
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
    } else if (transformationType === 'face-beauty' && selectedBeauty && originalImage) {
      handleBeautySelect(selectedBeauty);
    } else if (transformationType === 'face-slimming' && selectedSlimming && originalImage) {
      handleSlimmingSelect(selectedSlimming);
    } else if (transformationType === 'skin-beauty' && selectedSkin && originalImage) {
      handleSkinSelect(selectedSkin);
    } else if (transformationType === 'face-fusion' && selectedFusion && originalImage) {
      handleFusionSelect(selectedFusion);
    } else if (transformationType === 'smart-beauty' && selectedSmartBeauty && originalImage) {
      handleSmartBeautySelect(selectedSmartBeauty);
    } else if (transformationType === 'hairstyle' && selectedHairstyle && originalImage) {
      handleHairstyleSelect(selectedHairstyle);
    } else if (transformationType === 'expression' && selectedExpression && originalImage) {
      handleExpressionSelect(selectedExpression);
    } else if (transformationType === 'cartoon' && selectedCartoon && originalImage) {
      handleCartoonSelect(selectedCartoon);
    } else {
      handleGoBack();
    }
  }, [transformationType, selectedAge, selectedGender, selectedFilter, filterStrength, selectedLipColor, selectedBeauty, selectedSlimming, selectedSkin, selectedFusion, selectedSmartBeauty, selectedHairstyle, selectedExpression, selectedCartoon, originalImage, handleAgeSelect, handleGenderSelect, handleFilterSelect, handleLipColorSelect, handleBeautySelect, handleSlimmingSelect, handleSkinSelect, handleFusionSelect, handleSmartBeautySelect, handleHairstyleSelect, handleExpressionSelect, handleCartoonSelect, handleGoBack]);

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
      case 'select-beauty':
        return 'Face Beauty Enhancement';
      case 'select-slimming':
        return 'Face Slimming';
      case 'select-skin':
        return 'Skin Beauty Enhancement';
      case 'select-fusion':
        return 'Merge Portraits';
      case 'select-smart-beauty':
        return 'Smart Beauty';
      case 'select-hairstyle':
        return 'Choose Hairstyle';
      case 'select-expression':
        return 'Change Expression';
      case 'select-cartoon':
        return 'Cartoon Yourself';
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
        } else if (transformationType === 'face-beauty') {
          return 'Your Enhanced Beauty';
        } else if (transformationType === 'face-slimming') {
          return 'Your Slimmed Face';
        } else if (transformationType === 'skin-beauty') {
          return 'Your Beautiful Skin';
        } else if (transformationType === 'face-fusion') {
          return 'Your Merged Portrait';
        } else if (transformationType === 'smart-beauty') {
          return 'Your Smart Beauty Result';
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
    } else if (transformationType === 'face-beauty') {
      return 'Face Beauty';
    } else if (transformationType === 'face-slimming') {
      return 'Face Slimming';
    } else if (transformationType === 'skin-beauty') {
      return 'Skin Beauty';
    } else if (transformationType === 'face-fusion') {
      return 'Merged Portrait';
    } else if (transformationType === 'smart-beauty') {
      return 'Smart Beauty';
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
            {(step === 'upload' || step === 'select-age' || step === 'select-gender' || step === 'select-filter' || step === 'select-lip-color' || step === 'select-beauty' || step === 'select-slimming' || step === 'select-skin' || step === 'select-fusion' || step === 'select-smart-beauty' || step === 'select-hairstyle' || step === 'select-expression' || step === 'select-cartoon' || step === 'error') && (
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
                  {step === 'select-type' && 'Choose your transformation type first'}
                  {step === 'upload' && 'Take a selfie or upload a photo'}
                  {step === 'select-age' && 'Choose your desired age'}
                  {step === 'select-gender' && 'Choose your desired gender'}
                  {step === 'select-filter' && 'Select and adjust filter'}
                  {step === 'select-lip-color' && 'Choose your perfect lip color'}
                  {step === 'select-beauty' && 'Adjust beauty enhancement levels'}
                  {step === 'select-slimming' && 'Adjust face slimming intensity'}
                  {step === 'select-skin' && 'Adjust skin smoothing and whitening'}
                  {step === 'select-fusion' && 'Upload template and adjust similarity'}
                  {step === 'select-smart-beauty' && 'Adjust AI beauty enhancement'}
                  {step === 'select-hairstyle' && 'Choose your perfect hairstyle and color'}
                  {step === 'select-expression' && 'Select your desired facial expression'}
                  {step === 'select-cartoon' && 'Choose your favorite cartoon style'}
                  {step === 'result' && 'Your transformation is ready!'}
                </p>
              )}
            </div>
          </div>

          {/* Progress indicator */}
          <div className="flex gap-2 mt-4">
            {['select-type', 'upload', 'select-age', 'result'].map((s, index) => (
              <div
                key={s}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  ['select-type', 'upload', 'select-age', 'select-gender', 'select-filter', 'select-lip-color', 'select-beauty', 'select-slimming', 'select-skin', 'processing', 'result'].indexOf(step) >= index
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
          {/* Type Selection Step - Now First */}
          {step === 'select-type' && (
            <motion.div
              key="select-type"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <TransformationTypeSelector onTypeSelect={handleTypeSelect} />
            </motion.div>
          )}

          {/* Upload Step - Now Second */}
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

          {/* Face Beauty Selection Step */}
          {step === 'select-beauty' && originalImage && (
            <motion.div
              key="select-beauty"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <FaceBeautySelector onBeautySelect={handleBeautySelect} />
            </motion.div>
          )}

          {/* Face Slimming Selection Step */}
          {step === 'select-slimming' && originalImage && (
            <motion.div
              key="select-slimming"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <FaceSlimmingSelector onSlimmingSelect={handleSlimmingSelect} />
            </motion.div>
          )}

          {/* Skin Beauty Selection Step */}
          {step === 'select-skin' && originalImage && (
            <motion.div
              key="select-skin"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <SkinBeautySelector onSkinSelect={handleSkinSelect} />
            </motion.div>
          )}

          {/* Face Fusion Selection Step */}
          {step === 'select-fusion' && originalImage && (
            <motion.div
              key="select-fusion"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <FaceFusionSelector onFusionSelect={handleFusionSelect} />
            </motion.div>
          )}

          {/* Smart Beauty Selection Step */}
          {step === 'select-smart-beauty' && originalImage && (
            <motion.div
              key="select-smart-beauty"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <SmartBeautySelector onBeautySelect={handleSmartBeautySelect} />
            </motion.div>
          )}

          {/* Hairstyle Selection Step */}
          {step === 'select-hairstyle' && originalImage && (
            <motion.div
              key="select-hairstyle"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <HairstyleSelector onHairstyleSelect={handleHairstyleSelect} />
            </motion.div>
          )}

          {/* Expression Selection Step */}
          {step === 'select-expression' && originalImage && (
            <motion.div
              key="select-expression"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <ExpressionSelector onExpressionSelect={handleExpressionSelect} />
            </motion.div>
          )}

          {/* Cartoon Selection Step */}
          {step === 'select-cartoon' && originalImage && (
            <motion.div
              key="select-cartoon"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <CartoonSelector onCartoonSelect={handleCartoonSelect} />
            </motion.div>
          )}

          {/* Processing Step */}
          {step === 'processing' && (selectedAge || selectedGender || selectedFilter || selectedLipColor || selectedBeauty || selectedSlimming || selectedSkin || selectedFusion || selectedSmartBeauty || selectedHairstyle || selectedExpression || selectedCartoon || transformationType === 'image-enhance' || transformationType === 'image-dehaze' || transformationType === 'photo-colorize' || transformationType === 'image-sharpen') && (
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
