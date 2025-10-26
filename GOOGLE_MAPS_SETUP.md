# 🗺️ Google Maps Integration Setup Guide

## 🚨 Quick Fix: "Failed to fetch location data" Error

If you're seeing this error, here's the immediate solution:

### **Step 1: Check Your API Key**
1. Open `.env.local` file in your project root
2. Replace `your_google_maps_api_key_here` with your actual Google Maps API key
3. Make sure both lines have the same real API key:
   ```bash
   GOOGLE_MAPS_API_KEY=AIzaSyC_your_actual_key_here
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyC_your_actual_key_here
   ```

### **Step 2: Test the Fix**
1. Restart your dev server: `npm run dev`
2. Go to: `http://localhost:3000/debug-maps` (or :3001 if 3000 is in use)
3. Click "Test API" button
4. If it works, you'll see nearby stores!

### **Step 3: Get API Key** (if you don't have one)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project or select existing
3. Enable these APIs: Maps JavaScript API, Places API (New), Geocoding API
4. Go to Credentials → Create API Key
5. Copy the key to your `.env.local` file

---

## Overview
The Google Maps Platform integration enables ntwanaAfrika students to find nearby stores where they can redeem their Skill Coin rewards. This feature enhances the real-world impact of the gamified learning system.

## Features Implemented

### 🏪 **Store Locator**
- Find nearby food stores, pharmacies, and mobile shops
- Real-time distance calculation
- Store ratings and opening hours
- Interactive map view with custom markers

### 📍 **Location Services**
- Address geocoding for user input
- Current location detection (GPS)
- Reverse geocoding for coordinates to address
- Store details with contact information

### 🎯 **Redemption Flow**
- Category-based store filtering (food, hygiene, connectivity)
- Store selection from map or list
- Voucher generation with pickup location
- Google Maps directions integration

## Setup Instructions

### 1. **Google Cloud Console Setup**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the following APIs:
   - **Maps JavaScript API** (for map display)
   - **Places API (New)** (for nearby search)
   - **Geocoding API** (for address conversion)
   - **Directions API** (for navigation)

### 2. **API Key Configuration**

1. Go to **APIs & Services → Credentials**
2. Click **Create Credentials → API Key**
3. Copy your API key
4. **Restrict the API Key** (Security Best Practice):
   - Application restrictions: HTTP referrers
   - Add your domain: `yourdomain.com/*`
   - API restrictions: Select the 4 APIs above

### 3. **Environment Variables**

Create `.env.local` file with:
```bash
# Google Maps API Key (same key for both)
GOOGLE_MAPS_API_KEY=your_api_key_here
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here

# Existing Gemini AI (keep these)
GOOGLE_API_KEY=your_gemini_key_here
GEMINI_MODEL=gemini-1.5-flash
```

### 4. **Test the Integration**

1. Start the development server: `npm run dev`
2. Navigate to `/rewards`
3. Try redeeming any item
4. The location finder should appear
5. Enter an address or use current location
6. Verify nearby stores appear on map and list

## Usage Examples

### **For Food Rewards**
- Searches for: "grocery store", "supermarket", "food store"
- Categories: bread, maize meal, rice
- Partners: Ubuntu Bakery, Community Store, Local Market

### **For Hygiene Products**
- Searches for: "pharmacy", "health store", "convenience store"
- Categories: soap, toothpaste, shampoo
- Partners: Health Plus, Care Pharmacy, Beauty Store

### **For Connectivity**
- Searches for: "mobile store", "telecommunication", "airtime vendor"
- Categories: airtime, data bundles
- Partners: MTN, Vodacom, Cell C

## API Usage & Costs

### **Free Tier Limits** (per month)
- **Maps JavaScript API**: 28,000 loads
- **Places API**: 17,000 requests
- **Geocoding API**: 40,000 requests
- **Directions API**: 40,000 requests

### **Estimated Usage** (1000 active users)
- ~5,000 map loads per month
- ~3,000 places searches per month
- ~2,000 geocoding requests per month
- ~1,500 directions requests per month

**Total Cost**: ~$15-30/month with current usage patterns

## Error Handling

The integration includes robust error handling for:
- Missing API keys
- Location permission denied
- Network connectivity issues
- No stores found scenarios
- Invalid addresses

## Mobile Optimization

- Responsive design for all screen sizes
- Touch-friendly map controls
- GPS location access on mobile devices
- Optimized for African mobile data usage

## Security Features

- API key restrictions by domain
- No sensitive data exposure
- User location privacy protection
- Secure HTTPS-only operation

## African Market Considerations

- **Offline Fallback**: Basic address input when GPS unavailable
- **Data Efficiency**: Compressed responses and smart caching
- **Local Languages**: Address search in multiple African languages
- **Regional Focus**: Prioritized search results for African countries

## Future Enhancements

### **Phase 2 Features**
- Offline store database for remote areas
- WhatsApp integration for store notifications
- Mobile money integration for reward purchases
- Multi-language store information

### **Partnership Integration**
- Real-time inventory checking
- Partner store onboarding portal
- Automated voucher validation
- Analytics dashboard for partners

## Troubleshooting

### **Common Issues**

1. **"Maps not loading"**
   - Check API key in environment variables
   - Verify Maps JavaScript API is enabled
   - Check browser console for errors

2. **"No stores found"**
   - Try different search radius
   - Check if Places API is enabled
   - Verify location coordinates are valid

3. **"Location access denied"**
   - Guide user to enable location permissions
   - Provide manual address input option
   - Show clear error messages

### **Debug Mode**
Add to `.env.local` for detailed logging:
```bash
NEXT_PUBLIC_DEBUG_MAPS=true
```

## Support

For technical issues:
1. Check API quotas in Google Cloud Console
2. Review error logs in browser console
3. Test with different locations and reward types
4. Contact support with specific error messages

---

**Ready to transform learning into real-world rewards! 🌍🎓**
