import { NextRequest, NextResponse } from 'next/server';
import { AGE_CATEGORIES } from '@/lib/constants';
import { AgeCategory, AIModel, TransformResponse } from '@/types';

export const maxDuration = 120;

const POLLINATIONS_API_URL = 'https://image.pollinations.ai/prompt';
// Google AI Gemini API - v1 endpoint
const GOOGLE_GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models';

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

// Handle Google Gemini transformation with image generation
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
    // Use Gemini 2.5 Flash with image capabilities
    console.log('Using Gemini 2.5 Flash for image transformation...');
    
    // Extract base64 data
    const base64Data = image.includes('base64,') ? image.split('base64,')[1] : image;
    const mimeType = image.match(/data:([^;]+);/)?.[1] || 'image/jpeg';

    // Create prompt for age transformation
    const transformPrompt = `Analyze this person and create a detailed text prompt for an AI image generator to recreate them as a ${category.label} (aged ${category.ageRange}). ${category.prompt}

Describe: gender, ethnicity, hair (color, style), facial features, expression, clothing, background, and age-specific characteristics (wrinkles, skin texture, etc.). Make it photorealistic and detailed.`;

    const requestBody = {
      contents: [{
        parts: [
          {
            inline_data: {
              mime_type: mimeType,
              data: base64Data
            }
          },
          {
            text: transformPrompt
          }
        ]
      }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      }
    };

    const response = await fetch(
      `${GOOGLE_GEMINI_API_URL}/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API error:', response.status, errorData);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    let description = '';
    
    if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
      description = data.candidates[0].content.parts[0].text;
      console.log('Gemini generated description:', description.substring(0, 150) + '...');
    } else {
      throw new Error('No description generated by Gemini');
    }

    // Use the Gemini description to generate image with Pollinations
    const imagePrompt = `${description}. Professional photo quality, natural lighting, photorealistic, high detail, 4k`;
    const encodedPrompt = encodeURIComponent(imagePrompt);
    const imageUrl = `${POLLINATIONS_API_URL}/${encodedPrompt}?width=1024&height=1024&seed=${Date.now()}&nologo=true&enhance=true`;

    console.log('Generating image with Pollinations...');
    
    const imageResponse = await fetch(imageUrl);
    
    if (!imageResponse.ok) {
      throw new Error(`Image generation error: ${imageResponse.status}`);
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    const base64Image = Buffer.from(imageBuffer).toString('base64');
    const transformedImage = `data:image/png;base64,${base64Image}`;

    console.log('Successfully generated aged image');

    return NextResponse.json({
      success: true,
      transformedImage,
    });
  } catch (error) {
    console.error('Gemini transformation error:', error);
    throw error;
  }
}
