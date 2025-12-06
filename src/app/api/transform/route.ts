import { NextRequest, NextResponse } from 'next/server';
import { AGE_CATEGORIES } from '@/lib/constants';
import { AgeCategory, AIModel, TransformResponse } from '@/types';

export const maxDuration = 120;

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const POLLINATIONS_API_URL = 'https://image.pollinations.ai/prompt';

// Model mapping for OpenRouter
const OPENROUTER_MODELS: Record<AIModel, string | null> = {
  'pollinations': null, // Uses Pollinations API directly
  'flux-2-pro': 'black-forest-labs/flux.2-pro',
  'gemini-3-pro': 'google/gemini-3-pro-image-preview',
  'gpt-5-mini': 'openai/gpt-5-image-mini',
  'gpt-5': 'openai/gpt-5-image',
  'gemini-2.5-flash': 'google/gemini-2.5-flash-image',
};

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

    // Use OpenRouter models (requires API key)
    return await handleOpenRouterTransform(image, category, model);
    
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

// Handle OpenRouter model transformation (requires API key)
async function handleOpenRouterTransform(
  image: string,
  category: { label: string; ageRange: string; prompt: string },
  model: AIModel
): Promise<NextResponse<TransformResponse>> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  
  if (!apiKey || apiKey === 'your_openrouter_api_key_here') {
    return NextResponse.json(
      { 
        success: false, 
        error: 'OpenRouter API key not configured. Please add OPENROUTER_API_KEY to environment variables or use Pollinations.AI (free).' 
      },
      { status: 400 }
    );
  }

  const openRouterModel = OPENROUTER_MODELS[model];
  if (!openRouterModel) {
    return NextResponse.json(
      { success: false, error: 'Invalid model selected' },
      { status: 400 }
    );
  }

  try {
    const requestPayload = {
      model: openRouterModel,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: {
                url: image.startsWith('data:') ? image : `data:image/jpeg;base64,${image}`,
              },
            },
            {
              type: 'text',
              text: `Transform this person to appear ${category.ageRange} old (${category.label}). ${category.prompt} Generate a photorealistic image.`,
            },
          ],
        },
      ],
    };

    console.log(`Calling OpenRouter with model: ${openRouterModel}`);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 90000);

    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        'X-Title': 'AgeFX - Age Transformation App',
      },
      body: JSON.stringify(requestPayload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenRouter API error:', response.status, errorData);
      throw new Error(`AI service error: ${response.status}`);
    }

    const data = await response.json();
    console.log('OpenRouter response received');

    // Try to extract generated image from response
    let transformedImage: string | undefined;

    if (data.choices && data.choices[0]) {
      const message = data.choices[0].message;
      const content = message?.content;

      // Check various response formats
      if (typeof content === 'string') {
        const imageMatch = content.match(/(data:image\/[^;]+;base64,[^"\s]+|https?:\/\/[^\s"]+\.(png|jpg|jpeg|webp)[^\s"]*)/i);
        if (imageMatch) {
          transformedImage = imageMatch[1];
        }
      } else if (Array.isArray(content)) {
        for (const item of content) {
          if (item.type === 'image_url' && item.image_url?.url) {
            transformedImage = item.image_url.url;
            break;
          }
        }
      }

      // Check for Gemini inline_data format
      if (!transformedImage && message?.parts) {
        for (const part of message.parts) {
          if (part.inline_data?.mime_type?.startsWith('image/') && part.inline_data?.data) {
            transformedImage = `data:${part.inline_data.mime_type};base64,${part.inline_data.data}`;
            break;
          }
        }
      }
    }

    // Check for OpenAI image generation format
    if (!transformedImage && data.data && data.data[0]) {
      if (data.data[0].b64_json) {
        transformedImage = `data:image/png;base64,${data.data[0].b64_json}`;
      } else if (data.data[0].url) {
        transformedImage = data.data[0].url;
      }
    }

    if (!transformedImage) {
      console.log('No image found in response. Model may not support image generation.');
      throw new Error('No image was generated. This model may not support image output. Try Pollinations.AI or another model.');
    }

    console.log('Successfully extracted transformed image');

    return NextResponse.json({
      success: true,
      transformedImage,
    });
  } catch (error) {
    console.error('OpenRouter transformation error:', error);
    throw error;
  }
}
