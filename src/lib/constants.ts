import { AgeCategoryOption } from '@/types';

export const AGE_CATEGORIES: AgeCategoryOption[] = [
  {
    id: 'baby',
    label: 'Baby',
    description: 'Transform to infant look',
    ageRange: '0-2 years',
    icon: '👶',
    prompt: 'Transform this person to look like a baby, approximately 1-2 years old. Keep facial features recognizable but make them appear as an adorable infant with baby-like proportions, soft skin, and innocent expression.',
  },
  {
    id: 'young',
    label: 'Young',
    description: 'Transform to young adult',
    ageRange: '18-25 years',
    icon: '🧑',
    prompt: 'Transform this person to look like a young adult, approximately 18-25 years old. Show youthful skin, energetic appearance, and vibrant features while maintaining recognizable facial characteristics.',
  },
  {
    id: 'adult',
    label: 'Adult',
    description: 'Transform to middle-aged',
    ageRange: '35-45 years',
    icon: '👨',
    prompt: 'Transform this person to look like a mature adult, approximately 35-45 years old. Show subtle signs of maturity, confident appearance, and refined features while maintaining recognizable facial characteristics.',
  },
  {
    id: 'old',
    label: 'Old',
    description: 'Transform to senior look',
    ageRange: '60-70 years',
    icon: '👴',
    prompt: 'Transform this person to look like a senior, approximately 60-70 years old. Show natural aging signs like wrinkles, gray hair, and wisdom in expression while maintaining recognizable facial characteristics.',
  },
  {
    id: 'elderly',
    label: 'Elderly',
    description: 'Transform to very aged look',
    ageRange: '80+ years',
    icon: '🧓',
    prompt: 'Transform this person to look very elderly, approximately 80+ years old. Show pronounced aging features like deep wrinkles, white hair, aged skin texture, and wise expression while maintaining recognizable facial characteristics.',
  },
];

export const ACCEPTED_IMAGE_TYPES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
};

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export const APP_CONFIG = {
  name: 'AgeFX',
  tagline: 'See yourself at any age with AI',
  description: 'Transform your photos with AI-powered age modification. See how you look as a baby, young adult, or elderly person.',
};
