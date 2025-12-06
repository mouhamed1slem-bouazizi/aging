// Age categories for transformation
export type AgeCategory = 'baby' | 'young' | 'adult' | 'old' | 'elderly';

// AI Model types - simplified to just two working models
export type AIModel = 'pollinations' | 'gemini-imagen';

export interface AIModelOption {
  id: AIModel;
  name: string;
  description: string;
  provider: string;
  isFree: boolean;
  requiresApiKey: boolean;
}

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
  model?: AIModel; // Optional: defaults to pollinations
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
  step: 'upload' | 'select-age' | 'select-model' | 'processing' | 'result';
  image: ImageState;
  selectedAge: AgeCategory | null;
  selectedModel: AIModel | null;
  isLoading: boolean;
  error: string | null;
}
