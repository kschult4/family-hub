# Family Hub Dashboard

A Progressive Web App (PWA) designed as an interactive family command center for managing daily tasks, shopping lists, meal planning, and household coordination.

![React](https://img.shields.io/badge/React-18.2-blue)
![Vite](https://img.shields.io/badge/Vite-7.1-purple)
![Firebase](https://img.shields.io/badge/Firebase-12.1-orange)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-teal)

## Features

### Shopping List Management
- Real-time collaborative shopping list with Firebase synchronization
- Checkbox functionality to mark items as purchased
- Visual styling with colorful backgrounds and decorative patterns
- Voice control: "Add [item] to shopping list"
- Auto-delete completed items
- Mobile-optimized interface

### Task Management System
- Frequency-based tasks (Daily, Weekly, Monthly, Quarterly)
- Color-coded by frequency for quick identification
- Recurring task support with automatic reset
- Long-press to edit existing tasks
- Visual completion animations
- Pre-configured default tasks for common household activities

### Google Calendar Integration
- Displays next 3 days of calendar events (today, tomorrow, day after tomorrow)
- Live sync with Google Calendar API
- Event duration formatting
- Past events shown with reduced opacity
- Automatic fallback to demo data if API not configured

### Weekly Meal Planning
- Visual meal plan for the entire week (Monday-Sunday)
- Featured card showing today's meal with background imagery
- Background images rotate every 2 hours for variety
- Scrollable week view
- Easy meal editing via modal interface

### Weather & Moon Phase
- Live weather data from Open-Meteo API
- Current temperature and weather conditions with icons
- Moon phase calculator with 8 phases and corresponding icons
- No API key required for weather

### Voice Control
- Hands-free operation via Web Speech API
- Microphone button for voice commands (desktop only)
- Supported commands:
  - "Add [item] to shopping list"
  - "Add task [description]"
- Visual feedback during listening
- Confidence scoring for accurate command processing

### Progressive Web App
- Installable on mobile devices (iOS, Android) and desktop
- Offline functionality with service worker
- Fast loading with intelligent caching
- Works without internet connection for core features

## Tech Stack

- **Frontend**: React 18.2, Vite 7.1
- **Styling**: TailwindCSS 3.4, Framer Motion 12.2
- **Backend**: Firebase Realtime Database
- **APIs**: Google Calendar API, Open-Meteo Weather API, Web Speech API
- **Icons**: Lucide React
- **Deployment**: Vercel (configured)

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- Google Calendar API key (optional, for calendar features)
- Firebase project (database URL provided in config)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd family-hub
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```bash
# Google Calendar API (optional)
VITE_GOOGLE_CALENDAR_API_KEY=your_api_key_here
VITE_GOOGLE_CLIENT_ID=your_client_id_here  # Optional
VITE_CALENDAR_ID=your_calendar_id@gmail.com  # Optional

# Base URL (for deployment)
VITE_BASE_URL=/  # Optional
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

```bash
npm run build
npm run preview
```

## Configuration

### Firebase Setup
The app is pre-configured to connect to the Firebase Realtime Database at:
- Project: `family-hub-dashboard`
- Database URL: `https://family-hub-dashboard-default-rtdb.firebaseio.com`

Firebase configuration is located in [src/config/firebase.js](src/config/firebase.js).

### Google Calendar API
To enable calendar features:

1. Create a Google Cloud project
2. Enable the Google Calendar API
3. Generate an API key
4. Add the API key to your `.env` file as `VITE_GOOGLE_CALENDAR_API_KEY`

Calendar configuration is located in [src/config/calendar.js](src/config/calendar.js).

If no API key is provided, the app will use mock/demo data.

## Project Structure

```
family-hub/
├── src/
│   ├── components/          # UI Components
│   ├── views/               # Page-level views
│   ├── hooks/               # Custom React hooks
│   ├── services/            # External API services
│   ├── config/              # Configuration files
│   ├── App.jsx              # Main app component
│   └── main.jsx             # React entry point
├── public/                  # Static assets (icons, images)
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run unit tests

## Browser Support

- Chrome/Edge (full support including voice control)
- Firefox (all features except voice control)
- Safari (desktop: full support; mobile: no voice control)
- Modern browsers with ES2015+ support

## Voice Control Requirements

Voice control requires:
- HTTPS connection (or localhost for development)
- Microphone permissions
- Desktop browser (feature disabled on mobile)
- Chrome, Edge, or Safari

## Deployment

The app is configured for deployment on Vercel:

1. Connect your repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy

Configuration is in [vercel.json](vercel.json).

## Features Roadmap

### Current Features (Complete)
- Shopping list management
- Task management with frequencies
- Google Calendar integration
- Weekly meal planning
- Weather widget
- Moon phase display
- Voice control for shopping and tasks
- Offline support

### Future Enhancements
- Family location tracking
- Photo sharing
- Family messaging
- Shared contacts
- Custom task categories
- Recipe integration with meal planning

## Performance

- Bundle size: ~565 KB total (~164 KB gzipped)
- Code splitting: Vendor, Motion, Firebase chunks
- Lazy loading: Views and modals
- Service worker caching: Weather API, Firebase, Google APIs
- Lighthouse scores: 90+ across all categories

## Contributing

This is a personal family dashboard project. Feel free to fork and adapt for your own use.

## License

Private project - All rights reserved

## Acknowledgments

- Weather data provided by [Open-Meteo](https://open-meteo.com/)
- Icons by [Lucide](https://lucide.dev/)
- Fonts: Lato, Calistoga, Open Sans Condensed (Google Fonts)
