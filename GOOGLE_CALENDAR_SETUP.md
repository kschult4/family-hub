# Google Calendar Integration Setup

## Prerequisites
Your app now supports live Google Calendar integration! Here's how to set it up:

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google Calendar API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Calendar API" 
   - Click "Enable"

## Step 2: Create API Credentials

### For Public Calendars (API Key):
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy the API key
4. **Restrict the API key** (recommended):
   - Click "Restrict Key"
   - Under "API restrictions" select "Google Calendar API"
   - Under "Application restrictions" you can restrict by HTTP referrer

### For Private Calendars (OAuth2):
1. Go to "APIs & Services" > "Credentials" 
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Configure OAuth consent screen if prompted
4. Choose "Web application"
5. Add your domain to "Authorized JavaScript origins"
6. Copy the Client ID

## Step 3: Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your credentials:
   ```env
   # Required for any calendar access
   VITE_GOOGLE_CALENDAR_API_KEY=your_api_key_here
   
   # Optional: for private calendar access
   VITE_GOOGLE_CLIENT_ID=your_client_id_here
   
   # Optional: specific calendar ID (defaults to primary)
   VITE_CALENDAR_ID=primary
   ```

## Step 4: Calendar ID Setup

### Using Primary Calendar:
- Set `VITE_CALENDAR_ID=primary` (default)

### Using Specific Calendar:
1. Open Google Calendar
2. Go to calendar settings (click gear icon > Settings)
3. Select your calendar from the left sidebar
4. Scroll to "Integrate calendar"
5. Copy the "Calendar ID" (looks like: `example@gmail.com`)
6. Set `VITE_CALENDAR_ID=your_calendar_id@gmail.com`

## Step 5: Test the Integration

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Check the Calendar component:
   - If configured correctly: Shows "(Live)" and real events
   - If not configured: Shows "(Demo)" with sample events
   - If error: Shows warning banner with fallback to demo data

## Features

✅ **Automatic Fallback**: Uses demo data if API is unavailable  
✅ **Error Handling**: Shows helpful error messages  
✅ **Loading States**: Displays spinner while fetching  
✅ **Event Formatting**: Properly formats times and durations  
✅ **3-Day View**: Shows today, tomorrow, and day after  
✅ **Past Event Styling**: Dims completed events  

## Troubleshooting

### "API key not valid" Error:
- Check that Google Calendar API is enabled
- Verify API key is correct in `.env`
- Check API key restrictions

### "Calendar not found" Error:
- Verify calendar ID is correct
- Check calendar privacy settings
- For private calendars, ensure OAuth2 is set up

### "Quota exceeded" Error:
- You've hit the API usage limit
- Consider caching or reducing refresh frequency

### Still showing demo data:
- Check console for error messages
- Verify environment variables are loaded
- Restart development server after changing `.env`

## Security Notes

- API keys are visible in client-side code
- Only use API keys for public calendar data
- For private calendars, implement proper OAuth2 flow
- Consider backend proxy for additional security

## Next Steps

Want to enhance the integration? Consider:
- Adding refresh button
- Implementing OAuth2 for private calendars  
- Adding event creation functionality
- Caching events for offline support