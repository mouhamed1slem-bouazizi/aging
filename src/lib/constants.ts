import { AgeCategoryOption, GenderOptionData } from '@/types';

// AILabAPI endpoint for face attribute editing (direct, not through RapidAPI)
export const AILAB_API_URL = 'https://www.ailabapi.com/api/portrait/effects/face-attribute-editing';

export const AGE_CATEGORIES: AgeCategoryOption[] = [
  {
    id: 'baby',
    label: 'Baby',
    description: 'Transform to infant look',
    ageRange: '1-3 years',
    icon: '👶',
    targetAge: 2,
  },
  {
    id: 'child',
    label: 'Child',
    description: 'Transform to child look',
    ageRange: '8-12 years',
    icon: '🧒',
    targetAge: 10,
  },
  {
    id: 'young',
    label: 'Young Adult',
    description: 'Transform to young adult',
    ageRange: '20-25 years',
    icon: '🧑',
    targetAge: 22,
  },
  {
    id: 'adult',
    label: 'Adult',
    description: 'Transform to middle-aged',
    ageRange: '40-50 years',
    icon: '👨',
    targetAge: 45,
  },
  {
    id: 'old',
    label: 'Senior',
    description: 'Transform to senior look',
    ageRange: '60-70 years',
    icon: '👴',
    targetAge: 65,
  },
  {
    id: 'elderly',
    label: 'Elderly',
    description: 'Transform to elderly look',
    ageRange: '80+ years',
    icon: '🧓',
    targetAge: 80,
  },
];

export const GENDER_OPTIONS: GenderOptionData[] = [
  {
    id: 'male',
    label: 'Male',
    description: 'Transform to male appearance',
    icon: '👨',
    targetValue: 0,
  },
  {
    id: 'female',
    label: 'Female',
    description: 'Transform to female appearance',
    icon: '👩',
    targetValue: 1,
  },
];

export const ACCEPTED_IMAGE_TYPES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/bmp': ['.bmp'],
};

export const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB (RapidAPI limit)

export const APP_CONFIG = {
  name: 'AI Portrait Studio',
  tagline: 'Transform Your Photos with AI Magic',
  description: 'Professional AI-powered photo editing suite. Transform your appearance with age modification, gender swap, beauty filters, virtual try-on, and 20+ creative effects.',
};
