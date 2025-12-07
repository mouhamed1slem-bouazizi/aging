// Age categories for transformation
export type AgeCategory = 'baby' | 'child' | 'young' | 'adult' | 'old' | 'elderly';

// Gender transformation options
export type GenderOption = 'male' | 'female';

// Transformation type
export type TransformationType = 'age' | 'gender';

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

// API request/response types
export interface TransformRequest {
  image: string; // Base64 encoded image
  transformationType: TransformationType;
  ageCategory?: AgeCategory;
  gender?: GenderOption;
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
  step: 'upload' | 'select-type' | 'select-age' | 'select-gender' | 'processing' | 'result';
  image: ImageState;
  transformationType: TransformationType | null;
  selectedAge: AgeCategory | null;
  selectedGender: GenderOption | null;
  isLoading: boolean;
  error: string | null;
}
