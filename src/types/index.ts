// Age categories for transformation
export type AgeCategory = 'baby' | 'child' | 'young' | 'adult' | 'old' | 'elderly';

// Gender transformation options
export type GenderOption = 'male' | 'female';

// Face filter options
export type FaceFilterType = 
  | 'white-tea' | 'fair-skin' | 'early-summer' | 'tokyo' | 'confession'
  | 'warm-sunshine' | 'rose' | 'clarity' | 'crystal-clear' | 'sweet-mint'
  | 'basic' | 'heartbeat' | 'muted-gray' | 'cherry-pudding' | 'natural'
  | 'elegance' | 'black-white' | 'fruit' | 'love' | 'winter';

// Transformation type
export type TransformationType = 'age' | 'gender' | 'filter';

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
  step: 'upload' | 'select-type' | 'select-age' | 'select-gender' | 'select-filter' | 'processing' | 'result' | 'error';
  image: ImageState;
  transformationType: TransformationType | null;
  selectedAge: AgeCategory | null;
  selectedGender: GenderOption | null;
  selectedFilter: FaceFilterType | null;
  filterStrength: number;
  isLoading: boolean;
  error: string | null;
}
