// Age categories for transformation
export type AgeCategory = 'baby' | 'child' | 'young' | 'adult' | 'old' | 'elderly';

// Gender transformation options
export type GenderOption = 'male' | 'female';

// Face filter options
export type FaceFilterType = 
  | 'white-tea' | 'fair-skin' | 'early-summer' | 'tokyo' | 'confession'
  | 'warm-sunshine' | 'rose' | 'clarity' | 'crystal-clear' | 'sweet-mint'
  | 'basic' | 'heartbeat' | 'muted-gray' | 'cherry-pudding' | 'natural'
  | 'elegance' | 'black-white' | 'fruit' | 'love' | 'winter'
  | 'photo' | 'summer' | 'fragrance' | 'charm' | 'throb'
  | 'beach' | 'street-snap' | 'sweet' | 'first-kiss' | 'afternoon'
  | 'vitality' | 'hazy' | 'joyful' | 'fashion' | 'bubbles'
  | 'lemon' | 'cotton-candy' | 'brook' | 'beauty' | 'coffee'
  | 'tender-bud' | 'passion' | 'gradual-warmth' | 'breakfast' | 'white-tea-2'
  | 'fair' | 'holy' | 'forest' | 'surfing' | 'milk-coffee'
  | 'clear' | 'breeze' | 'sunset' | 'water-glow' | 'japanese-style'
  | 'starlight' | 'sunshine' | 'falling-leaves' | 'vitality-2' | 'sweetheart'
  | 'elegance-2' | 'spring' | 'rome' | 'green' | 'gentle-breeze'
  | 'warm-heart' | 'seawater' | 'mysterious' | 'vintage-1' | 'vintage-2'
  | 'snowy-peak' | 'sunlight' | 'floating-clouds' | 'flowing-colors' | 'film'
  | 'nostalgia' | 'cheese' | 'butterfly';

// Transformation type
export type TransformationType = 'age' | 'gender' | 'filter' | 'lip-color' | 'face-beauty';

export interface AgeCategoryOption {
  id: AgeCategory;
  label: string;
  description: string;
  ageRange: string;
  icon: string;
  targetAge: number; // Target age for RapidAPI (1-85)
}

export interface GenderOptionData {
  id: GenderOption;
  label: string;
  description: string;
  icon: string;
  targetValue: number; // 0 for male, 1 for female
}

// Lip color options
export interface LipColorRGBA {
  r: number; // 0-255
  g: number; // 0-255
  b: number; // 0-255
  a: number; // 0-100 (transparency)
}

export interface LipColorOption {
  id: string;
  label: string;
  description: string;
  rgba: LipColorRGBA;
  category: 'natural' | 'bold' | 'nude' | 'vibrant';
}

// Face beauty parameters
export interface FaceBeautyParams {
  sharp: number;  // 0-1.0 Sharpness level
  smooth: number; // 0-1.0 Smoothness level
  white: number;  // 0-1.0 Whitening level
}

export interface FaceFilterOption {
  id: FaceFilterType;
  label: string;
  description: string;
  resourceType: string; // API resource_type code
  category: 'natural' | 'vintage' | 'vibrant' | 'artistic';
  previewUrl: string; // Preview image URL
}

// API request/response types
export interface TransformRequest {
  image: string; // Base64 encoded image
  transformationType: TransformationType;
  ageCategory?: AgeCategory;
  gender?: GenderOption;
  faceFilter?: FaceFilterType;
  filterStrength?: number; // 0-1 for filter intensity
  lipColor?: LipColorRGBA; // Lip color for lip-color transformation
  faceBeauty?: FaceBeautyParams; // Face beauty parameters
}

export interface TransformResponse {
  success: boolean;
  transformedImage?: string; // Base64 encoded result
  error?: string;
}

// Component state types
export interface ImageState {
  original: string | null;
  transformed: string | null;
}

export interface AppState {
  step: 'upload' | 'select-type' | 'select-age' | 'select-gender' | 'select-filter' | 'select-lip-color' | 'select-beauty' | 'processing' | 'result' | 'error';
  image: ImageState;
  transformationType: TransformationType | null;
  selectedAge: AgeCategory | null;
  selectedGender: GenderOption | null;
  selectedFilter: FaceFilterType | null;
  filterStrength: number;
  selectedLipColor: LipColorRGBA | null;
  selectedBeauty: FaceBeautyParams | null;
  isLoading: boolean;
  error: string | null;
}
