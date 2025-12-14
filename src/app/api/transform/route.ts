import { NextRequest, NextResponse } from 'next/server';
import { AGE_CATEGORIES, AILAB_API_URL, GENDER_OPTIONS, FACE_FILTERS } from '@/lib/constants';
import { AgeCategory, GenderOption, FaceFilterType, TransformationType, TransformResponse, LipColorRGBA, FaceBeautyParams, FaceSlimmingParams } from '@/types';

export const maxDuration = 60;

export async function POST(request: NextRequest): Promise<NextResponse<TransformResponse>> {
  try {
    const body = await request.json();
    const { image, transformationType, ageCategory, gender, faceFilter, filterStrength, lipColor, faceBeauty, faceSlimming } = body as { 
      image: string; 
      transformationType: TransformationType;
      ageCategory?: AgeCategory;
      gender?: GenderOption;
      faceFilter?: FaceFilterType;
      filterStrength?: number;
      lipColor?: LipColorRGBA;
      faceBeauty?: FaceBeautyParams;
      faceSlimming?: FaceSlimmingParams;
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
    formData.append('image', blob, `photo.${extension}`);
    
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
      return NextResponse.json(
        { success: false, error: `API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('AILabAPI response received');

    // Check for API error in response
    if (data.error_code !== 0) {
      console.error('API returned error:', data);
      return NextResponse.json(
        { success: false, error: data.error_msg || 'Transformation failed' },
        { status: 400 }
      );
    }

    // Extract the result image
    let transformedImage: string | undefined;

    // Face filter returns image_url, lip color returns result_image, face beauty returns image_url, face slimming returns image_url, face attribute editing returns result.image
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
