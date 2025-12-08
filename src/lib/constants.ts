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
  { id: 'white-tea', label: 'White Tea', description: 'Soft and natural look', resourceType: '10001', category: 'natural', previewUrl: '/pic/ResultImage-1-10001-1.webp' },
  { id: 'fair-skin', label: 'Fair Skin', description: 'Bright and fair complexion', resourceType: '10002', category: 'natural', previewUrl: '/pic/ResultImage-1-10002-1.webp' },
  { id: 'natural', label: 'Natural', description: 'Pure natural enhancement', resourceType: '10015', category: 'natural', previewUrl: '/pic/ResultImage-1-10015-1.webp' },
  { id: 'clarity', label: 'Clarity', description: 'Clear and crisp look', resourceType: '10008', category: 'natural', previewUrl: '/pic/ResultImage-1-10008-1.webp' },
  { id: 'crystal-clear', label: 'Crystal Clear', description: 'Ultra clear appearance', resourceType: '10009', category: 'natural', previewUrl: '/pic/ResultImage-1-10009-1.webp' },
  { id: 'photo', label: 'Photo', description: 'Professional photo finish', resourceType: '10021', category: 'natural', previewUrl: '/pic/ResultImage-1-10021-1.webp' },
  { id: 'hazy', label: 'Hazy', description: 'Soft hazy ambiance', resourceType: '10032', category: 'natural', previewUrl: '/pic/ResultImage-1-10032-1.webp' },
  { id: 'beauty', label: 'Beauty', description: 'Enhanced beauty look', resourceType: '10039', category: 'natural', previewUrl: '/pic/ResultImage-1-10039-1.webp' },
  
  // Vintage Filters
  { id: 'tokyo', label: 'Tokyo', description: 'Japanese vintage style', resourceType: '10004', category: 'vintage', previewUrl: '/pic/ResultImage-1-10004-1.webp' },
  { id: 'muted-gray', label: 'Muted Gray', description: 'Subtle gray tones', resourceType: '10013', category: 'vintage', previewUrl: '/pic/ResultImage-1-10013-1.webp' },
  { id: 'black-white', label: 'Black & White', description: 'Classic monochrome', resourceType: '10017', category: 'vintage', previewUrl: '/pic/ResultImage-1-10017-1.webp' },
  { id: 'winter', label: 'Winter', description: 'Cool winter vibes', resourceType: '10020', category: 'vintage', previewUrl: '/pic/ResultImage-1-10020-1.webp' },
  { id: 'afternoon', label: 'Afternoon', description: 'Warm afternoon glow', resourceType: '10030', category: 'vintage', previewUrl: '/pic/ResultImage-1-10030-1.webp' },
  { id: 'coffee', label: 'Coffee', description: 'Rich coffee tones', resourceType: '10040', category: 'vintage', previewUrl: '/pic/ResultImage-1-10040-1.webp' },
  
  // Vibrant Filters
  { id: 'early-summer', label: 'Early Summer', description: 'Fresh summer vibes', resourceType: '10003', category: 'vibrant', previewUrl: '/pic/ResultImage-1-10003-1.webp' },
  { id: 'warm-sunshine', label: 'Warm Sunshine', description: 'Sunny and warm', resourceType: '10006', category: 'vibrant', previewUrl: '/pic/ResultImage-1-10006-1.webp' },
  { id: 'rose', label: 'Rose', description: 'Romantic rose tones', resourceType: '10007', category: 'vibrant', previewUrl: '/pic/ResultImage-1-10007-1.webp' },
  { id: 'sweet-mint', label: 'Sweet Mint', description: 'Fresh mint colors', resourceType: '10010', category: 'vibrant', previewUrl: '/pic/ResultImage-1-10010-1.webp' },
  { id: 'cherry-pudding', label: 'Cherry Pudding', description: 'Sweet pink tones', resourceType: '10014', category: 'vibrant', previewUrl: '/pic/ResultImage-1-10014-1.webp' },
  { id: 'fruit', label: 'Fruit', description: 'Fruity fresh colors', resourceType: '10018', category: 'vibrant', previewUrl: '/pic/ResultImage-1-10018-1.webp' },
  { id: 'love', label: 'Love', description: 'Romantic pink hues', resourceType: '10019', category: 'vibrant', previewUrl: '/pic/ResultImage-1-10019-1.webp' },
  { id: 'summer', label: 'Summer', description: 'Bright summer colors', resourceType: '10022', category: 'vibrant', previewUrl: '/pic/ResultImage-1-10022-1.webp' },
  { id: 'fragrance', label: 'Fragrance', description: 'Delicate floral tones', resourceType: '10023', category: 'vibrant', previewUrl: '/pic/ResultImage-1-10023-1.webp' },
  { id: 'charm', label: 'Charm', description: 'Charming vibrant look', resourceType: '10024', category: 'vibrant', previewUrl: '/pic/ResultImage-1-10024-1.webp' },
  { id: 'throb', label: 'Throb', description: 'Dynamic vibrant energy', resourceType: '10025', category: 'vibrant', previewUrl: '/pic/ResultImage-1-10025-1.webp' },
  { id: 'beach', label: 'Beach', description: 'Sunny beach atmosphere', resourceType: '10026', category: 'vibrant', previewUrl: '/pic/ResultImage-1-10026-1.webp' },
  { id: 'sweet', label: 'Sweet', description: 'Sweet pastel colors', resourceType: '10028', category: 'vibrant', previewUrl: '/pic/ResultImage-1-10028-1.webp' },
  { id: 'first-kiss', label: 'First Kiss', description: 'Romantic soft pink', resourceType: '10029', category: 'vibrant', previewUrl: '/pic/ResultImage-1-10029-1.webp' },
  { id: 'vitality', label: 'Vitality', description: 'Energetic bright tones', resourceType: '10031', category: 'vibrant', previewUrl: '/pic/ResultImage-1-10031-1.webp' },
  { id: 'joyful', label: 'Joyful', description: 'Happy cheerful colors', resourceType: '10033', category: 'vibrant', previewUrl: '/pic/ResultImage-1-10033-1.webp' },
  { id: 'bubbles', label: 'Bubbles', description: 'Bubbly light tones', resourceType: '10035', category: 'vibrant', previewUrl: '/pic/ResultImage-1-10035-1.webp' },
  { id: 'lemon', label: 'Lemon', description: 'Fresh lemon yellow', resourceType: '10036', category: 'vibrant', previewUrl: '/pic/ResultImage-1-10036-1.webp' },
  { id: 'cotton-candy', label: 'Cotton Candy', description: 'Sweet cotton candy pink', resourceType: '10037', category: 'vibrant', previewUrl: '/pic/ResultImage-1-10037-1.webp' },
  { id: 'brook', label: 'Brook', description: 'Clear flowing water', resourceType: '10038', category: 'vibrant', previewUrl: '/pic/ResultImage-1-10038-1.webp' },
  
  // Artistic Filters
  { id: 'confession', label: 'Confession', description: 'Dreamy artistic look', resourceType: '10005', category: 'artistic', previewUrl: '/pic/ResultImage-1-10005-1.webp' },
  { id: 'elegance', label: 'Elegance', description: 'Elegant and refined', resourceType: '10016', category: 'artistic', previewUrl: '/pic/ResultImage-1-10016-1.webp' },
  { id: 'basic', label: 'Basic', description: 'Simple artistic touch', resourceType: '10011', category: 'artistic', previewUrl: '/pic/ResultImage-1-10011-1.webp' },
  { id: 'heartbeat', label: 'Heartbeat', description: 'Emotional and vivid', resourceType: '10012', category: 'artistic', previewUrl: '/pic/ResultImage-1-10012-1.webp' },
  { id: 'street-snap', label: 'Street Snap', description: 'Urban street style', resourceType: '10027', category: 'artistic', previewUrl: '/pic/ResultImage-1-10027-1.webp' },
  { id: 'fashion', label: 'Fashion', description: 'Trendy fashion look', resourceType: '10034', category: 'artistic', previewUrl: '/pic/ResultImage-1-10034-1.webp' },
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
  description: 'Professional AI-powered photo editing suite. Transform your appearance with age modification, gender swap, 40+ beauty filters, virtual try-on, and creative effects.',
};
