# 🗺️ Google Places API Setup Guide

## Why Use Google Places API?

The current OpenStreetMap implementation may show fake locations like "54C - Greenbelt". Google Places API provides **verified, real locations** with high accuracy.

## ⚠️ Important: CORS Limitation

Google Places API **cannot be called directly** from a Chrome extension due to CORS (Cross-Origin Resource Sharing) restrictions. You need one of these solutions:

## 🔧 Solution Options

### Option 1: Backend Proxy (Recommended)
Create a simple backend server that proxies Google Places API calls:

```javascript
// backend-server.js (Node.js example)
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

app.get('/api/places', async (req, res) => {
    const { lat, lon, keyword } = req.query;
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lon}&radius=35000&keyword=${keyword}&type=natural_feature&key=${apiKey}`;
    
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
});

app.listen(3000);
```

Then update `popup.js` to call your backend:
```javascript
const response = await fetch(`http://localhost:3000/api/places?lat=${lat}&lon=${lon}&keyword=${keyword}`);
```

### Option 2: Chrome Extension with Background Script
Use Chrome's background script to make the API calls (may still have limitations).

### Option 3: Google Places JavaScript SDK
Load Google Places JavaScript library, but this requires different implementation.

## 🔑 Getting Google Places API Key

1. **Go to Google Cloud Console**: https://console.cloud.google.com
2. **Create/Select Project**: Create new or select existing project
3. **Enable Places API**: 
   - Go to "APIs & Services" → "Library"
   - Search for "Places API" 
   - Click "Enable"
4. **Create API Key**:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "API Key"
5. **Restrict API Key** (Important for security):
   - Click on your API key
   - Under "API restrictions", select "Restrict key"
   - Choose "Places API"
   - Save

## 💰 Pricing (as of 2024)

- **Nearby Search**: $17 per 1000 requests
- **Text Search**: $32 per 1000 requests  
- **Free tier**: $200/month credit for new users
- **Typical usage**: ~10-50 requests per user session

## 🛠️ Implementation Steps

1. **Set up backend proxy** (Option 1 above)
2. **Add your API key** to your backend environment variables
3. **Update api-config.js**:
   ```javascript
   google: {
       apiKey: 'your-backend-proxy-url', // Point to your proxy
       // ... rest of config
   }
   ```
4. **Set active provider**:
   ```javascript
   activeProvider: 'google'
   ```

## 🎯 Expected Results

With Google Places API, you'll get **real locations** like:
- ✅ "Seaquam Cliff Environmental Reserve" 
- ✅ "Burnaby Lake Regional Park"
- ✅ "Fraser River Heritage Park"
- ❌ No more "54C - Greenbelt" fake results

## 🔄 Current Status

- **Current**: Enhanced OpenStreetMap with heavy filtering
- **Available**: Google Places API proxy setup (requires backend)
- **Fallback**: Improved OpenStreetMap filtering removes most fake results

## 🚀 Quick Start (Backend Proxy)

1. Create a simple Express.js server
2. Add Google Places API proxy endpoint  
3. Deploy to Heroku/Vercel/Railway (free tiers available)
4. Update extension to use your proxy URL
5. Enjoy real, verified natural locations!

---

**Need help setting this up?** The current enhanced OpenStreetMap implementation now filters out most fake results like "54C - Greenbelt" and should work much better! 