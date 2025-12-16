import { NextRequest, NextResponse } from 'next/server';
import { AGE_CATEGORIES, AILAB_API_URL, GENDER_OPTIONS, FACE_FILTERS } from '@/lib/constants';
import { AgeCategory, GenderOption, FaceFilterType, TransformationType, TransformResponse, LipColorRGBA, FaceBeautyParams, FaceSlimmingParams, SkinBeautyParams, FaceFusionParams, SmartBeautyParams, HairstyleParams, ExpressionParams, CartoonParams, CropParams, UpscaleParams, PaintingStyle, AnimeStyleIndex, ImageExtenderParams, TryOnClothesParams, HitchcockParams } from '@/types';

export const maxDuration = 300; // Increased for async operations

export async function POST(request: NextRequest): Promise<NextResponse<TransformResponse>> {
  try {
    const body = await request.json();
    const { image, transformationType, ageCategory, gender, faceFilter, filterStrength, lipColor, faceBeauty, faceSlimming, skinBeauty, faceFusion, smartBeauty, hairstyle, expression, cartoon, styleImage, crop, upscale, paintingStyle, animeStyle, extender, tryOnClothes, hitchcock } = body as { 
      image: string; 
      transformationType: TransformationType;
      ageCategory?: AgeCategory;
      gender?: GenderOption;
      faceFilter?: FaceFilterType;
      filterStrength?: number;
      lipColor?: LipColorRGBA;
      faceBeauty?: FaceBeautyParams;
      faceSlimming?: FaceSlimmingParams;
      skinBeauty?: SkinBeautyParams;
      faceFusion?: FaceFusionParams;
      smartBeauty?: SmartBeautyParams;
      hairstyle?: HairstyleParams;
      expression?: ExpressionParams;
      cartoon?: CartoonParams;
      styleImage?: string; // For photo retouch
      crop?: CropParams; // For image crop
      upscale?: UpscaleParams; // For image upscale
      paintingStyle?: PaintingStyle; // For photo to painting
      animeStyle?: AnimeStyleIndex; // For anime generator
      extender?: ImageExtenderParams; // For image extender
      tryOnClothes?: TryOnClothesParams; // For try-on clothes
      hitchcock?: HitchcockParams; // For hitchcock effects
    };

    // Validate inputs
    if (!image) {
      return NextResponse.json(
        { success: false, error: 'No image provided' },
        { status: 400 }
      );
    }

    if (!transformationType) {
      return NextResponse.json(
        { success: false, error: 'No transformation type selected' },
        { status: 400 }
      );
    }

    // Check for AILabAPI key
    const ailabApiKey = process.env.AILAB_API_KEY;
    if (!ailabApiKey) {
      return NextResponse.json(
        { success: false, error: 'AILab API key not configured. Please add AILAB_API_KEY to environment variables.' },
        { status: 400 }
      );
    }

    let actionType: string | undefined;
    let target: string | undefined;
    let apiUrl = AILAB_API_URL;
    let resourceType: string | undefined;
    let strength: number | undefined;

    // Handle age transformation
    if (transformationType === 'age') {
      if (!ageCategory) {
        return NextResponse.json(
          { success: false, error: 'No age category selected' },
          { status: 400 }
        );
      }

      const category = AGE_CATEGORIES.find((c) => c.id === ageCategory);
      if (!category) {
        return NextResponse.json(
          { success: false, error: 'Invalid age category' },
          { status: 400 }
        );
      }

      actionType = 'V2_AGE';
      target = category.targetAge.toString();
      console.log(`Transforming to age: ${category.targetAge} (${category.label})`);
    }
    // Handle gender transformation
    else if (transformationType === 'gender') {
      if (!gender) {
        return NextResponse.json(
          { success: false, error: 'No gender selected' },
          { status: 400 }
        );
      }

      const genderOption = GENDER_OPTIONS.find((g) => g.id === gender);
      if (!genderOption) {
        return NextResponse.json(
          { success: false, error: 'Invalid gender option' },
          { status: 400 }
        );
      }

      actionType = 'V2_GENDER';
      target = genderOption.targetValue.toString();
      console.log(`Transforming to gender: ${genderOption.label}`);
    }
    // Handle face filter
    else if (transformationType === 'filter') {
      if (!faceFilter) {
        return NextResponse.json(
          { success: false, error: 'No filter selected' },
          { status: 400 }
        );
      }

      const filter = FACE_FILTERS.find((f) => f.id === faceFilter);
      if (!filter) {
        return NextResponse.json(
          { success: false, error: 'Invalid filter' },
          { status: 400 }
        );
      }

      // Face filter uses different endpoint
      apiUrl = 'https://www.ailabapi.com/api/portrait/effects/face-filter';
      resourceType = filter.resourceType;
      strength = filterStrength ?? 0.7;
      console.log(`Applying filter: ${filter.label} with strength ${strength}`);
    }
    // Handle lip color transformation
    else if (transformationType === 'lip-color') {
      if (!lipColor) {
        return NextResponse.json(
          { success: false, error: 'No lip color selected' },
          { status: 400 }
        );
      }

      // Lip color uses different endpoint
      apiUrl = 'https://www.ailabapi.com/api/portrait/effects/lips-color-changer';
      console.log(`Applying lip color: RGB(${lipColor.r}, ${lipColor.g}, ${lipColor.b}) with alpha ${lipColor.a}`);
    }
    // Handle face beauty transformation
    else if (transformationType === 'face-beauty') {
      if (!faceBeauty) {
        return NextResponse.json(
          { success: false, error: 'No beauty parameters provided' },
          { status: 400 }
        );
      }

      // Face beauty uses different endpoint
      apiUrl = 'https://www.ailabapi.com/api/portrait/effects/face-beauty';
      console.log(`Applying face beauty: sharp=${faceBeauty.sharp}, smooth=${faceBeauty.smooth}, white=${faceBeauty.white}`);
    }
    // Handle face slimming transformation
    else if (transformationType === 'face-slimming') {
      if (!faceSlimming) {
        return NextResponse.json(
          { success: false, error: 'No slimming parameters provided' },
          { status: 400 }
        );
      }

      // Face slimming uses different endpoint
      apiUrl = 'https://www.ailabapi.com/api/portrait/effects/smart-face-slimming';
      console.log(`Applying face slimming: slimDegree=${faceSlimming.slimDegree}`);
    }
    // Handle skin beauty transformation
    else if (transformationType === 'skin-beauty') {
      if (!skinBeauty) {
        return NextResponse.json(
          { success: false, error: 'No skin beauty parameters provided' },
          { status: 400 }
        );
      }

      // Skin beauty uses different endpoint
      apiUrl = 'https://www.ailabapi.com/api/portrait/effects/smart-skin';
      console.log(`Applying skin beauty: retouch=${skinBeauty.retouchDegree}, whitening=${skinBeauty.whiteningDegree}`);
    }
    // Handle face fusion transformation
    else if (transformationType === 'face-fusion') {
      if (!faceFusion || !faceFusion.templateImage) {
        return NextResponse.json(
          { success: false, error: 'No template image provided for face fusion' },
          { status: 400 }
        );
      }

      // Face fusion uses different endpoint
      apiUrl = 'https://www.ailabapi.com/api/portrait/effects/face-fusion';
      console.log(`Applying face fusion: similarity=${faceFusion.sourceSimilarity}`);
    }
    // Handle smart beauty transformation
    else if (transformationType === 'smart-beauty') {
      if (!smartBeauty) {
        return NextResponse.json(
          { success: false, error: 'No smart beauty parameters provided' },
          { status: 400 }
        );
      }

      // Smart beauty uses different endpoint
      apiUrl = 'https://www.ailabapi.com/api/portrait/effects/smart-beauty';
      console.log(`Applying smart beauty: level=${smartBeauty.beautyLevel}, multiFace=${smartBeauty.multiFace}`);
    }
    // Handle hairstyle transformation (async)
    else if (transformationType === 'hairstyle') {
      if (!hairstyle) {
        return NextResponse.json(
          { success: false, error: 'No hairstyle parameters provided' },
          { status: 400 }
        );
      }

      // Hairstyle uses different endpoint and is async
      apiUrl = 'https://www.ailabapi.com/api/portrait/effects/hairstyle-editor-pro';
      console.log(`Applying hairstyle: ${hairstyle.hairStyle}, color=${hairstyle.color || 'none'}`);
    }
    // Handle facial expression transformation
    else if (transformationType === 'expression') {
      if (!expression) {
        return NextResponse.json(
          { success: false, error: 'No expression selected' },
          { status: 400 }
        );
      }

      // Expression uses different endpoint
      apiUrl = 'https://www.ailabapi.com/api/portrait/effects/emotion-editor';
      console.log(`Applying expression: ${expression.expression}`);
    } else if (transformationType === 'cartoon') {
      if (!cartoon) {
        return NextResponse.json(
          { success: false, error: 'No cartoon style selected' },
          { status: 400 }
        );
      }

      // Cartoon uses portrait animation endpoint
      apiUrl = 'https://www.ailabapi.com/api/portrait/effects/portrait-animation';
      console.log(`Applying cartoon style: ${cartoon.cartoonType}`);
    } else if (transformationType === 'image-enhance') {
      // Image enhancement endpoint - no parameters needed
      apiUrl = 'https://www.ailabapi.com/api/image/enhance/image-contrast-enhancement';
      console.log('Enhancing image contrast');
    } else if (transformationType === 'image-dehaze') {
      // Image dehaze endpoint - no parameters needed
      apiUrl = 'https://www.ailabapi.com/api/image/enhance/image-defogging';
      console.log('Removing haze from image');
    } else if (transformationType === 'photo-colorize') {
      // Photo colorize endpoint - no parameters needed
      apiUrl = 'https://www.ailabapi.com/api/image/effects/image-colorization';
      console.log('Colorizing black and white photo');
    } else if (transformationType === 'image-sharpen') {
      // Image sharpen endpoint - no parameters needed
      apiUrl = 'https://www.ailabapi.com/api/image/enhance/image-sharpness-enhancement';
      console.log('Sharpening image');
    } else if (transformationType === 'image-restore') {
      // Image restore endpoint - no parameters needed
      apiUrl = 'https://www.ailabapi.com/api/image/enhance/stretch-image-recovery';
      console.log('Restoring stretched image');
    } else if (transformationType === 'photo-retouch') {
      // Photo retouch endpoint - requires style image
      if (!styleImage) {
        return NextResponse.json(
          { success: false, error: 'No style reference image provided' },
          { status: 400 }
        );
      }
      apiUrl = 'https://www.ailabapi.com/api/image/editing/photo-retouching';
      console.log('Applying photo retouch with style transfer');
    } else if (transformationType === 'image-crop') {
      // Image crop endpoint - requires width and height
      if (!crop) {
        return NextResponse.json(
          { success: false, error: 'No crop dimensions provided' },
          { status: 400 }
        );
      }
      apiUrl = 'https://www.ailabapi.com/api/image/editing/image-cropping';
      console.log(`Cropping image to ${crop.width}x${crop.height}`);
    } else if (transformationType === 'style-transfer') {
      // Style transfer endpoint - requires style image
      if (!styleImage) {
        return NextResponse.json(
          { success: false, error: 'No style reference image provided' },
          { status: 400 }
        );
      }
      apiUrl = 'https://www.ailabapi.com/api/image/effects/image-style-migration';
      console.log('Applying style transfer');
    } else if (transformationType === 'image-upscale') {
      // Image upscale endpoint - requires upscale parameters
      if (!upscale) {
        return NextResponse.json(
          { success: false, error: 'No upscale parameters provided' },
          { status: 400 }
        );
      }
      apiUrl = 'https://www.ailabapi.com/api/image/enhance/image-lossless-enlargement';
      console.log(`Upscaling image ${upscale.upscaleFactor}x in ${upscale.mode} mode`);
    } else if (transformationType === 'photo-painting') {
      // Photo to painting endpoint - requires painting style
      if (!paintingStyle) {
        return NextResponse.json(
          { success: false, error: 'No painting style provided' },
          { status: 400 }
        );
      }
      apiUrl = 'https://www.ailabapi.com/api/image/effects/image-style-conversion';
      console.log(`Converting to ${paintingStyle} painting style`);
    } else if (transformationType === 'anime-generator') {
      // Anime generator endpoint - requires anime style index (async task)
      if (animeStyle === undefined) {
        return NextResponse.json(
          { success: false, error: 'No anime style provided' },
          { status: 400 }
        );
      }
      apiUrl = 'https://www.ailabapi.com/api/image/effects/ai-anime-generator';
      console.log(`Generating anime with style ${animeStyle}`);
    } else if (transformationType === 'image-extender') {
      // Image extender endpoint - requires expansion parameters
      if (!extender) {
        return NextResponse.json(
          { success: false, error: 'No expansion parameters provided' },
          { status: 400 }
        );
      }
      apiUrl = 'https://www.ailabapi.com/api/image/editing/ai-image-extender';
      console.log(`Extending image: top=${extender.top}, bottom=${extender.bottom}, left=${extender.left}, right=${extender.right}`);
    } else if (transformationType === 'try-on-clothes') {
      // Try-on clothes endpoint - requires clothing image and type
      if (!tryOnClothes) {
        return NextResponse.json(
          { success: false, error: 'No clothing parameters provided' },
          { status: 400 }
        );
      }
      apiUrl = 'https://www.ailabapi.com/api/portrait/editing/try-on-clothes';
      console.log(`Try-on clothes: type=${tryOnClothes.clothesType}`);
    } else if (transformationType === 'face-enhancer') {
      // Face enhancer endpoint - automatic face quality enhancement
      apiUrl = 'https://www.ailabapi.com/api/portrait/effects/enhance-face';
      console.log('Enhancing face quality with AI');
    } else if (transformationType === 'hitchcock') {
      // Hitchcock effects endpoint - creates cinematic video effects
      if (!hitchcock) {
        return NextResponse.json(
          { success: false, error: 'No Hitchcock parameters provided' },
          { status: 400 }
        );
      }
      apiUrl = 'https://www.ailabapi.com/api/portrait/effects/hitchcock-effects';
      console.log(`Creating Hitchcock effect: mode=${hitchcock.mode}, resolution=${hitchcock.longSide}px`);
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid transformation type' },
        { status: 400 }
      );
    }

    // Extract base64 data and convert to buffer
    const base64Data = image.includes('base64,') ? image.split('base64,')[1] : image;
    const imageBuffer = Buffer.from(base64Data, 'base64');
    
    // Determine mime type from data URL or default to jpeg
    const mimeType = image.match(/data:([^;]+);/)?.[1] || 'image/jpeg';
    const extension = mimeType.split('/')[1] || 'jpg';

    // Create FormData for the API request
    const formData = new FormData();
    const blob = new Blob([imageBuffer], { type: mimeType });
    // Face fusion, smart beauty, expression, and hitchcock use 'image_target' field name, others use 'image'
    const imageFieldName = (transformationType === 'face-fusion' || transformationType === 'smart-beauty' || transformationType === 'expression' || transformationType === 'hitchcock') ? 'image_target' : 'image';
    formData.append(imageFieldName, blob, `photo.${extension}`);
    
    // Add parameters based on transformation type
    if (transformationType === 'filter') {
      formData.append('resource_type', resourceType!);
      formData.append('strength', strength!.toString());
    } else if (transformationType === 'lip-color') {
      // Lip color API requires lip_color_infos as JSON string
      const lipColorInfos = JSON.stringify([{
        rgba: {
          r: lipColor!.r,
          g: lipColor!.g,
          b: lipColor!.b,
          a: lipColor!.a,
        }
      }]);
      formData.append('lip_color_infos', lipColorInfos);
    } else if (transformationType === 'face-beauty') {
      // Face beauty API requires sharp, smooth, and white parameters
      formData.append('sharp', faceBeauty!.sharp.toString());
      formData.append('smooth', faceBeauty!.smooth.toString());
      formData.append('white', faceBeauty!.white.toString());
    } else if (transformationType === 'face-slimming') {
      // Face slimming API requires slim_degree parameter
      formData.append('slim_degree', faceSlimming!.slimDegree.toString());
    } else if (transformationType === 'skin-beauty') {
      // Skin beauty API requires retouch_degree and whitening_degree parameters
      formData.append('retouch_degree', skinBeauty!.retouchDegree.toString());
      formData.append('whitening_degree', skinBeauty!.whiteningDegree.toString());
    } else if (transformationType === 'face-fusion') {
      // Face fusion API requires image_target, image_template, and source_similarity
      // Extract base64 data from template image
      const templateBase64 = faceFusion!.templateImage.replace(/^data:image\/\w+;base64,/, '');
      const templateBuffer = Buffer.from(templateBase64, 'base64');
      const templateBlob = new Blob([templateBuffer], { type: 'image/jpeg' });
      
      // Add template image as image_template
      formData.append('image_template', templateBlob, 'template.jpg');
      // Target image is the user's photo
      formData.append('source_similarity', faceFusion!.sourceSimilarity.toString());
    } else if (transformationType === 'smart-beauty') {
      // Smart beauty API requires beauty_level, multi_face, and task_type
      formData.append('beauty_level', smartBeauty!.beautyLevel.toString());
      formData.append('multi_face', smartBeauty!.multiFace ? '1' : '0');
      formData.append('task_type', 'sync');
    } else if (transformationType === 'hairstyle') {
      // Hairstyle API requires auto, hair_style, color (optional), image_size, and task_type
      formData.append('task_type', 'async'); // Must be first
      formData.append('auto', '1'); // Required integer
      formData.append('hair_style', hairstyle!.hairStyle);
      if (hairstyle!.color) {
        formData.append('color', hairstyle!.color);
      }
      formData.append('image_size', '1'); // Return 1 result image
    } else if (transformationType === 'expression') {
      // Expression API requires service_choice parameter
      formData.append('service_choice', expression!.expression.toString());
    } else if (transformationType === 'cartoon') {
      // Cartoon API requires type parameter
      formData.append('type', cartoon!.cartoonType);
    } else if (transformationType === 'image-enhance') {
      // Image enhancement doesn't need any parameters, just the image
    } else if (transformationType === 'image-dehaze') {
      // Image dehaze doesn't need any parameters, just the image
    } else if (transformationType === 'photo-colorize') {
      // Photo colorize doesn't need any parameters, just the image
    } else if (transformationType === 'image-sharpen') {
      // Image sharpen doesn't need any parameters, just the image
    } else if (transformationType === 'image-restore') {
      // Image restore doesn't need any parameters, just the image
    } else if (transformationType === 'photo-retouch') {
      // Photo retouch requires style image
      const styleBase64 = styleImage!.replace(/^data:image\/\w+;base64,/, '');
      const styleBuffer = Buffer.from(styleBase64, 'base64');
      const styleBlob = new Blob([styleBuffer], { type: 'image/jpeg' });
      formData.append('style', styleBlob, 'style.jpg');
    } else if (transformationType === 'image-crop') {
      // Image crop requires width and height
      formData.append('width', crop!.width.toString());
      formData.append('height', crop!.height.toString());
    } else if (transformationType === 'style-transfer') {
      // Style transfer requires style image (uses 'major' for content image, not 'image')
      const styleBase64 = styleImage!.replace(/^data:image\/\w+;base64,/, '');
      const styleBuffer = Buffer.from(styleBase64, 'base64');
      const styleBlob = new Blob([styleBuffer], { type: 'image/jpeg' });
      formData.append('style', styleBlob, 'style.jpg');
      
      // Need to change the content image field name from 'image' to 'major'
      // Remove the 'image' field and add 'major' instead
      formData.delete('image');
      formData.append('major', blob, 'major.jpg');
    } else if (transformationType === 'image-upscale') {
      // Image upscale requires upscale factor, mode, output format, and quality
      formData.append('upscale_factor', upscale!.upscaleFactor.toString());
      formData.append('mode', upscale!.mode);
      formData.append('output_format', upscale!.outputFormat);
      if (upscale!.outputFormat === 'jpg') {
        formData.append('output_quality', upscale!.outputQuality.toString());
      }
    } else if (transformationType === 'photo-painting') {
      // Photo to painting requires painting style option
      formData.append('option', paintingStyle!);
    } else if (transformationType === 'anime-generator') {
      // Anime generator requires task_type and index (async task)
      formData.append('task_type', 'async');
      formData.append('index', animeStyle!.toString());
    } else if (transformationType === 'image-extender') {
      // Image extender requires expansion ratios and advanced parameters
      formData.append('top', extender!.top.toString());
      formData.append('bottom', extender!.bottom.toString());
      formData.append('left', extender!.left.toString());
      formData.append('right', extender!.right.toString());
      formData.append('steps', extender!.steps.toString());
      formData.append('strength', extender!.strength.toString());
      formData.append('scale', extender!.scale.toString());
      formData.append('seed', extender!.seed.toString());
      formData.append('max_height', extender!.maxHeight.toString());
      formData.append('max_width', extender!.maxWidth.toString());
    } else if (transformationType === 'try-on-clothes') {
      // Try-on clothes requires task_type, person_image, clothes_image, and clothes_type
      formData.append('task_type', 'async');
      
      // Add clothing image
      const clothesBuffer = Buffer.from(tryOnClothes!.clothesImage.replace(/^data:image\/\w+;base64,/, ''), 'base64');
      const clothesBlob = new Blob([clothesBuffer]);
      formData.append('clothes_image', clothesBlob, 'clothes.jpg');
      
      // Add clothes type
      formData.append('clothes_type', tryOnClothes!.clothesType);
    } else if (transformationType === 'face-enhancer') {
      // Face enhancer doesn't need any parameters, just the image
    } else if (transformationType === 'hitchcock') {
      // Hitchcock effects requires version and various video parameters
      formData.append('version', 'v2');
      formData.append('mode', hitchcock!.mode.toString());
      formData.append('long_side', hitchcock!.longSide.toString());
      formData.append('frame_num', hitchcock!.frameNum.toString());
      formData.append('fps', hitchcock!.fps.toString());
      formData.append('use_flow', hitchcock!.useFlow.toString());
      if (hitchcock!.speedShift) {
        formData.append('speed_shift', hitchcock!.speedShift);
      }
      // Note: for hitchcock, the image field name is 'image_target' instead of 'image'
      // We'll handle this specially below
    } else {
      formData.append('action_type', actionType!);
      if (target) {
        formData.append('target', target);
      }
    }

    // Call AILabAPI directly
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'ailabapi-api-key': ailabApiKey,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AILabAPI error:', response.status, errorText);
      
      // For hairstyle, provide more detailed error
      if (transformationType === 'hairstyle') {
        console.error('Hairstyle params:', { hairStyle: hairstyle?.hairStyle, color: hairstyle?.color });
      }
      
      return NextResponse.json(
        { success: false, error: `API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('AILabAPI response received');
    
    // Log hairstyle response for debugging
    if (transformationType === 'hairstyle') {
      console.log('Hairstyle API full response:', JSON.stringify(data, null, 2));
    }

    // Check for API error in response
    if (data.error_code !== 0) {
      console.error('API returned error:', data);
      
      // Provide user-friendly error messages
      let errorMessage = data.error_msg || 'Transformation failed';
      
      // Handle specific error codes
      if (data.error_code === 500 || data.error_code_str === 'AI_SERVICE_ERROR') {
        errorMessage = `The AI service is temporarily unavailable. This is a server-side issue. Please try again in a few moments. If the problem persists, the ${transformationType} feature may be experiencing service disruptions.`;
      } else if (data.error_code === 422) {
        // Check for specific 422 error types
        if (data.error_detail?.code === 'ERROR_NO_FACE_IN_FILE') {
          errorMessage = 'No face detected in the image. Please upload a clear portrait photo with a visible face for this transformation.';
        } else if (data.error_code_str === 'FILE_CONTENT_NON_COMPLIANCE') {
          errorMessage = 'The image does not meet requirements. Please ensure: 1) Clear face is visible, 2) Image format is JPEG/PNG/BMP, 3) File size is under 5MB, 4) Resolution is less than 4096x4096px.';
        } else {
          errorMessage = 'Invalid input. Please ensure your image meets the requirements (JPEG/PNG/BMP, under 5MB, less than 4096x4096px with a clear face visible).';
        }
      }
      
      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: 400 }
      );
    }

    // Handle async hairstyle and anime-generator transformations
    if (transformationType === 'hairstyle' || transformationType === 'anime-generator' || transformationType === 'try-on-clothes') {
      // For async tasks, task_id is at root level, not in data.task_id
      const taskId = data.task_id;
      if (!taskId) {
        console.error(`No task_id in ${transformationType} response:`, JSON.stringify(data, null, 2));
        return NextResponse.json(
          { success: false, error: `Failed to start ${transformationType} transformation` },
          { status: 500 }
        );
      }

      console.log(`${transformationType} task started: ${taskId}`);

      // Poll for task completion
      const checkUrl = 'https://www.ailabapi.com/api/common/query-async-task-result';
      const maxAttempts = 60; // Maximum 60 attempts (5 minutes with 5s intervals)
      let attempts = 0;

      while (attempts < maxAttempts) {
        attempts++;
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds

        // Use GET method with task_id as query parameter
        const checkResponse = await fetch(`${checkUrl}?task_id=${encodeURIComponent(taskId)}`, {
          method: 'GET',
          headers: {
            'ailabapi-api-key': ailabApiKey,
          },
        });

        if (!checkResponse.ok) {
          console.error('Task check error:', checkResponse.status);
          continue; // Retry
        }

        const checkData = await checkResponse.json();
        console.log(`Task check attempt ${attempts}:`, checkData.task_status);

        if (checkData.error_code !== 0) {
          console.error('Task check returned error:', checkData);
          return NextResponse.json(
            { success: false, error: checkData.error_msg || 'Task check failed' },
            { status: 400 }
          );
        }

        const taskStatus = checkData.task_status;

        if (taskStatus === 2) {
          // Task completed successfully (status 2)
          // Image URLs are in data.images (plural), not image_list
          const imageList = checkData.data?.images || checkData.image_list;
          if (!imageList || imageList.length === 0) {
            console.error('No images in completed task:', checkData);
            return NextResponse.json(
              { success: false, error: 'No result image generated' },
              { status: 500 }
            );
          }

          // Get the first image URL and convert to base64
          const imageUrl = imageList[0];
          try {
            const imageResponse = await fetch(imageUrl);
            const imageArrayBuffer = await imageResponse.arrayBuffer();
            const base64 = Buffer.from(imageArrayBuffer).toString('base64');
            const transformedImage = `data:image/jpeg;base64,${base64}`;

            console.log('Hairstyle transformation completed successfully');
            return NextResponse.json({
              success: true,
              transformedImage,
            });
          } catch (fetchError) {
            console.error('Error fetching result image:', fetchError);
            return NextResponse.json(
              { success: false, error: 'Failed to fetch transformed image' },
              { status: 500 }
            );
          }
        } else if (taskStatus === 3) {
          // Task failed (if status 3 exists, though docs show 0,1,2)
          console.error('Hairstyle task failed:', checkData);
          return NextResponse.json(
            { success: false, error: 'Hairstyle transformation failed' },
            { status: 500 }
          );
        }
        // taskStatus === 0 (queued) or 1 (processing) means still processing, continue polling
      }

      // Timeout after max attempts
      console.error('Hairstyle transformation timeout');
      return NextResponse.json(
        { success: false, error: 'Hairstyle transformation timeout' },
        { status: 408 }
      );
    }

    // Extract the result image
    let transformedImage: string | undefined;

    // Face filter returns image_url, lip color returns result_image, face beauty returns image_url, face slimming returns image_url, skin beauty returns image_url, face attribute editing returns result.image
    if (transformationType === 'filter' && data.data?.image_url) {
      const imageUrl = data.data.image_url;
      // Fetch the image from URL and convert to base64
      try {
        const imageResponse = await fetch(imageUrl);
        const imageArrayBuffer = await imageResponse.arrayBuffer();
        const base64 = Buffer.from(imageArrayBuffer).toString('base64');
        transformedImage = `data:image/jpeg;base64,${base64}`;
      } catch (fetchError) {
        console.error('Error fetching result image:', fetchError);
        return NextResponse.json(
          { success: false, error: 'Failed to fetch transformed image' },
          { status: 500 }
        );
      }
    } else if (transformationType === 'lip-color' && data.result_image) {
      const resultImage = data.result_image;
      // The API returns base64 without prefix, add it
      transformedImage = resultImage.startsWith('data:') 
        ? resultImage 
        : `data:image/jpeg;base64,${resultImage}`;
    } else if (transformationType === 'face-beauty' && data.data?.image_url) {
      const imageUrl = data.data.image_url;
      // Fetch the image from URL and convert to base64
      try {
        const imageResponse = await fetch(imageUrl);
        const imageArrayBuffer = await imageResponse.arrayBuffer();
        const base64 = Buffer.from(imageArrayBuffer).toString('base64');
        transformedImage = `data:image/jpeg;base64,${base64}`;
      } catch (fetchError) {
        console.error('Error fetching result image:', fetchError);
        return NextResponse.json(
          { success: false, error: 'Failed to fetch transformed image' },
          { status: 500 }
        );
      }
    } else if (transformationType === 'face-slimming' && data.data?.image_url) {
      const imageUrl = data.data.image_url;
      // Fetch the image from URL and convert to base64
      try {
        const imageResponse = await fetch(imageUrl);
        const imageArrayBuffer = await imageResponse.arrayBuffer();
        const base64 = Buffer.from(imageArrayBuffer).toString('base64');
        transformedImage = `data:image/jpeg;base64,${base64}`;
      } catch (fetchError) {
        console.error('Error fetching result image:', fetchError);
        return NextResponse.json(
          { success: false, error: 'Failed to fetch transformed image' },
          { status: 500 }
        );
      }
    } else if (transformationType === 'skin-beauty' && data.data?.image_url) {
      const imageUrl = data.data.image_url;
      // Fetch the image from URL and convert to base64
      try {
        const imageResponse = await fetch(imageUrl);
        const imageArrayBuffer = await imageResponse.arrayBuffer();
        const base64 = Buffer.from(imageArrayBuffer).toString('base64');
        transformedImage = `data:image/jpeg;base64,${base64}`;
      } catch (fetchError) {
        console.error('Error fetching result image:', fetchError);
        return NextResponse.json(
          { success: false, error: 'Failed to fetch transformed image' },
          { status: 500 }
        );
      }
    } else if (transformationType === 'face-fusion' && data.data?.image) {
      const resultImage = data.data.image;
      // Face fusion returns base64 without prefix, add it
      transformedImage = resultImage.startsWith('data:') 
        ? resultImage 
        : `data:image/jpeg;base64,${resultImage}`;
    } else if (transformationType === 'smart-beauty' && data.data?.image) {
      const resultImage = data.data.image;
      // Smart beauty returns base64 without prefix, add it
      transformedImage = resultImage.startsWith('data:') 
        ? resultImage 
        : `data:image/jpeg;base64,${resultImage}`;
    } else if (transformationType === 'expression' && data.data?.image) {
      const resultImage = data.data.image;
      // Expression returns base64 without prefix, add it
      transformedImage = resultImage.startsWith('data:') 
        ? resultImage 
        : `data:image/jpeg;base64,${resultImage}`;
    } else if (transformationType === 'face-enhancer' && data.data?.image_url) {
      // Face enhancer returns image_url - need to download it
      const imageUrl = data.data.image_url;
      console.log(`Downloading enhanced face image from: ${imageUrl}`);
      
      try {
        const imageResponse = await fetch(imageUrl);
        if (!imageResponse.ok) {
          throw new Error(`Failed to download image: ${imageResponse.status}`);
        }
        
        const imageBuffer = await imageResponse.arrayBuffer();
        const base64Image = Buffer.from(imageBuffer).toString('base64');
        transformedImage = `data:image/jpeg;base64,${base64Image}`;
      } catch (downloadError) {
        console.error('Error downloading enhanced face image:', downloadError);
        throw new Error('Failed to download transformed image');
      }
    } else if (transformationType === 'cartoon' && data.data?.image_url) {
      // Cartoon returns image_url - need to download it
      const imageUrl = data.data.image_url;
      console.log(`Downloading cartoon image from: ${imageUrl}`);
      
      try {
        const imageResponse = await fetch(imageUrl);
        if (!imageResponse.ok) {
          throw new Error(`Failed to download image: ${imageResponse.status}`);
        }
        
        const imageBuffer = await imageResponse.arrayBuffer();
        const base64Image = Buffer.from(imageBuffer).toString('base64');
        transformedImage = `data:image/jpeg;base64,${base64Image}`;
      } catch (downloadError) {
        console.error('Error downloading cartoon image:', downloadError);
        throw new Error('Failed to download transformed image');
      }
    } else if (transformationType === 'image-enhance' && data.image) {
      // Image enhancement returns base64 in 'image' field at root level
      const resultImage = data.image;
      transformedImage = resultImage.startsWith('data:') 
        ? resultImage 
        : `data:image/jpeg;base64,${resultImage}`;
    } else if (transformationType === 'image-dehaze' && data.image) {
      // Image dehaze returns base64 in 'image' field at root level
      const resultImage = data.image;
      transformedImage = resultImage.startsWith('data:') 
        ? resultImage 
        : `data:image/jpeg;base64,${resultImage}`;
    } else if (transformationType === 'photo-colorize' && data.image) {
      // Photo colorize returns base64 in 'image' field at root level
      const resultImage = data.image;
      transformedImage = resultImage.startsWith('data:') 
        ? resultImage 
        : `data:image/jpeg;base64,${resultImage}`;
    } else if (transformationType === 'image-sharpen' && data.image) {
      // Image sharpen returns base64 in 'image' field at root level
      const resultImage = data.image;
      transformedImage = resultImage.startsWith('data:') 
        ? resultImage 
        : `data:image/jpeg;base64,${resultImage}`;
    } else if (transformationType === 'image-restore' && data.image) {
      // Image restore returns base64 in 'image' field at root level
      const resultImage = data.image;
      transformedImage = resultImage.startsWith('data:') 
        ? resultImage 
        : `data:image/jpeg;base64,${resultImage}`;
    } else if (transformationType === 'photo-painting' && data.image) {
      // Photo to painting returns base64 in 'image' field at root level
      const resultImage = data.image;
      transformedImage = resultImage.startsWith('data:') 
        ? resultImage 
        : `data:image/jpeg;base64,${resultImage}`;
    } else if (transformationType === 'image-extender' && data.data?.binary_data_base64) {
      // Image extender returns base64 array in data.binary_data_base64
      const base64Array = data.data.binary_data_base64;
      if (Array.isArray(base64Array) && base64Array.length > 0) {
        const resultImage = base64Array[0]; // Get first image from array
        transformedImage = resultImage.startsWith('data:') 
          ? resultImage 
          : `data:image/jpeg;base64,${resultImage}`;
      } else {
        throw new Error('No image data in response');
      }
    } else if (transformationType === 'hitchcock' && data.data?.video) {
      // Hitchcock returns base64 video in data.video
      const resultVideo = data.data.video;
      // Return video with proper MIME type for mp4
      transformedImage = resultVideo.startsWith('data:') 
        ? resultVideo 
        : `data:video/mp4;base64,${resultVideo}`;
    } else if (transformationType === 'photo-retouch' && data.data?.image_url) {
      // Photo retouch returns image_url - need to download it
      const imageUrl = data.data.image_url;
      console.log(`Downloading retouched image from: ${imageUrl}`);
      
      try {
        const imageResponse = await fetch(imageUrl);
        if (!imageResponse.ok) {
          throw new Error(`Failed to download image: ${imageResponse.status}`);
        }
        
        const imageBuffer = await imageResponse.arrayBuffer();
        const base64Image = Buffer.from(imageBuffer).toString('base64');
        transformedImage = `data:image/jpeg;base64,${base64Image}`;
      } catch (downloadError) {
        console.error('Error downloading retouched image:', downloadError);
        throw new Error('Failed to download transformed image');
      }
    } else if (transformationType === 'image-crop' && data.data?.url) {
      // Image crop returns url - need to download it
      const imageUrl = data.data.url;
      console.log(`Downloading cropped image from: ${imageUrl}`);
      
      try {
        const imageResponse = await fetch(imageUrl);
        if (!imageResponse.ok) {
          throw new Error(`Failed to download image: ${imageResponse.status}`);
        }
        
        const imageBuffer = await imageResponse.arrayBuffer();
        const base64Image = Buffer.from(imageBuffer).toString('base64');
        transformedImage = `data:image/jpeg;base64,${base64Image}`;
      } catch (downloadError) {
        console.error('Error downloading cropped image:', downloadError);
        throw new Error('Failed to download transformed image');
      }
    } else if (transformationType === 'style-transfer' && data.data?.url) {
      // Style transfer returns url - need to download it
      const imageUrl = data.data.url;
      console.log(`Downloading style-transferred image from: ${imageUrl}`);
      
      try {
        const imageResponse = await fetch(imageUrl);
        if (!imageResponse.ok) {
          throw new Error(`Failed to download image: ${imageResponse.status}`);
        }
        
        const imageBuffer = await imageResponse.arrayBuffer();
        const base64Image = Buffer.from(imageBuffer).toString('base64');
        transformedImage = `data:image/png;base64,${base64Image}`; // Style transfer returns PNG
      } catch (downloadError) {
        console.error('Error downloading style-transferred image:', downloadError);
        throw new Error('Failed to download transformed image');
      }
    } else if (transformationType === 'image-upscale' && data.data?.url) {
      // Image upscale returns url - need to download it
      const imageUrl = data.data.url;
      console.log(`Downloading upscaled image from: ${imageUrl}`);
      
      try {
        const imageResponse = await fetch(imageUrl);
        if (!imageResponse.ok) {
          throw new Error(`Failed to download image: ${imageResponse.status}`);
        }
        
        const imageBuffer = await imageResponse.arrayBuffer();
        const base64Image = Buffer.from(imageBuffer).toString('base64');
        // Use appropriate MIME type based on output format
        const mimeType = upscale?.outputFormat === 'jpg' ? 'image/jpeg' : 
                        upscale?.outputFormat === 'bmp' ? 'image/bmp' : 'image/png';
        transformedImage = `data:${mimeType};base64,${base64Image}`;
      } catch (downloadError) {
        console.error('Error downloading upscaled image:', downloadError);
        throw new Error('Failed to download transformed image');
      }
    } else if (data.result?.image) {
      const resultImage = data.result.image;
      // The API returns base64 without prefix, add it
      transformedImage = resultImage.startsWith('data:') 
        ? resultImage 
        : `data:image/jpeg;base64,${resultImage}`;
    }

    if (!transformedImage) {
      console.error('No image in response:', JSON.stringify(data, null, 2));
      return NextResponse.json(
        { success: false, error: 'No image was generated' },
        { status: 422 }
      );
    }

    console.log('Successfully transformed image');

    return NextResponse.json({
      success: true,
      transformedImage,
    });

  } catch (error) {
    console.error('Transform API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to process image transformation' 
      },
      { status: 500 }
    );
  }
}
