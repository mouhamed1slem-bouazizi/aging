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
export type TransformationType = 'age' | 'gender' | 'filter' | 'lip-color' | 'face-beauty' | 'face-slimming' | 'skin-beauty' | 'face-fusion' | 'smart-beauty' | 'hairstyle' | 'expression' | 'cartoon' | 'image-enhance' | 'image-dehaze' | 'photo-colorize' | 'image-sharpen' | 'image-restore' | 'photo-retouch' | 'image-crop' | 'style-transfer' | 'image-upscale' | 'photo-painting';

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

// Face slimming parameter
export interface FaceSlimmingParams {
  slimDegree: number; // 0-2.0 Slimming strength
}

// Skin beauty parameters
export interface SkinBeautyParams {
  retouchDegree: number;   // 0-1.5 Dermabrasion intensity
  whiteningDegree: number; // 0-1.5 Whitening strength
}

// Face fusion parameters
export interface FaceFusionParams {
  templateImage: string;    // Base64 encoded template image
  sourceSimilarity: number; // 0-1 Similarity control
}

// Smart beauty parameters
export interface SmartBeautyParams {
  beautyLevel: number;  // 0-1 Beauty enhancement level
  multiFace: boolean;   // Process all faces or just largest
}

// Hairstyle changer parameters
export type HairGender = 'male' | 'female';
export type HairStyle = string; // Various hairstyle codes
export type HairColor = 'blonde' | 'platinumBlonde' | 'brown' | 'lightBrown' | 'blue' | 'lightBlue' | 'purple' | 'lightPurple' | 'pink' | 'black' | 'white' | 'grey' | 'silver' | 'red' | 'orange' | 'green' | 'gradient' | 'multicolored' | 'darkBlue' | 'burgundy' | 'darkGreen';

export interface HairstyleParams {
  gender: HairGender;
  hairStyle: HairStyle;
  color?: HairColor;
}

// Facial expression types
export type FacialExpression = 10 | 11 | 12 | 13 | 14 | 15 | 16 | 100;

export interface ExpressionParams {
  expression: FacialExpression;
}

// Cartoon types
export type CartoonType = 'jpcartoon' | 'anime' | 'claborate' | 'hongkong' | 'comic' | 'animation3d' | 'handdrawn' | 'sketch' | 'full' | 'artstyle' | 'classic_cartoon' | 'tccartoon' | 'hkcartoon' | '3d_cartoon' | 'pixar' | 'pixar_plus' | 'angel' | 'angel_plus' | 'demon' | 'ukiyoe_cartoon' | 'amcartoon' | '3d' | '3d_game' | 'jpcartoon_head' | 'head';

export interface CartoonParams {
  cartoonType: CartoonType;
}

// Image crop parameters
export interface CropParams {
  width: number;  // Target width in pixels
  height: number; // Target height in pixels
}

// Image upscale parameters
export type UpscaleFactor = 2 | 3 | 4;
export type UpscaleMode = 'base' | 'enhancement';
export type OutputFormat = 'png' | 'jpg' | 'bmp';

export interface UpscaleParams {
  upscaleFactor: UpscaleFactor;   // 2x, 3x, or 4x
  mode: UpscaleMode;              // base or enhancement
  outputFormat: OutputFormat;     // png, jpg, or bmp
  outputQuality: number;          // 30-100 (only for jpg)
}

// Painting style parameters
export type PaintingStyle = 'cartoon' | 'pencil' | 'color_pencil' | 'warm' | 'wave' | 'lavender' | 'mononoke' | 'scream' | 'gothic';

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
  faceSlimming?: FaceSlimmingParams; // Face slimming parameters
  skinBeauty?: SkinBeautyParams; // Skin beauty parameters
  faceFusion?: FaceFusionParams; // Face fusion parameters
  smartBeauty?: SmartBeautyParams; // Smart beauty parameters
  hairstyle?: HairstyleParams; // Hairstyle changer parameters
  expression?: ExpressionParams; // Facial expression parameters
  cartoon?: CartoonParams; // Cartoon animation parameters
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
  step: 'upload' | 'select-type' | 'select-age' | 'select-gender' | 'select-filter' | 'select-lip-color' | 'select-beauty' | 'select-slimming' | 'select-skin' | 'select-fusion' | 'select-smart-beauty' | 'select-hairstyle' | 'processing' | 'result' | 'error';
  image: ImageState;
  transformationType: TransformationType | null;
  selectedAge: AgeCategory | null;
  selectedGender: GenderOption | null;
  selectedFilter: FaceFilterType | null;
  filterStrength: number;
  selectedLipColor: LipColorRGBA | null;
  selectedBeauty: FaceBeautyParams | null;
  selectedSlimming: FaceSlimmingParams | null;
  selectedSkin: SkinBeautyParams | null;
  selectedFusion: FaceFusionParams | null;
  selectedSmartBeauty: SmartBeautyParams | null;
  selectedHairstyle: HairstyleParams | null;
  selectedExpression: ExpressionParams | null;
  selectedCartoon: CartoonParams | null;
  isLoading: boolean;
  error: string | null;
}
