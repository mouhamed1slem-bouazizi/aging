import { NextRequest, NextResponse } from 'next/server';
import { AGE_CATEGORIES, AILAB_API_URL, GENDER_OPTIONS, FACE_FILTERS } from '@/lib/constants';
import { AgeCategory, GenderOption, FaceFilterType, TransformationType, TransformResponse, LipColorRGBA, FaceBeautyParams, FaceSlimmingParams, SkinBeautyParams, FaceFusionParams, SmartBeautyParams, HairstyleParams, ExpressionParams } from '@/types';

export const maxDuration = 300; // Increased for async operations

export async function POST(request: NextRequest): Promise<NextResponse<TransformResponse>> {
  try {
    const body = await request.json();
    const { image, transformationType, ageCategory, gender, faceFilter, filterStrength, lipColor, faceBeauty, faceSlimming, skinBeauty, faceFusion, smartBeauty, hairstyle, expression } = body as { 
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
    // Face fusion, smart beauty, and expression use 'image_target' field name, others use 'image'
    const imageFieldName = (transformationType === 'face-fusion' || transformationType === 'smart-beauty' || transformationType === 'expression') ? 'image_target' : 'image';
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
      return NextResponse.json(
        { success: false, error: data.error_msg || 'Transformation failed' },
        { status: 400 }
      );
    }

    // Handle async hairstyle transformation
    if (transformationType === 'hairstyle') {
      // For async tasks, task_id is at root level, not in data.task_id
      const taskId = data.task_id;
      if (!taskId) {
        console.error('No task_id in hairstyle response:', JSON.stringify(data, null, 2));
        return NextResponse.json(
          { success: false, error: 'Failed to start hairstyle transformation' },
          { status: 500 }
        );
      }

      console.log(`Hairstyle task started: ${taskId}`);

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
