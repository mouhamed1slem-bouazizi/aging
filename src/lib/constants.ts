import { AgeCategoryOption, GenderOptionData, FaceFilterOption } from '@/types';

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

export const FACE_FILTERS: FaceFilterOption[] = [
  // Natural Filters
  { id: 'white-tea', label: 'White Tea', description: 'Soft and natural look', resourceType: '10001', category: 'natural' },
  { id: 'fair-skin', label: 'Fair Skin', description: 'Bright and fair complexion', resourceType: '10002', category: 'natural' },
  { id: 'natural', label: 'Natural', description: 'Pure natural enhancement', resourceType: '10015', category: 'natural' },
  { id: 'clarity', label: 'Clarity', description: 'Clear and crisp look', resourceType: '10008', category: 'natural' },
  { id: 'crystal-clear', label: 'Crystal Clear', description: 'Ultra clear appearance', resourceType: '10009', category: 'natural' },
  
  // Vintage Filters
  { id: 'tokyo', label: 'Tokyo', description: 'Japanese vintage style', resourceType: '10004', category: 'vintage' },
  { id: 'muted-gray', label: 'Muted Gray', description: 'Subtle gray tones', resourceType: '10013', category: 'vintage' },
  { id: 'black-white', label: 'Black & White', description: 'Classic monochrome', resourceType: '10017', category: 'vintage' },
  { id: 'winter', label: 'Winter', description: 'Cool winter vibes', resourceType: '10020', category: 'vintage' },
  
  // Vibrant Filters
  { id: 'early-summer', label: 'Early Summer', description: 'Fresh summer vibes', resourceType: '10003', category: 'vibrant' },
  { id: 'warm-sunshine', label: 'Warm Sunshine', description: 'Sunny and warm', resourceType: '10006', category: 'vibrant' },
  { id: 'rose', label: 'Rose', description: 'Romantic rose tones', resourceType: '10007', category: 'vibrant' },
  { id: 'sweet-mint', label: 'Sweet Mint', description: 'Fresh mint colors', resourceType: '10010', category: 'vibrant' },
  { id: 'cherry-pudding', label: 'Cherry Pudding', description: 'Sweet pink tones', resourceType: '10014', category: 'vibrant' },
  { id: 'fruit', label: 'Fruit', description: 'Fruity fresh colors', resourceType: '10018', category: 'vibrant' },
  { id: 'love', label: 'Love', description: 'Romantic pink hues', resourceType: '10019', category: 'vibrant' },
  
  // Artistic Filters
  { id: 'confession', label: 'Confession', description: 'Dreamy artistic look', resourceType: '10005', category: 'artistic' },
  { id: 'elegance', label: 'Elegance', description: 'Elegant and refined', resourceType: '10016', category: 'artistic' },
  { id: 'basic', label: 'Basic', description: 'Simple artistic touch', resourceType: '10011', category: 'artistic' },
  { id: 'heartbeat', label: 'Heartbeat', description: 'Emotional and vivid', resourceType: '10012', category: 'artistic' },
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
