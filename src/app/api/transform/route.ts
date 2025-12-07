import { NextRequest, NextResponse } from 'next/server';
import { AGE_CATEGORIES, AILAB_API_URL, GENDER_OPTIONS } from '@/lib/constants';
import { AgeCategory, GenderOption, TransformationType, TransformResponse } from '@/types';

export const maxDuration = 60;

export async function POST(request: NextRequest): Promise<NextResponse<TransformResponse>> {
  try {
    const body = await request.json();
    const { image, transformationType, ageCategory, gender } = body as { 
      image: string; 
      transformationType: TransformationType;
      ageCategory?: AgeCategory;
      gender?: GenderOption;
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

    let actionType: string;
    let target: string | undefined;

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
    formData.append('action_type', actionType);
    if (target) {
      formData.append('target', target);
    }

    // Call AILabAPI directly (new API doesn't use RapidAPI)
    const response = await fetch(AILAB_API_URL, {
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

    // Extract the result image (now returns base64 directly)
    let transformedImage: string | undefined;

    if (data.result?.image) {
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
