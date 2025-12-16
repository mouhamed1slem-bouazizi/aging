# AI Portrait Studio - API Reference

This document contains all AILabTools API endpoints used in the application for reference and troubleshooting.

---

## 🔑 Authentication

All API requests require the following header:
```
ailabapi-api-key: YOUR_API_KEY
```

Get your API key: https://www.ailabtools.com/

---

## 📋 Table of Contents

- [Portrait Transformations](#portrait-transformations)
- [Image Enhancement](#image-enhancement)
- [Image Effects](#image-effects)
- [Image Editing](#image-editing)
- [Common APIs](#common-apis)

---

## 🎭 Portrait Transformations

### 1. Face Attribute Editing (Age & Gender)
- **Endpoint**: `https://www.ailabapi.com/api/portrait/effects/face-attribute-editing`
- **Method**: POST
- **Documentation**: https://www.ailabtools.com/docs/ai-portrait/effects/face-attribute-editing/api
- **Features**: Age transformation, Gender swap
- **Type**: Synchronous

### 2. Face Filters
- **Endpoint**: `https://www.ailabapi.com/api/portrait/effects/face-attribute-editing`
- **Method**: POST
- **Documentation**: https://www.ailabtools.com/docs/ai-portrait/effects/face-filter/api
- **Features**: 10 preset filters (natural, sweet, goddess, etc.)
- **Type**: Synchronous

### 3. Lips Color Changer
- **Endpoint**: `https://www.ailabapi.com/api/portrait/effects/lips-color-changer`
- **Method**: POST
- **Documentation**: https://www.ailabtools.com/docs/ai-portrait/effects/lips-color-changer/api
- **Features**: Custom RGBA lip color
- **Type**: Synchronous

### 4. Face Beauty
- **Endpoint**: `https://www.ailabapi.com/api/portrait/effects/face-beauty`
- **Method**: POST
- **Documentation**: https://www.ailabtools.com/docs/ai-portrait/effects/face-beauty/api
- **Features**: Smooth, whiten, sharpen controls
- **Type**: Synchronous

### 5. Face Slimming
- **Endpoint**: `https://www.ailabapi.com/api/portrait/effects/face-slimming`
- **Method**: POST
- **Documentation**: https://www.ailabtools.com/docs/ai-portrait/effects/face-slimming/api
- **Features**: Intensity-based face slimming
- **Type**: Synchronous

### 6. Skin Beauty
- **Endpoint**: `https://www.ailabapi.com/api/portrait/effects/skin-beauty`
- **Method**: POST
- **Documentation**: https://www.ailabtools.com/docs/ai-portrait/effects/skin-beauty/api
- **Features**: Whitening and smoothing controls
- **Type**: Synchronous

### 7. Face Fusion (Merge Portraits)
- **Endpoint**: `https://www.ailabapi.com/api/portrait/effects/face-fusion`
- **Method**: POST
- **Documentation**: https://www.ailabtools.com/docs/ai-portrait/effects/face-fusion/api
- **Features**: Merge two faces, template/merge modes
- **Type**: Synchronous

### 8. Smart Beauty
- **Endpoint**: `https://www.ailabapi.com/api/portrait/effects/smart-beauty`
- **Method**: POST
- **Documentation**: https://www.ailabtools.com/docs/ai-portrait/effects/smart-beauty/api
- **Features**: AI-powered automatic beautification
- **Type**: Synchronous

### 9. Hairstyle Changer
- **Endpoint**: `https://www.ailabapi.com/api/portrait/effects/hairstyle-editor-pro`
- **Method**: POST
- **Documentation**: https://www.ailabtools.com/docs/ai-portrait/effects/hairstyle-editor-pro/api
- **Features**: 24 hairstyle options, async processing
- **Type**: **Asynchronous** (requires polling)

### 10. Emotion Editor (Facial Expressions)
- **Endpoint**: `https://www.ailabapi.com/api/portrait/effects/emotion-editor`
- **Method**: POST
- **Documentation**: https://www.ailabtools.com/docs/ai-portrait/effects/emotion-editor/api
- **Features**: 8 expression types
- **Type**: Synchronous

### 11. Portrait Animation (Cartoon Yourself)
- **Endpoint**: `https://www.ailabapi.com/api/portrait/effects/portrait-animation`
- **Method**: POST
- **Documentation**: https://www.ailabtools.com/docs/ai-portrait/effects/portrait-animation/api
- **Features**: 4 cartoon styles
- **Type**: Synchronous (downloads from URL)

### 12. AI Face Enhancer
- **Endpoint**: `https://www.ailabapi.com/api/portrait/effects/enhance-face`
- **Method**: POST
- **Documentation**: https://www.ailabtools.com/docs/ai-portrait/effects/ai-face-enhancer/api
- **Features**: Automatic face quality enhancement (up to 10 faces)
- **Type**: Synchronous (downloads from URL)

### 13. Hitchcock Special Effects
- **Endpoint**: `https://www.ailabapi.com/api/portrait/effects/hitchcock-effects`
- **Method**: POST
- **Documentation**: https://www.ailabtools.com/docs/ai-portrait/effects/hitchcock-effects/api
- **Features**: Cinematic video effects (5 camera modes: Push, Wide-angle, Hitchcock, Swing, Bounce)
- **Type**: Synchronous (returns base64 video)

### 14. Live Photos
- **Endpoint**: `https://www.ailabapi.com/api/portrait/effects/live-photo`
- **Method**: POST
- **Documentation**: https://www.ailabtools.com/docs/ai-portrait/effects/live-photo/api
- **Features**: Animate static portraits with subtle movements (Avatar version or Full body version)
- **Type**: Synchronous (returns base64 video)

---

## ✨ Image Enhancement

### 14. Image Contrast Enhancement (Image Enhancer)
- **Endpoint**: `https://www.ailabapi.com/api/image/enhance/image-contrast-enhancement`
- **Method**: POST
- **Documentation**: https://www.ailabtools.com/docs/ai-image/enhance/image-contrast-enhancement/api
- **Features**: Automatic enhancement
- **Type**: Synchronous

### 14. Image Dehaze
- **Endpoint**: `https://www.ailabapi.com/api/image/enhance/image-dehaze`
- **Method**: POST
- **Documentation**: https://www.ailabtools.com/docs/ai-image/enhance/image-dehaze/api
- **Features**: Automatic dehaze
- **Type**: Synchronous

### 15. Image Sharpness Enhancement
- **Endpoint**: `https://www.ailabapi.com/api/image/enhance/image-sharpness-enhancement`
- **Method**: POST
- **Documentation**: https://www.ailabtools.com/docs/ai-image/enhance/image-sharpness-enhancement/api
- **Features**: Automatic sharpening
- **Type**: Synchronous

### 16. Stretch Image Recovery
- **Endpoint**: `https://www.ailabapi.com/api/image/enhance/stretch-image-recovery`
- **Method**: POST
- **Documentation**: https://www.ailabtools.com/docs/ai-image/enhance/stretch-image-recovery/api
- **Features**: Fix stretched/distorted images
- **Type**: Synchronous

### 17. Image Lossless Enlargement (Image Upscaler)
- **Endpoint**: `https://www.ailabapi.com/api/image/enhance/image-lossless-enlargement`
- **Method**: POST
- **Documentation**: https://www.ailabtools.com/docs/ai-image/enhance/image-lossless-enlargement/api
- **Features**: 2x/3x/4x upscaling, base/enhancement modes
- **Type**: Synchronous (downloads from URL)

---

## 🎨 Image Effects

### 18. Image Colorization (Photo Colorize)
- **Endpoint**: `https://www.ailabapi.com/api/image/effects/image-colorization`
- **Method**: POST
- **Documentation**: https://www.ailabtools.com/docs/ai-image/effects/image-colorization/api
- **Features**: Automatic colorization
- **Type**: Synchronous

### 19. Image Style Conversion (Photo to Painting)
- **Endpoint**: `https://www.ailabapi.com/api/image/effects/image-style-conversion`
- **Method**: POST
- **Documentation**: https://www.ailabtools.com/docs/ai-image/effects/image-style-conversion/api
- **Features**: 9 painting styles (cartoon, pencil, oil painting, etc.)
- **Type**: Synchronous

### 20. Image Style Migration (Style Transfer)
- **Endpoint**: `https://www.ailabapi.com/api/image/effects/image-style-migration`
- **Method**: POST
- **Documentation**: https://www.ailabtools.com/docs/ai-image/effects/image-style-migration/api
- **Features**: Transfer style between two images
- **Type**: Synchronous (downloads from URL)

### 21. AI Anime Generator
- **Endpoint**: `https://www.ailabapi.com/api/image/effects/ai-anime-generator`
- **Method**: POST
- **Documentation**: https://www.ailabtools.com/docs/ai-image/effects/ai-anime-generator/api
- **Features**: 9 anime styles
- **Type**: **Asynchronous** (requires polling)

---

## 🛠️ Image Editing

### 22. Photo Retouching
- **Endpoint**: `https://www.ailabapi.com/api/image/editing/photo-retouching`
- **Method**: POST
- **Documentation**: https://www.ailabtools.com/docs/ai-image/editing/photo-retouching/api
- **Features**: Style transfer with reference image
- **Type**: Synchronous (downloads from URL)

### 23. Image Cropping
- **Endpoint**: `https://www.ailabapi.com/api/image/editing/image-cropping`
- **Method**: POST
- **Documentation**: https://www.ailabtools.com/docs/ai-image/editing/image-cropping/api
- **Features**: Smart crop with custom dimensions
- **Type**: Synchronous (downloads from URL)

### 24. AI Image Extender (Non-Mask Expansion)
- **Endpoint**: `https://www.ailabapi.com/api/image/editing/ai-image-extender`
- **Method**: POST
- **Documentation**: https://www.ailabtools.com/docs/ai-image/editing/ai-image-extender/api
- **Features**: Expand images in all directions, advanced controls
- **Type**: Synchronous

### 25. Try-on Clothes
- **Endpoint**: `https://www.ailabapi.com/api/portrait/editing/try-on-clothes`
- **Method**: POST
- **Documentation**: https://www.ailabtools.com/docs/ai-portrait/editing/try-on-clothes/api
- **Features**: Virtual clothing try-on, supports upper/lower/full body
- **Type**: **Asynchronous** (requires polling)

---

## 🔧 Common APIs

### Querying Async Task Results
- **Endpoint**: `https://www.ailabapi.com/api/common/query-async-task-result`
- **Method**: GET
- **Documentation**: https://www.ailabtools.com/docs/ai-common/async-task-results/api
- **Usage**: Poll for results of async tasks (Hairstyle, Anime Generator)
- **Polling**: Every 5 seconds, max 60 attempts (5 minutes)

---

## 📊 Feature Summary

| Feature | Type | Parameters Required | Response Type |
|---------|------|-------------------|---------------|
| Age/Gender Transform | Sync | Age/Gender selection | Base64 image |
| Face Filters | Sync | Filter type, strength | Base64 image |
| Lips Color | Sync | RGBA values | Base64 image |
| Face Beauty | Sync | Smooth, whiten, sharpen | Base64 image |
| Face Slimming | Sync | Intensity | Base64 image |
| Skin Beauty | Sync | Whitening, smoothing | Base64 image |
| Face Fusion | Sync | Two images, mode | Base64 image |
| Smart Beauty | Sync | None (automatic) | Base64 image |
| Hairstyle Changer | **Async** | Hairstyle index | Task ID → URL |
| Facial Expressions | Sync | Expression type | Base64 image |
| Cartoon Yourself | Sync | Cartoon style | URL download |
| Face Enhancer | Sync | None (automatic) | URL download |
| Hitchcock Effects | Sync | Camera mode, video settings | Base64 video |
| Image Enhancer | Sync | None (automatic) | Base64 image |
| Image Dehaze | Sync | None (automatic) | Base64 image |
| Photo Colorize | Sync | None (automatic) | Base64 image |
| Image Sharpen | Sync | None (automatic) | Base64 image |
| Image Restore | Sync | None (automatic) | Base64 image |
| Photo Retouch | Sync | Two images | URL download |
| Image Crop | Sync | Width, height | URL download |
| Style Transfer | Sync | Two images | URL download |
| Image Upscaler | Sync | Factor, mode, format | URL download |
| Photo to Painting | Sync | Style option | Base64 image |
| Anime Generator | **Async** | Style index | Task ID → URL |
| Image Extender | Sync | Expansion ratios, settings | Base64 array |
| Try-on Clothes | **Async** | Clothing image, type | Task ID → URL |

---

## 🔍 Troubleshooting Tips

### Common Issues

1. **422 Error (Validation Failed)**
   - Check image format (JPEG, PNG, JPG)
   - Verify image size limits
   - Ensure all required parameters are provided
   - Validate parameter ranges

2. **Async Task Timeout**
   - Hairstyle and Anime Generator can take 2-5 minutes
   - Max polling: 60 attempts (5 minutes)
   - Check task status in response

3. **URL Download Failures**
   - URLs are temporary (valid for 24 hours)
   - Download immediately and convert to base64
   - Check network connectivity

4. **Base64 Issues**
   - Ensure proper prefix: `data:image/jpeg;base64,`
   - Strip existing prefix before adding new one
   - Check for array responses (Image Extender)

### Response Patterns

**Synchronous Base64 Response:**
```json
{
  "image": "base64_string"
}
```

**Synchronous URL Response:**
```json
{
  "data": {
    "url": "https://..."
  }
}
```

**Async Task Response:**
```json
{
  "task_id": "task_id_string",
  "task_type": "async"
}
```

**Async Result Response:**
```json
{
  "task_status": 2,
  "data": {
    "result_url": "https://..."
  }
}
```

---

## 📝 Notes

- All endpoints require `ailabapi-api-key` header
- Content-Type: `multipart/form-data` for all requests
- Maximum timeout for async operations: 300 seconds (5 minutes)
- Temporary URLs expire after 24 hours
- Async polling interval: 5 seconds

---

## 🔗 Useful Links

- **AILabTools Homepage**: https://www.ailabtools.com/
- **API Documentation**: https://www.ailabtools.com/docs
- **Get API Key**: https://www.ailabtools.com/
- **Pricing & Credits**: https://www.ailabtools.com/pricing

---

**Last Updated**: December 2024  
**Total Features**: 28 AI-powered transformations
