// Google Calendar API Configuration
// To set up:
// 1. Go to https://console.cloud.google.com/
// 2. Create a new project or select existing
// 3. Enable Google Calendar API
// 4. Create credentials (API Key for public calendars, OAuth2 for private)

export const CALENDAR_CONFIG = {
  // Replace with your Google Calendar API key
  API_KEY: import.meta.env.VITE_GOOGLE_CALENDAR_API_KEY,

  // Replace with your OAuth2 client ID (if accessing private calendars)
  CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',

  // Default calendar ID (use 'primary' for main calendar or specific calendar ID)
  CALENDAR_ID: import.meta.env.VITE_CALENDAR_ID,

  // Maximum number of events to fetch
  MAX_RESULTS: 20,
};

// Check if configuration is valid
export const isConfigured = () => {
  return Boolean(CALENDAR_CONFIG.API_KEY);
};

// Helper to validate configuration
export const validateConfig = () => {
  const missing = [];
  
  if (!CALENDAR_CONFIG.API_KEY) {
    missing.push('VITE_GOOGLE_CALENDAR_API_KEY');
  }
  
  if (missing.length > 0) {
    console.warn('Missing Google Calendar configuration:', missing.join(', '));
    return false;
  }
  
  return true;
};