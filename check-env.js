// Script to check environment variables during build
console.log('=== Environment Variables Check ===');
console.log('VITE_GOOGLE_CALENDAR_API_KEY:', process.env.VITE_GOOGLE_CALENDAR_API_KEY ? 'SET (starts with: ' + process.env.VITE_GOOGLE_CALENDAR_API_KEY.substring(0, 10) + '...)' : 'NOT SET');
console.log('VITE_CALENDAR_ID:', process.env.VITE_CALENDAR_ID || 'NOT SET');
console.log('===================================');
