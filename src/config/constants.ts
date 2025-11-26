// Google Places API Configuration
// To use real Google Places API:
// 1. Go to https://console.cloud.google.com/
// 2. Create a new project or select existing one
// 3. Enable "Places API" in APIs & Services
// 4. Create credentials (API Key) in APIs & Services > Credentials
// 5. Replace the value below with your API key
// 6. For production, restrict the API key to your app's bundle ID

export const GOOGLE_PLACES_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY || '';

// Note: For security, use environment variables in production
// Create a .env file with: EXPO_PUBLIC_GOOGLE_PLACES_API_KEY=your_key_here

// Backend API Configuration
// For local development, use http://localhost:5000
// For production, use your deployed backend URL
export const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:5000';

