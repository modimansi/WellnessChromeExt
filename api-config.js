// API Configuration for Places Search
// This file contains settings for different places API providers

window.API_CONFIG = window.API_CONFIG || {
    // Current active provider
    activeProvider: 'openstreetmap', // Options: 'openstreetmap', 'google', 'foursquare'
    
    // OpenStreetMap Nominatim (Free, no API key required)
    openstreetmap: {
        name: 'OpenStreetMap Nominatim',
        baseUrl: 'https://nominatim.openstreetmap.org',
        requiresApiKey: false,
        rateLimit: '1 request per second',
        documentation: 'https://nominatim.org/release-docs/develop/api/Search/',
        pros: ['Free', 'No API key required', 'Good coverage', 'City autocomplete support'],
        cons: ['Rate limited', 'Less detailed business info', 'Basic search'],
        features: {
            autocomplete: true,
            placeSearch: true,
            coordinates: true
        }
    },
    
    // Google Places API (Requires API key, very comprehensive)
    google: {
        name: 'Google Places API',
        baseUrl: 'https://maps.googleapis.com/maps/api/place',
        requiresApiKey: true,
        apiKey: '', // Add your Google Places API key here
        rateLimit: 'Based on billing plan',
        documentation: 'https://developers.google.com/maps/documentation/places/web-service',
        pros: ['Comprehensive data', 'High accuracy', 'Rich details', 'Photos'],
        cons: ['Requires API key', 'Paid service', 'Complex setup']
    },
    
    // Foursquare API (Free tier available)
    foursquare: {
        name: 'Foursquare Places API',
        baseUrl: 'https://api.foursquare.com/v3',
        requiresApiKey: true,
        apiKey: '', // Add your Foursquare API key here
        rateLimit: '1000 requests per day (free tier)',
        documentation: 'https://developer.foursquare.com/docs',
        pros: ['Good free tier', 'Business focused', 'User reviews'],
        cons: ['Requires API key', 'Limited free requests', 'Less nature-focused']
    }
};

// Instructions for setting up each API provider
window.SETUP_INSTRUCTIONS = window.SETUP_INSTRUCTIONS || {
    openstreetmap: {
        steps: [
            'No setup required! OpenStreetMap Nominatim is free and works out of the box.',
            'Just make sure you respect the rate limits (1 request per second).',
            'For production use, consider setting up your own Nominatim instance.'
        ]
    },
    
    google: {
        steps: [
            '1. Go to Google Cloud Console (https://console.cloud.google.com)',
            '2. Create a new project or select an existing one',
            '3. Enable the Places API',
            '4. Create credentials (API key)',
            '5. Restrict the API key to Places API only',
            '6. Add your API key to api-config.js',
            '7. Update popup.js to use Google Places API methods'
        ],
        estimatedCost: '$17 per 1000 requests (as of 2024)',
        freeQuota: '$200 monthly credit for new users'
    },
    
    foursquare: {
        steps: [
            '1. Go to Foursquare Developer Portal (https://developer.foursquare.com)',
            '2. Create a developer account',
            '3. Create a new app',
            '4. Get your API key',
            '5. Add your API key to api-config.js',
            '6. Update popup.js to use Foursquare API methods'
        ],
        freeQuota: '1000 requests per day'
    }
};

// Export for use in popup.js (already available on window object)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { API_CONFIG: window.API_CONFIG, SETUP_INSTRUCTIONS: window.SETUP_INSTRUCTIONS };
}

/* 
USAGE INSTRUCTIONS:

1. CURRENT SETUP (OpenStreetMap):
   - Works immediately, no setup required
   - Good for development and testing
   - Rate limited to 1 request per second
   - Includes city autocomplete and place search

2. TO UPGRADE TO GOOGLE PLACES:
   - Follow google setup steps above
   - Add your API key to API_CONFIG.google.apiKey
   - Change API_CONFIG.activeProvider to 'google'
   - Implement Google Places API methods in popup.js

3. TO UPGRADE TO FOURSQUARE:
   - Follow foursquare setup steps above
   - Add your API key to API_CONFIG.foursquare.apiKey
   - Change API_CONFIG.activeProvider to 'foursquare'
   - Implement Foursquare API methods in popup.js

4. FOR PRODUCTION:
   - Consider using Google Places for best accuracy
   - Implement proper error handling
   - Add request caching to reduce API calls
   - Monitor usage and costs
*/ 