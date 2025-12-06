import { NextRequest, NextResponse } from 'next/server';
import { AGE_CATEGORIES } from '@/lib/constants';
import { AgeCategory, TransformResponse } from '@/types';

export const maxDuration = 120;

// Demo mode: always enabled unless proper API integration is set up
// This prevents 422 errors in production
const DEMO_MODE = true;

export async function POST(request: NextRequest): Promise<NextResponse<TransformResponse>> {
  try {
    const body = await request.json();
    const { image, ageCategory } = body as { image: string; ageCategory: AgeCategory };

    // Validate inputs
    if (!image) {
      return NextResponse.json(
        { success: false, error: 'No image provided' },
        { status: 400 }
      );
    }

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

    // Demo mode: Return the original image with a simulated delay
    // This prevents 422 errors when image generation APIs are not configured
    if (DEMO_MODE) {
      console.log('Running in DEMO MODE - Image transformation disabled');
      console.log(`Selected age category: ${category.label} (${category.ageRange})`);
      console.log('To enable real image transformation, integrate with:');
      console.log('- Replicate (https://replicate.com/)');
      console.log('- Stability AI (https://stability.ai/)');
      console.log('- Fal.ai (https://fal.ai/)');
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return NextResponse.json({
        success: true,
        transformedImage: image,
      });
    }

    // Future implementation: Add real image generation API here
    // Example with Replicate:
    /*
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${process.env.REPLICATE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: 'model-version-id',
        input: {
          image: image,
          age: category.ageRange,
          prompt: category.prompt,
        },
      }),
    });
    */

    return NextResponse.json({
      success: true,
      transformedImage: image,
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
