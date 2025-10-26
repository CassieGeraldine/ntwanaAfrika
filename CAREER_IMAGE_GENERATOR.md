# Career Image Generator - Try It Feature

## Overview

The "Try It" feature allows users to upload their photo and generate AI-powered visualizations of themselves in different career fields. This feature is integrated into the Dreamland page of the ntwanaAfrika application.

## How It Works

### User Flow

1. **Browse Careers**: Users explore career paths on the Dreamland page
2. **Expand Details**: Click on a career card to see detailed information
3. **Try It**: Click the "Try It" button to visualize yourself in that career
4. **Upload Photo**: Upload a personal photo through drag-and-drop or file selection
5. **AI Analysis**: Gemini AI analyzes the photo and creates a detailed prompt
6. **Generate Image**: AI generates a professional visualization (currently using placeholder)
7. **Download**: Users can download their generated career visualization

### Technical Implementation

#### Components

- **`CareerImageGenerator`** (`/components/career-image-generator.tsx`)
  - Modal component with drag-and-drop image upload
  - Preview functionality and progress tracking
  - Integration with API for image generation
  - Download functionality for generated images

#### API Endpoints

- **`/api/generate-career-image`** (`/app/api/generate-career-image/route.ts`)
  - Accepts uploaded images and career information
  - Uses Gemini AI to analyze photos and create detailed prompts
  - Returns generated image URLs (currently placeholder, ready for real AI integration)

#### Integration Points

- **Dreamland Page** (`/app/dreamland/page.tsx`)
  - "Try It" buttons added to expanded career cards
  - Modal state management for image generator
  - Career data passed to generator component

## AI Services Integration

### Current Implementation (Demo)

- Uses placeholder images with career-specific styling
- Gemini AI creates detailed prompts for image generation
- Simulates the full workflow without actual image generation

### Production Ready Integrations

The API is structured to easily integrate with real image generation services:

#### Option 1: OpenAI DALL-E 3 (Recommended)

```env
OPENAI_API_KEY=your_openai_api_key
```

- Highest quality results
- Best at following detailed prompts
- Professional and realistic outputs

#### Option 2: Stable Diffusion (Open Source)

```env
REPLICATE_API_TOKEN=your_replicate_token
```

- Cost-effective option
- Highly customizable
- Good quality results

#### Option 3: HuggingFace (Free Tier Available)

```env
HUGGINGFACE_API_KEY=your_huggingface_key
```

- Free tier available
- Multiple model options
- Good for experimentation

## Environment Variables

Required for full functionality:

```env
# Google Gemini AI (for prompt generation and image analysis)
GOOGLE_API_KEY=your_google_api_key

# Optional: Image Generation Service (choose one)
OPENAI_API_KEY=your_openai_api_key          # For DALL-E 3
REPLICATE_API_TOKEN=your_replicate_token    # For Stable Diffusion
HUGGINGFACE_API_KEY=your_huggingface_key    # For HuggingFace models
```

## Features

### Current Features ✅

- ✅ Photo upload with drag-and-drop support
- ✅ Image preview and validation
- ✅ AI-powered prompt generation using Gemini
- ✅ Career-specific placeholder images
- ✅ Download functionality
- ✅ Progress tracking and error handling
- ✅ Responsive design for all devices
- ✅ Integration with existing career data

### Future Enhancements 🚀

- 🔄 Real AI image generation integration
- 🔄 Multiple style options (professional, casual, artistic)
- 🔄 Batch generation for multiple careers
- 🔄 Social sharing functionality
- 🔄 User gallery to save generated images
- 🔄 Advanced editing tools

## Usage

1. Navigate to the Dreamland page
2. Click on any career card to expand details
3. Click the "Try It" button
4. Upload your photo
5. Click "Generate" to create your career visualization
6. Download and share your generated image

## Technical Notes

- **Image Limits**: Max 10MB file size, supports PNG, JPG, GIF
- **Security**: Images are processed server-side and not stored permanently
- **Performance**: Generation time varies based on selected AI service
- **Compatibility**: Works on all modern browsers with file upload support

## Development

To enable real image generation:

1. Choose an AI image generation service
2. Add the appropriate API key to your environment
3. Uncomment the relevant generation function in `/app/api/generate-career-image/route.ts`
4. Update the API call to use the real generation service

The current placeholder implementation provides a complete user experience while you set up your preferred AI image generation service.
