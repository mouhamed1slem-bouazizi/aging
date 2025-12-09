import { AgeCategoryOption, GenderOptionData, FaceFilterOption, LipColorOption } from '@/types';

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

export const LIP_COLORS: LipColorOption[] = [
  // Natural Category
  { id: 'nude-pink', label: 'Nude Pink', description: 'Soft natural nude', rgba: { r: 207, g: 150, b: 150, a: 80 }, category: 'natural' },
  { id: 'rose-beige', label: 'Rose Beige', description: 'Elegant rose beige', rgba: { r: 198, g: 132, b: 130, a: 75 }, category: 'natural' },
  { id: 'soft-pink', label: 'Soft Pink', description: 'Delicate soft pink', rgba: { r: 255, g: 182, b: 193, a: 70 }, category: 'natural' },
  { id: 'peachy', label: 'Peachy', description: 'Warm peachy tone', rgba: { r: 255, g: 203, b: 164, a: 75 }, category: 'natural' },
  
  // Nude Category
  { id: 'bare-nude', label: 'Bare Nude', description: 'Barely there nude', rgba: { r: 190, g: 140, b: 135, a: 60 }, category: 'nude' },
  { id: 'mauve', label: 'Mauve', description: 'Dusty mauve', rgba: { r: 176, g: 124, b: 144, a: 70 }, category: 'nude' },
  { id: 'taupe', label: 'Taupe', description: 'Neutral taupe', rgba: { r: 162, g: 123, b: 128, a: 75 }, category: 'nude' },
  { id: 'mocha', label: 'Mocha', description: 'Rich mocha brown', rgba: { r: 156, g: 102, b: 98, a: 80 }, category: 'nude' },
  
  // Bold Category
  { id: 'classic-red', label: 'Classic Red', description: 'Timeless red', rgba: { r: 220, g: 20, b: 60, a: 100 }, category: 'bold' },
  { id: 'deep-red', label: 'Deep Red', description: 'Rich deep red', rgba: { r: 153, g: 0, b: 0, a: 100 }, category: 'bold' },
  { id: 'wine', label: 'Wine', description: 'Sophisticated wine', rgba: { r: 114, g: 47, b: 55, a: 95 }, category: 'bold' },
  { id: 'burgundy', label: 'Burgundy', description: 'Dark burgundy', rgba: { r: 128, g: 0, b: 32, a: 100 }, category: 'bold' },
  { id: 'plum', label: 'Plum', description: 'Deep plum purple', rgba: { r: 142, g: 69, b: 133, a: 90 }, category: 'bold' },
  
  // Vibrant Category
  { id: 'hot-pink', label: 'Hot Pink', description: 'Bold hot pink', rgba: { r: 246, g: 27, b: 91, a: 100 }, category: 'vibrant' },
  { id: 'fuchsia', label: 'Fuchsia', description: 'Bright fuchsia', rgba: { r: 255, g: 0, b: 255, a: 95 }, category: 'vibrant' },
  { id: 'coral', label: 'Coral', description: 'Vibrant coral', rgba: { r: 255, g: 127, b: 80, a: 90 }, category: 'vibrant' },
  { id: 'orange-red', label: 'Orange Red', description: 'Fiery orange-red', rgba: { r: 255, g: 69, b: 0, a: 95 }, category: 'vibrant' },
  { id: 'berry', label: 'Berry', description: 'Juicy berry', rgba: { r: 199, g: 21, b: 133, a: 90 }, category: 'vibrant' },
  { id: 'magenta', label: 'Magenta', description: 'Electric magenta', rgba: { r: 202, g: 31, b: 123, a: 100 }, category: 'vibrant' },
  { id: 'cherry', label: 'Cherry', description: 'Bright cherry red', rgba: { r: 222, g: 49, b: 99, a: 95 }, category: 'vibrant' },
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
  { id: 'tender-bud', label: 'Tender Bud', description: 'Delicate tender look', resourceType: '10041', category: 'natural', previewUrl: '/pic/ResultImage-1-10041-1.webp' },
  { id: 'white-tea-2', label: 'White Tea', description: 'Refined white tea tone', resourceType: '10045', category: 'natural', previewUrl: '/pic/ResultImage-1-10045-1.webp' },
  { id: 'fair', label: 'Fair', description: 'Fair and bright', resourceType: '10046', category: 'natural', previewUrl: '/pic/ResultImage-1-10046-1.webp' },
  { id: 'holy', label: 'Holy', description: 'Pure and holy glow', resourceType: '10047', category: 'natural', previewUrl: '/pic/ResultImage-1-10047-1.webp' },
  { id: 'clear', label: 'Clear', description: 'Crystal clear purity', resourceType: '10051', category: 'natural', previewUrl: '/pic/ResultImage-1-10051-1.webp' },
  { id: 'water-glow', label: 'Water Glow', description: 'Glowing water effect', resourceType: '10054', category: 'natural', previewUrl: '/pic/ResultImage-1-10054-1.webp' },
  
  // Vintage Filters
  { id: 'tokyo', label: 'Tokyo', description: 'Japanese vintage style', resourceType: '10004', category: 'vintage', previewUrl: '/pic/ResultImage-1-10004-1.webp' },
  { id: 'muted-gray', label: 'Muted Gray', description: 'Subtle gray tones', resourceType: '10013', category: 'vintage', previewUrl: '/pic/ResultImage-1-10013-1.webp' },
  { id: 'black-white', label: 'Black & White', description: 'Classic monochrome', resourceType: '10017', category: 'vintage', previewUrl: '/pic/ResultImage-1-10017-1.webp' },
  { id: 'winter', label: 'Winter', description: 'Cool winter vibes', resourceType: '10020', category: 'vintage', previewUrl: '/pic/ResultImage-1-10020-1.webp' },
  { id: 'afternoon', label: 'Afternoon', description: 'Warm afternoon glow', resourceType: '10030', category: 'vintage', previewUrl: '/pic/ResultImage-1-10030-1.webp' },
  { id: 'coffee', label: 'Coffee', description: 'Rich coffee tones', resourceType: '10040', category: 'vintage', previewUrl: '/pic/ResultImage-1-10040-1.webp' },
  { id: 'breakfast', label: 'Breakfast', description: 'Warm breakfast mood', resourceType: '10044', category: 'vintage', previewUrl: '/pic/ResultImage-1-10044-1.webp' },
  { id: 'milk-coffee', label: 'Milk Coffee', description: 'Creamy coffee blend', resourceType: '10050', category: 'vintage', previewUrl: '/pic/ResultImage-1-10050-1.webp' },
  { id: 'sunset', label: 'Sunset', description: 'Golden sunset glow', resourceType: '10053', category: 'vintage', previewUrl: '/pic/ResultImage-1-10053-1.webp' },
  { id: 'japanese-style', label: 'Japanese Style', description: 'Traditional Japanese aesthetic', resourceType: '10055', category: 'vintage', previewUrl: '/pic/ResultImage-1-10055-1.webp' },
  { id: 'falling-leaves', label: 'Falling Leaves', description: 'Autumn falling leaves', resourceType: '10058', category: 'vintage', previewUrl: '/pic/ResultImage-1-10058-1.webp' },
  
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
  { id: 'passion', label: 'Passion', description: 'Passionate vibrant red', resourceType: '10042', category: 'vibrant', previewUrl: '/pic/ResultImage-1-10042-1.webp' },
  { id: 'gradual-warmth', label: 'Gradual Warmth', description: 'Warm gradient tones', resourceType: '10043', category: 'vibrant', previewUrl: '/pic/ResultImage-1-10043-1.webp' },
  { id: 'forest', label: 'Forest', description: 'Fresh forest green', resourceType: '10048', category: 'vibrant', previewUrl: '/pic/ResultImage-1-10048-1.webp' },
  { id: 'surfing', label: 'Surfing', description: 'Ocean surfing vibes', resourceType: '10049', category: 'vibrant', previewUrl: '/pic/ResultImage-1-10049-1.webp' },
  { id: 'breeze', label: 'Breeze', description: 'Light breezy feeling', resourceType: '10052', category: 'vibrant', previewUrl: '/pic/ResultImage-1-10052-1.webp' },
  { id: 'starlight', label: 'Starlight', description: 'Sparkling starlight', resourceType: '10056', category: 'vibrant', previewUrl: '/pic/ResultImage-1-10056-1.webp' },
  { id: 'sunshine', label: 'Sunshine', description: 'Bright sunshine glow', resourceType: '10057', category: 'vibrant', previewUrl: '/pic/ResultImage-1-10057-1.webp' },
  { id: 'vitality-2', label: 'Vitality', description: 'Fresh vital energy', resourceType: '10059', category: 'vibrant', previewUrl: '/pic/ResultImage-1-10059-1.webp' },
  { id: 'sweetheart', label: 'Sweetheart', description: 'Sweet romantic pink', resourceType: '10060', category: 'vibrant', previewUrl: '/pic/ResultImage-1-10060-1.webp' },
  { id: 'spring', label: 'Spring', description: 'Fresh spring colors', resourceType: '10062', category: 'vibrant', previewUrl: '/pic/ResultImage-1-10062-1.webp' },
  { id: 'rome', label: 'Rome', description: 'Roman vintage elegance', resourceType: '10063', category: 'vibrant', previewUrl: '/pic/ResultImage-1-10063-1.webp' },
  { id: 'green', label: 'Green', description: 'Fresh green nature', resourceType: '10064', category: 'vibrant', previewUrl: '/pic/ResultImage-1-10064-1.webp' },
  { id: 'gentle-breeze', label: 'Gentle Breeze', description: 'Soft gentle wind', resourceType: '10065', category: 'vibrant', previewUrl: '/pic/ResultImage-1-10065-1.webp' },
  { id: 'warm-heart', label: 'Warm Heart', description: 'Warm heartfelt tones', resourceType: '10066', category: 'vibrant', previewUrl: '/pic/ResultImage-1-10066-1.webp' },
  { id: 'seawater', label: 'Seawater', description: 'Cool ocean blue', resourceType: '10067', category: 'vibrant', previewUrl: '/pic/ResultImage-1-10067-1.webp' },
  { id: 'snowy-peak', label: 'Snowy Peak', description: 'Crisp snowy mountain', resourceType: '10071', category: 'vibrant', previewUrl: '/pic/ResultImage-1-10071-1.webp' },
  { id: 'sunlight', label: 'Sunlight', description: 'Warm natural sunlight', resourceType: '10072', category: 'vibrant', previewUrl: '/pic/ResultImage-1-10072-1.webp' },
  { id: 'floating-clouds', label: 'Floating Clouds', description: 'Dreamy floating clouds', resourceType: '10073', category: 'vibrant', previewUrl: '/pic/ResultImage-1-10073-1.webp' },
  { id: 'flowing-colors', label: 'Flowing Colors', description: 'Colorful flowing blend', resourceType: '10074', category: 'vibrant', previewUrl: '/pic/ResultImage-1-10074-1.webp' },
  { id: 'butterfly', label: 'Butterfly', description: 'Delicate butterfly colors', resourceType: '10078', category: 'vibrant', previewUrl: '/pic/ResultImage-1-10078-1.webp' },
  
  // Artistic Filters
  { id: 'confession', label: 'Confession', description: 'Dreamy artistic look', resourceType: '10005', category: 'artistic', previewUrl: '/pic/ResultImage-1-10005-1.webp' },
  { id: 'elegance', label: 'Elegance', description: 'Elegant and refined', resourceType: '10016', category: 'artistic', previewUrl: '/pic/ResultImage-1-10016-1.webp' },
  { id: 'basic', label: 'Basic', description: 'Simple artistic touch', resourceType: '10011', category: 'artistic', previewUrl: '/pic/ResultImage-1-10011-1.webp' },
  { id: 'heartbeat', label: 'Heartbeat', description: 'Emotional and vivid', resourceType: '10012', category: 'artistic', previewUrl: '/pic/ResultImage-1-10012-1.webp' },
  { id: 'street-snap', label: 'Street Snap', description: 'Urban street style', resourceType: '10027', category: 'artistic', previewUrl: '/pic/ResultImage-1-10027-1.webp' },
  { id: 'fashion', label: 'Fashion', description: 'Trendy fashion look', resourceType: '10034', category: 'artistic', previewUrl: '/pic/ResultImage-1-10034-1.webp' },
  { id: 'elegance-2', label: 'Elegance', description: 'Refined elegance style', resourceType: '10061', category: 'artistic', previewUrl: '/pic/ResultImage-1-10061-1.webp' },
  { id: 'mysterious', label: 'Mysterious', description: 'Dark mysterious mood', resourceType: '10068', category: 'artistic', previewUrl: '/pic/ResultImage-1-10068-1.webp' },
  { id: 'vintage-1', label: 'Vintage 1', description: 'Classic vintage style', resourceType: '10069', category: 'artistic', previewUrl: '/pic/ResultImage-1-10069-1.webp' },
  { id: 'vintage-2', label: 'Vintage 2', description: 'Retro vintage look', resourceType: '10070', category: 'artistic', previewUrl: '/pic/ResultImage-1-10070-1.webp' },
  { id: 'film', label: 'Film', description: 'Classic film grain', resourceType: '10075', category: 'artistic', previewUrl: '/pic/ResultImage-1-10075-1.webp' },
  { id: 'nostalgia', label: 'Nostalgia', description: 'Nostalgic memory tones', resourceType: '10076', category: 'artistic', previewUrl: '/pic/ResultImage-1-10076-1.webp' },
  { id: 'cheese', label: 'Cheese', description: 'Warm cheese yellow', resourceType: '10077', category: 'artistic', previewUrl: '/pic/ResultImage-1-10077-1.webp' },
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
  description: 'Professional AI-powered photo editing suite. Transform your appearance with age modification, gender swap, 78 stunning beauty filters, virtual try-on, and creative effects.',
};
