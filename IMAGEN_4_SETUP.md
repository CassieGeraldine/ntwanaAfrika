# Imagen 4 Setup Guide for eduFeed Career Image Generator

## Overview
This guide will help you set up Google Cloud's Imagen 4 for real AI image generation in the eduFeed career visualization feature.

## Prerequisites
- Google Cloud Platform account
- Project with billing enabled
- AI Platform API enabled

## Step-by-Step Setup

### 1. Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Note your Project ID

### 2. Enable Required APIs
Enable these APIs in your Google Cloud project:
```bash
# Using gcloud CLI
gcloud services enable aiplatform.googleapis.com
gcloud services enable compute.googleapis.com
```

Or enable via the Console:
- Go to APIs & Services > Library
- Search and enable "AI Platform API"
- Search and enable "Compute Engine API"

### 3. Create Service Account
1. Go to IAM & Admin > Service Accounts
2. Click "Create Service Account"
3. Name: `edufeed-imagen-service`
4. Description: `Service account for eduFeed Imagen 4 integration`
5. Click "Create and Continue"

### 4. Assign Roles
Assign these roles to your service account:
- `AI Platform Developer` (roles/ml.developer)
- `Storage Object Viewer` (roles/storage.objectViewer)

### 5. Create and Download Key
1. Click on your service account
2. Go to "Keys" tab
3. Click "Add Key" > "Create new key"
4. Choose JSON format
5. Download the key file
6. Save it securely (e.g., `./secrets/service-account-key.json`)

### 6. Configure Environment Variables

#### Option A: Using Service Account File
```bash
# In your .env.local file
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_CLOUD_LOCATION=us-central1
GOOGLE_APPLICATION_CREDENTIALS=/absolute/path/to/service-account-key.json

# Imagen 4 Configuration
IMAGEN_MODEL=imagen-3.0-generate-001
IMAGEN_LOCATION=us-central1
```

#### Option B: Using JSON in Environment Variable
```bash
# In your .env.local file
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_CLOUD_LOCATION=us-central1
GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"your-project-id","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"...","client_id":"...","auth_uri":"...","token_uri":"...","auth_provider_x509_cert_url":"...","client_x509_cert_url":"..."}

# Imagen 4 Configuration  
IMAGEN_MODEL=imagen-3.0-generate-001
IMAGEN_LOCATION=us-central1
```

### 7. Test Your Setup

#### Test 1: Basic API Connection
```bash
# Test with curl (replace PROJECT_ID with your actual project ID)
curl -X POST \
  -H "Authorization: Bearer $(gcloud auth application-default print-access-token)" \
  -H "Content-Type: application/json" \
  "https://us-central1-aiplatform.googleapis.com/v1/projects/PROJECT_ID/locations/us-central1/publishers/google/models/imagen-3.0-generate-001:predict" \
  -d '{
    "instances": [{
      "prompt": "A professional headshot of a software engineer in business attire"
    }],
    "parameters": {
      "sampleCount": 1
    }
  }'
```

#### Test 2: eduFeed Integration
1. Restart your Next.js development server
2. Go to dreamland page
3. Click "Try It" on any career
4. Upload a photo and generate image
5. Check browser console for any errors

## Pricing Information

### Imagen 3.0 Pricing (as of 2024)
- **Generate**: $0.020 per image (1024x1024)
- **Edit**: $0.030 per image
- **Upscale**: $0.006 per image

### Cost Estimation for eduFeed
- **Low usage** (10 images/day): ~$6/month
- **Medium usage** (50 images/day): ~$30/month  
- **High usage** (200 images/day): ~$120/month

## Security Best Practices

### 1. Service Account Security
```bash
# Set proper file permissions
chmod 600 service-account-key.json

# Add to .gitignore
echo "secrets/" >> .gitignore
echo "*.json" >> .gitignore
```

### 2. Environment Variables
- Never commit `.env.local` to version control
- Use different service accounts for dev/staging/production
- Regularly rotate service account keys

### 3. API Quotas and Limits
Set quotas to prevent unexpected costs:
1. Go to APIs & Services > Quotas
2. Search for "AI Platform"
3. Set daily request limits

## Troubleshooting

### Common Errors

#### 1. "Permission denied" or "401 Unauthorized"
- Check service account roles
- Verify API is enabled
- Ensure credentials path is correct

#### 2. "Project not found" or "404 Not Found"
- Verify GOOGLE_CLOUD_PROJECT_ID is correct
- Check project exists and billing is enabled
- Ensure you have access to the project

#### 3. "Quota exceeded"
- Check your quotas in Google Cloud Console
- Consider requesting quota increases
- Implement rate limiting in your application

#### 4. "Model not available in region"
- Try different regions: us-central1, us-east1, europe-west4
- Check Imagen availability by region

### Debug Mode
Enable detailed logging:
```bash
# Add to .env.local for debugging
GOOGLE_CLOUD_LOGGING_LEVEL=debug
NODE_ENV=development
```

## Production Deployment

### Vercel Deployment
```bash
# Set environment variables in Vercel dashboard
vercel env add GOOGLE_CLOUD_PROJECT_ID
vercel env add GOOGLE_SERVICE_ACCOUNT_KEY
vercel env add IMAGEN_MODEL
```

### Other Platforms
- Set environment variables in your hosting platform
- Ensure service account has minimum required permissions
- Consider using secret management services

## Alternative Models

If Imagen 4 is not available, you can use:
- `imagen-3.0-generate-001` (Imagen 3)
- `imagegeneration@002` (Legacy)

Update the `IMAGEN_MODEL` environment variable accordingly.

## Monitoring and Analytics

### 1. Enable Cloud Logging
```javascript
// Add to your API route for monitoring
console.log('Image generation request:', {
  careerTitle,
  timestamp: new Date().toISOString(),
  userId: 'anonymous' // Add user tracking if available
})
```

### 2. Track Usage
Monitor your usage in Google Cloud Console:
- Go to AI Platform > Model Garden
- Check usage metrics and costs

## Support

### Documentation
- [Imagen API Documentation](https://cloud.google.com/vertex-ai/docs/generative-ai/image/overview)
- [AI Platform Client Libraries](https://cloud.google.com/ai-platform/docs/reference)

### Community
- [Google Cloud Community](https://www.googlecloudcommunity.com/)
- [Stack Overflow - google-cloud-aiplatform](https://stackoverflow.com/questions/tagged/google-cloud-aiplatform)

## Next Steps

Once Imagen 4 is working:
1. Add image upscaling for higher quality
2. Implement image editing features
3. Add style variations (professional, casual, artistic)
4. Cache generated images to reduce costs
5. Add user galleries to save generated images

---

**Note**: This setup enables real AI image generation. Without proper configuration, the system will fall back to placeholder images, which is perfectly functional for development and testing.