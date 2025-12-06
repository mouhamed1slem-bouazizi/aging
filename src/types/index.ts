// Age categories for transformation
export type AgeCategory = 'baby' | 'young' | 'adult' | 'old' | 'elderly';

export interface AgeCategoryOption {
  id: AgeCategory;
  label: string;
  description: string;
  ageRange: string;
  icon: string;
  prompt: string;
}

// API request/response types
export interface TransformRequest {
  image: string; // Base64 encoded image
  ageCategory: AgeCategory;
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
  step: 'upload' | 'select-age' | 'processing' | 'result';
  image: ImageState;
  selectedAge: AgeCategory | null;
  isLoading: boolean;
  error: string | null;
}
