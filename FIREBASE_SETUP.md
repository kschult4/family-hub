# Firebase Setup for Family Hub

This app now uses Firebase Realtime Database for real-time synchronization between devices. Follow these steps to set up Firebase:

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create a project" or "Add project"
3. Enter a project name (e.g., "family-hub")
4. Continue through the setup process

## 2. Enable Realtime Database

1. In your Firebase project, navigate to "Realtime Database" in the left sidebar
2. Click "Create Database"
3. Choose "Start in test mode" for now (we'll configure security later)
4. Select a database location (choose one close to your users)

## 3. Get Your Firebase Configuration

1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps" section
3. Click "Add app" and choose the web icon (`</>`)
4. Register your app with a nickname
5. Copy the Firebase configuration object

## 4. Update Your App Configuration

1. Open `src/config/firebase.js`
2. Replace the placeholder values with your actual Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com/",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

## 5. Configure Security Rules (Optional but Recommended)

In the Firebase Console, go to Realtime Database > Rules and update them:

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

For production, you should implement proper authentication and more restrictive rules.

## 6. Test the Setup

1. Start your development server: `npm run dev`
2. Add items on one device
3. Open the app on another device - changes should sync in real-time

## Features

- **Real-time sync**: Changes appear instantly on all devices
- **Offline support**: Firebase handles offline caching
- **Cross-platform**: Works on phones, tablets, and desktop browsers

## Troubleshooting

- If you see connection errors, check your internet connection and Firebase config
- Make sure your database rules allow read/write access
- Check the browser console for detailed error messages