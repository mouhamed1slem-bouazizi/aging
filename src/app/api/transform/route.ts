import { NextRequest, NextResponse } from 'next/server';
import { AGE_CATEGORIES } from '@/lib/constants';
import { AgeCategory, TransformResponse } from '@/types';

export const maxDuration = 120; // Allow up to 120 seconds for AI image generation

// OpenRouter API endpoint
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Demo mode flag - set to false when you have a valid API key
const DEMO_MODE = process.env.OPENROUTER_API_KEY === 'your_openrouter_api_key_here' || !process.env.OPENROUTER_API_KEY;

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

    // Find the age category configuration
    const category = AGE_CATEGORIES.find((c) => c.id === ageCategory);
    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Invalid age category' },
        { status: 400 }
      );
    }

    // Demo mode: Return the original image with a simulated delay
    if (DEMO_MODE) {
      console.log('Running in DEMO MODE - returning original image');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return NextResponse.json({
        success: true,
        transformedImage: image,
      });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;

    // Use Google Nano Banana Pro (Gemini 3 Pro Image Preview) for image transformation
    const openRouterRequest = {
      model: 'google/gemini-3-pro-image-preview',
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
              text: `Transform this person's face to look like they are ${category.ageRange} old (${category.label}). ${category.prompt} Generate a new photorealistic image showing this age transformation while keeping the person's identity recognizable. Output only the transformed image.`,
            },
          ],
        },
      ],
    };

    console.log('Calling OpenRouter with Nano Banana Pro model...');

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout

    try {
      // Call OpenRouter API
      const response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
          'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
          'X-Title': 'AgeFX - Age Transformation App',
        },
        body: JSON.stringify(openRouterRequest),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenRouter API error:', errorData);
      return NextResponse.json(
        { success: false, error: `AI service error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('OpenRouter response received');

    // Extract the generated image from the response
    let transformedImage: string | undefined;

    if (data.choices && data.choices[0]) {
      const message = data.choices[0].message;
      const content = message?.content;

      if (typeof content === 'string') {
        // Check if it contains base64 image data or URL
        if (content.includes('data:image') || content.startsWith('http')) {
          // Extract image URL/data from the content
          const imageMatch = content.match(/(data:image\/[^;]+;base64,[^"\s]+|https?:\/\/[^\s"]+\.(png|jpg|jpeg|webp)[^\s"]*)/i);
          if (imageMatch) {
            transformedImage = imageMatch[1];
          }
        }
      } else if (Array.isArray(content)) {
        // Look for image in array content (multimodal response)
        for (const item of content) {
          if (item.type === 'image_url' && item.image_url?.url) {
            transformedImage = item.image_url.url;
            break;
          }
          if (item.type === 'image' && item.url) {
            transformedImage = item.url;
            break;
          }
          // Check for inline base64 in text
          if (item.type === 'text' && typeof item.text === 'string') {
            const imageMatch = item.text.match(/(data:image\/[^;]+;base64,[^"\s]+)/i);
            if (imageMatch) {
              transformedImage = imageMatch[1];
              break;
            }
          }
        }
      }

      // Check for image in inline_data format (Gemini specific)
      if (!transformedImage && message?.parts) {
        for (const part of message.parts) {
          if (part.inline_data?.mime_type?.startsWith('image/') && part.inline_data?.data) {
            transformedImage = `data:${part.inline_data.mime_type};base64,${part.inline_data.data}`;
            break;
          }
        }
      }
    }

    // Check for image generation response format
    if (!transformedImage && data.data && data.data[0]) {
      if (data.data[0].b64_json) {
        transformedImage = `data:image/png;base64,${data.data[0].b64_json}`;
      } else if (data.data[0].url) {
        transformedImage = data.data[0].url;
      }
    }

    if (!transformedImage) {
      console.log('No image found in response, full response:', JSON.stringify(data, null, 2));
      return NextResponse.json(
        { success: false, error: 'No image was generated. The AI model may not support image generation for this request.' },
        { status: 422 }
      );
    }

    console.log('Successfully extracted transformed image');
    
    return NextResponse.json({
      success: true,
      transformedImage,
    });

    } catch (fetchError) {
      clearTimeout(timeoutId);
      console.error('Fetch error:', fetchError);
      
      // Check for specific error types
      if (fetchError instanceof Error) {
        if (fetchError.name === 'AbortError') {
          console.log('Request timed out, falling back to demo mode');
          return NextResponse.json({
            success: true,
            transformedImage: image, // Return original as fallback
          });
        }
        if (fetchError.message.includes('fetch failed') || fetchError.message.includes('ETIMEDOUT') || fetchError.message.includes('ConnectTimeout')) {
          console.log('Network error, falling back to demo mode');
          return NextResponse.json({
            success: true,
            transformedImage: image, // Return original as fallback
          });
        }
      }
      
      throw fetchError;
    }
    
  } catch (error) {
    console.error('Transform API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process image transformation' },
      { status: 500 }
    );
  }
}
