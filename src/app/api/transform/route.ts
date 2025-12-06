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
    // First, list all available models to see what we can use
    console.log('Fetching list of available Gemini models...');
    const listModelsResponse = await fetch(
      `${GOOGLE_GEMINI_API_URL}?key=${apiKey}`,
      { method: 'GET' }
    );
    
    if (listModelsResponse.ok) {
      const modelsList = await listModelsResponse.json();
      console.log('Available Gemini models:');
      if (modelsList.models) {
        modelsList.models.forEach((model: any) => {
          console.log(`- ${model.name} (supports: ${model.supportedGenerationMethods?.join(', ') || 'N/A'})`);
        });
      }
    } else {
      console.log('Could not fetch models list');
    }

    // Use Gemini 2.5 Flash with image capabilities
    console.log('Using Gemini for image transformation...');
    
    // Extract base64 data
    const base64Data = image.includes('base64,') ? image.split('base64,')[1] : image;
    const mimeType = image.match(/data:([^;]+);/)?.[1] || 'image/jpeg';

    // Create prompt for age transformation
    const transformPrompt = `Describe this person for an AI image generator. Include: gender, ethnicity, hair (color/style), facial features, expression, clothing, background. Then describe how they would look at age ${category.ageRange} (${category.label}). ${category.prompt} Keep it under 100 words.`;

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
        maxOutputTokens: 2048,
      }
    };

    const response = await fetch(
      `${GOOGLE_GEMINI_API_URL}/gemini-2.5-flash:generateContent?key=${apiKey}`,
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
    console.log('Gemini response received:', JSON.stringify(data, null, 2));
    
    let description = '';
    
    // Try multiple ways to extract the text response
    if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
      description = data.candidates[0].content.parts[0].text;
      console.log('Gemini generated description:', description.substring(0, 150) + '...');
    } else if (data.candidates?.[0]?.output) {
      description = data.candidates[0].output;
      console.log('Gemini generated output:', description.substring(0, 150) + '...');
    } else if (data.text) {
      description = data.text;
      console.log('Gemini generated text:', description.substring(0, 150) + '...');
    } else {
      console.error('Could not find description in response structure:', JSON.stringify(data, null, 2));
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
