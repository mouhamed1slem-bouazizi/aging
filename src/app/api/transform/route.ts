import { NextRequest, NextResponse } from 'next/server';
import { AGE_CATEGORIES } from '@/lib/constants';
import { AgeCategory, AIModel, TransformResponse } from '@/types';

export const maxDuration = 120;

const POLLINATIONS_API_URL = 'https://image.pollinations.ai/prompt';
const GOOGLE_AI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:generateImages';

export async function POST(request: NextRequest): Promise<NextResponse<TransformResponse>> {
  try {
    const body = await request.json();
    const { image, ageCategory, model = 'pollinations' } = body as { 
      image: string; 
      ageCategory: AgeCategory;
      model?: AIModel;
    };

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

    console.log(`Using AI model: ${model} for age category: ${category.label}`);

    // Use Pollinations.AI (free, no API key required)
    if (model === 'pollinations') {
      return await handlePollinationsTransform(image, category);
    }

    // Use Google Gemini Imagen 3
    if (model === 'gemini-imagen') {
      return await handleGeminiImagenTransform(image, category);
    }

    // Fallback
    return NextResponse.json(
      { success: false, error: 'Invalid model selected' },
      { status: 400 }
    );
    
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

// Handle Pollinations.AI transformation (free)
async function handlePollinationsTransform(
  image: string, 
  category: { label: string; ageRange: string; prompt: string }
): Promise<NextResponse<TransformResponse>> {
  try {
    // Extract base64 data if it's a data URL
    const base64Data = image.includes('base64,') ? image.split('base64,')[1] : image;
    
    // Create a detailed prompt for age transformation
    const prompt = encodeURIComponent(
      `A photorealistic portrait of a person aged ${category.ageRange} (${category.label}). ` +
      `${category.prompt} High quality, professional photography, detailed facial features, ` +
      `natural lighting, 4k resolution`
    );

    // Pollinations.AI generates images from text prompts
    // Note: It doesn't take input images, so this will generate a new aged person
    const imageUrl = `${POLLINATIONS_API_URL}/${prompt}?width=1024&height=1024&seed=${Date.now()}&nologo=true`;

    console.log('Generating image with Pollinations.AI...');
    
    // Fetch the generated image
    const response = await fetch(imageUrl);
    
    if (!response.ok) {
      throw new Error(`Pollinations API error: ${response.status}`);
    }

    // Convert to base64
    const imageBuffer = await response.arrayBuffer();
    const base64Image = Buffer.from(imageBuffer).toString('base64');
    const transformedImage = `data:image/png;base64,${base64Image}`;

    console.log('Successfully generated image with Pollinations.AI');

    return NextResponse.json({
      success: true,
      transformedImage,
    });
  } catch (error) {
    console.error('Pollinations transformation error:', error);
    throw error;
  }
}

// Handle Google Gemini Imagen transformation
async function handleGeminiImagenTransform(
  image: string,
  category: { label: string; ageRange: string; prompt: string }
): Promise<NextResponse<TransformResponse>> {
  const apiKey = process.env.GOOGLE_AI_API_KEY;
  
  if (!apiKey) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Google AI API key not configured. Please add GOOGLE_AI_API_KEY to environment variables.' 
      },
      { status: 400 }
    );
  }

  try {
    // Create a detailed prompt for age transformation
    const prompt = `A photorealistic portrait of a person aged ${category.ageRange} (${category.label}). ` +
      `${category.prompt} Professional photo quality, natural lighting, detailed facial features showing ` +
      `age-appropriate characteristics, high resolution, 4k quality`;

    console.log('Generating image with Google Gemini Imagen 3...');

    const requestBody = {
      prompt: prompt,
      number_of_images: 1,
      aspect_ratio: '1:1',
      safety_filter_level: 'block_some',
      person_generation: 'allow_adult',
    };

    const response = await fetch(`${GOOGLE_AI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Google AI API error:', response.status, errorData);
      throw new Error(`Google AI service error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Google Gemini response received');

    // Extract the generated image
    let transformedImage: string | undefined;

    if (data.generatedImages && data.generatedImages[0]) {
      const imageData = data.generatedImages[0];
      
      // Check for base64 image data
      if (imageData.bytesBase64Encoded) {
        transformedImage = `data:image/png;base64,${imageData.bytesBase64Encoded}`;
      } else if (imageData.imageBytes) {
        transformedImage = `data:image/png;base64,${imageData.imageBytes}`;
      }
    }

    if (!transformedImage) {
      console.log('No image found in Google AI response:', JSON.stringify(data, null, 2));
      throw new Error('No image was generated by Google AI');
    }

    console.log('Successfully generated image with Google Gemini Imagen');

    return NextResponse.json({
      success: true,
      transformedImage,
    });
  } catch (error) {
    console.error('Google Gemini transformation error:', error);
    throw error;
  }
}
