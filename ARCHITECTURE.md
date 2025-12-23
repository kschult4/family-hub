# Architecture Documentation

## Table of Contents
1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [System Architecture](#system-architecture)
4. [Component Architecture](#component-architecture)
5. [State Management](#state-management)
6. [Data Flow](#data-flow)
7. [Build & Deployment](#build--deployment)
8. [Performance Optimizations](#performance-optimizations)
9. [Security Considerations](#security-considerations)

---

## Overview

Family Hub Dashboard is a Progressive Web Application built with React and Vite, designed as a real-time family coordination platform. The architecture prioritizes:

- **Real-time synchronization** via Firebase Realtime Database
- **Offline-first** functionality with service workers and local caching
- **Performance** through code splitting, lazy loading, and intelligent caching
- **Progressive enhancement** from mobile to desktop
- **Accessibility** with voice control and responsive design

---

## Tech Stack

### Core Framework
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "vite": "^7.1.3"
}
```

**Why Vite?**
- Extremely fast HMR (Hot Module Replacement)
- Built-in code splitting and tree shaking
- Modern ESM-based development
- Superior build performance compared to Webpack
- Native CSS/asset handling

**Why React 18?**
- Concurrent rendering features
- Automatic batching for better performance
- Suspense for data fetching
- Large ecosystem and community support

---

### State Management & Real-time Sync

```json
{
  "firebase": "^12.1.0"
}
```

**Firebase Realtime Database** provides:
- WebSocket-based real-time synchronization
- Automatic reconnection and offline persistence
- Simple JSON-based data structure
- No backend code required
- Built-in security rules

**Data Structure**:
```javascript
{
  groceryItems: {
    "item-id-1": {
      name: "Milk",
      completed: false,
      timestamp: 1234567890
    }
  },
  tasks: {
    "task-id-1": {
      task: "Feed Coltrane",
      frequency: "daily",
      lastCompleted: 1234567890,
      recurring: true
    }
  },
  meals: {
    monday: "Spaghetti",
    tuesday: "Tacos",
    // ...
  }
}
```

---

### UI & Styling

```json
{
  "tailwindcss": "^3.4.17",
  "framer-motion": "^12.23.12",
  "lucide-react": "^0.536.0"
}
```

**TailwindCSS**:
- Utility-first CSS framework
- JIT compiler for minimal bundle size
- Custom theme configuration
- Responsive design utilities
- Dark mode support (not currently used)

**Framer Motion**:
- Declarative animations
- Layout animations
- Gesture support (drag, tap, long-press)
- Shared layout transitions
- Spring physics

**Lucide React**:
- Modern icon library
- Tree-shakeable (only imports used icons)
- Consistent design language
- SVG-based for crisp rendering

**Custom Theme** ([tailwind.config.js](tailwind.config.js)):
```javascript
{
  colors: {
    cream: '#F7E4C3',
    warmBrown: '#5A3210',
    softGreen: '#8FA88E',
    lightGray: '#E8E8E8',
    darkGray: '#555555'
  },
  fonts: {
    heading: ['Calistoga', 'serif'],
    body: ['Lato', 'sans-serif'],
    condensed: ['Open Sans Condensed', 'sans-serif']
  }
}
```

---

### Progressive Web App

```json
{
  "vite-plugin-pwa": "^1.0.2"
}
```

**Service Worker Strategy**:
- **Cache First**: Static assets (JS, CSS, images)
- **Network First**: Firebase API calls
- **Stale While Revalidate**: Weather API, Calendar API
- **Runtime Caching**: 2-hour TTL for external APIs

**Manifest Configuration**:
```javascript
{
  name: "Family Hub Dashboard",
  short_name: "Family Hub",
  theme_color: "#5A3210",
  background_color: "#F7E4C3",
  display: "standalone",
  scope: "/",
  start_url: "/"
}
```

---

### Testing

```json
{
  "vitest": "^3.2.4",
  "jest": "^30.0.5",
  "jest-puppeteer": "^11.0.0",
  "@testing-library/react": "^16.3.0"
}
```

**Testing Strategy**:
- **Unit Tests**: Vitest + React Testing Library
- **E2E Tests**: Jest + Puppeteer
- **Test Coverage**: Not enforced (minimal coverage currently)

---

## System Architecture

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Client (Browser)                     │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              React Application (SPA)                    │ │
│  │                                                          │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐             │ │
│  │  │ Alerts   │  │  Family  │  │  Header  │             │ │
│  │  │Dashboard │  │   View   │  │  Footer  │             │ │
│  │  └──────────┘  └──────────┘  └──────────┘             │ │
│  │       │              │              │                   │ │
│  │       └──────────────┴──────────────┘                   │ │
│  │                      │                                   │ │
│  │              ┌───────▼────────┐                         │ │
│  │              │ State Manager  │                         │ │
│  │              │  (useFirebase) │                         │ │
│  │              └───────┬────────┘                         │ │
│  └──────────────────────┼──────────────────────────────────┘ │
│                         │                                     │
│  ┌──────────────────────▼──────────────────────────────────┐ │
│  │             Service Worker (PWA)                         │ │
│  │  - Cache Management                                      │ │
│  │  - Offline Support                                       │ │
│  │  - Background Sync                                       │ │
│  └──────────────────────┬──────────────────────────────────┘ │
└─────────────────────────┼──────────────────────────────────── ┘
                          │
         ┌────────────────┼────────────────┐
         │                │                │
    ┌────▼────┐     ┌────▼────┐     ┌────▼──────┐
    │ Firebase│     │ Google  │     │Open-Meteo │
    │   DB    │     │Calendar │     │  Weather  │
    └─────────┘     └─────────┘     └───────────┘
```

### Request Flow

#### 1. Initial Load
```
User → Browser → index.html → main.jsx → App.jsx
                                              ↓
                                    Service Worker Check
                                              ↓
                                    Cache Static Assets
                                              ↓
                                    Initialize Firebase
                                              ↓
                                    Load Dashboard View
                                              ↓
                                    Fetch Real-time Data
```

#### 2. Real-time Data Update
```
Firebase DB → WebSocket → useFirebaseSync Hook → React State
                                                       ↓
                                                  Re-render
                                                       ↓
                                                  Update UI
```

#### 3. Offline Operation
```
User Action → useFirebaseSync → Check Network Status
                                        ↓
                                   Offline?
                                  /         \
                              Yes             No
                              ↓               ↓
                    Save to Queue       Send to Firebase
                    Update Local             ↓
                         ↓              Success/Failure
                    Network Restored         ↓
                         ↓              Update UI
                    Process Queue
                         ↓
                    Sync to Firebase
```

---

## Component Architecture

### Component Hierarchy

```
App (Root)
├── ErrorBoundary (Error handling wrapper)
├── AppBackground (Visual theming)
├── Header (Desktop only)
│   ├── MoonPhaseWidget
│   ├── Clock & Date Display
│   └── WeatherWidget
├── DashboardView (Router/Tab manager)
│   ├── AlertsDashboard (Main view)
│   │   ├── Calendar (Desktop only)
│   │   ├── ShoppingList
│   │   ├── TaskList (Desktop only)
│   │   └── WeeklyMeals
│   └── FamilyView (Placeholder)
└── FooterNav
    ├── Tab Navigation (ALERTS / FAMILY)
    ├── FloatingButtonWithMenu (+ button)
    │   ├── AddGroceryModal (Lazy loaded)
    │   ├── AddTaskModal (Lazy loaded)
    │   └── MealsModal (Lazy loaded)
    └── FloatingMicButton (Desktop only)
        └── VoiceControlModal (Lazy loaded)
```

### Component Categories

#### 1. **Layout Components**
Responsible for page structure and navigation.

- **App.jsx** - Root component, error boundary
- **DashboardView.jsx** - Tab router and view manager
- **Header.jsx** - Top navigation and widgets (desktop)
- **FooterNav.jsx** - Bottom navigation and action buttons
- **AppBackground.jsx** - Visual theming and backgrounds

#### 2. **Feature Components**
Core functionality components.

- **ShoppingList.jsx** - Grocery list with real-time sync
- **TaskList.jsx** - Task management with frequencies
- **Calendar.jsx** - Google Calendar integration
- **WeeklyMeals.jsx** - Meal planning interface
- **WeatherWidget.jsx** - Weather display
- **MoonPhaseWidget.jsx** - Moon phase calculator

#### 3. **Modal Components**
Overlays for user input.

- **AddGroceryModal.jsx** - Add items to shopping list
- **AddTaskModal.jsx** - Create new tasks
- **MealsModal.jsx** - Edit weekly meals
- **VoiceControlModal.jsx** - Voice command interface

#### 4. **View Components**
Page-level views.

- **AlertsDashboard.jsx** - Main dashboard with widgets
- **FamilyView.jsx** - Family features (placeholder)

#### 5. **Utility Components**
Reusable UI elements.

- **SectionHeader.jsx** - Consistent section titles
- **LazyImage.jsx** - Optimized image loading
- **ErrorBoundary.jsx** - Error catching and recovery

---

### Component Design Patterns

#### 1. **Custom Hooks Pattern**
All complex logic extracted into reusable hooks.

**Example: useFirebaseSync**
```javascript
// Location: src/hooks/useFirebaseSync.js

export const useFirebaseSync = (path, defaultValue) => {
  const [data, setData] = useState(defaultValue);
  const [loading, setLoading] = useState(true);

  // Real-time listener
  useEffect(() => {
    const dbRef = ref(database, path);
    const unsubscribe = onValue(dbRef, (snapshot) => {
      setData(snapshot.val() || defaultValue);
      setLoading(false);
    });
    return unsubscribe;
  }, [path]);

  // CRUD operations
  const addItem = (item) => { /* ... */ };
  const updateItem = (id, updates) => { /* ... */ };
  const deleteItem = (id) => { /* ... */ };

  return { data, loading, addItem, updateItem, deleteItem };
};
```

**Usage in Component**:
```javascript
const ShoppingList = () => {
  const { data: items, addItem, deleteItem } = useFirebaseSync(
    'groceryItems',
    []
  );

  return (
    <div>
      {items.map(item => (
        <Item key={item.id} {...item} onDelete={deleteItem} />
      ))}
    </div>
  );
};
```

#### 2. **Compound Components Pattern**
Related components grouped together.

**Example: WeeklyMeals**
```javascript
// Main component
const WeeklyMeals = () => {
  return (
    <div>
      <FeaturedMealCard day="today" />
      <MealSidebar days={allDays} />
    </div>
  );
};

// Sub-components (not exported)
const FeaturedMealCard = ({ day }) => { /* ... */ };
const MealSidebar = ({ days }) => { /* ... */ };
```

#### 3. **Lazy Loading Pattern**
Code splitting for performance.

**Implementation**:
```javascript
// App.jsx
const DashboardView = lazy(() => import('./components/DashboardView'));
const AddGroceryModal = lazy(() => import('./components/AddGroceryModal'));

// Usage with Suspense
<Suspense fallback={<LoadingSpinner />}>
  <DashboardView />
</Suspense>
```

**Benefits**:
- Smaller initial bundle size
- Faster time to interactive
- Better user experience on slow connections

#### 4. **Responsive Design Pattern**
Mobile-first with progressive enhancement.

**Custom Hook**:
```javascript
// src/hooks/useMediaQuery.js
export const useIsMobile = () => {
  return useMediaQuery('(max-width: 768px)');
};
```

**Usage**:
```javascript
const Dashboard = () => {
  const isMobile = useIsMobile();

  return (
    <div>
      {isMobile ? <MobileLayout /> : <DesktopLayout />}
    </div>
  );
};
```

---

## State Management

### State Architecture

The app uses **local state + Firebase** instead of Redux/Context API.

#### Why No Global State Library?

1. **Firebase already provides global state** via real-time database
2. **Minimal shared state** between components
3. **Simpler mental model** for small team/solo developer
4. **Less boilerplate** and easier to understand

### State Layers

#### 1. **Firebase State (Source of Truth)**
Persistent, real-time synchronized state.

```javascript
// Firebase Database Structure
{
  groceryItems: { /* ... */ },  // Shopping list items
  tasks: { /* ... */ },          // Task list
  meals: { /* ... */ }           // Weekly meals
}
```

**Characteristics**:
- Persisted across sessions
- Synchronized across devices
- Atomic updates with transactions
- Offline queue with automatic retry

#### 2. **Local React State (UI State)**
Ephemeral state for UI interactions.

```javascript
const [isModalOpen, setIsModalOpen] = useState(false);
const [selectedDay, setSelectedDay] = useState('monday');
const [currentTab, setCurrentTab] = useState('alerts');
```

**Characteristics**:
- Not persisted
- Component-scoped
- UI-only concerns
- Fast updates without network latency

#### 3. **Cached State (Performance Layer)**
Local storage cache for offline support.

```javascript
// src/hooks/useOfflineSync.js
const cache = {
  get: (key) => JSON.parse(localStorage.getItem(key)),
  set: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
  clear: (key) => localStorage.removeItem(key)
};
```

**Characteristics**:
- Mirrors Firebase data
- Used when offline
- Synced when connection restored
- Automatic expiration (configurable)

### Data Flow Diagram

```
┌─────────────────────────────────────────────────┐
│            Firebase Realtime Database            │
│                (Source of Truth)                 │
└─────────────────┬───────────────────────────────┘
                  │
                  │ WebSocket (onValue listener)
                  ▼
         ┌────────────────────┐
         │ useFirebaseSync    │
         │   (Custom Hook)    │
         └────────┬───────────┘
                  │
       ┌──────────┴───────────┐
       │                      │
       ▼                      ▼
┌─────────────┐        ┌─────────────┐
│ React State │        │Local Storage│
│  (data, id) │        │   (cache)   │
└──────┬──────┘        └─────────────┘
       │
       │ Re-render on change
       ▼
┌──────────────┐
│  Component   │
│   (UI View)  │
└──────────────┘
```

---

## Data Flow

### 1. Adding a Shopping List Item

```
User Input (Modal)
       ↓
onClick Handler
       ↓
addGroceryItem({ name: "Milk" })
       ↓
useFirebaseSync.addItem()
       ↓
Firebase.push(ref, { name: "Milk", timestamp: Date.now() })
       ↓
Firebase Database Updated
       ↓
onValue Listener Triggered
       ↓
useFirebaseSync State Updated
       ↓
Component Re-renders
       ↓
New Item Appears in UI
```

### 2. Voice Command Processing

```
User Clicks Mic Button
       ↓
useVoiceRecognition Hook Activated
       ↓
Web Speech API Starts Listening
       ↓
User Speaks: "Add milk to shopping list"
       ↓
Speech Recognition Result
       ↓
useVoiceCommands.parseCommand(transcript)
       ↓
Pattern Matching → Command Identified
       ↓
Execute Command (addGroceryItem)
       ↓
Same flow as manual input above
```

### 3. Offline Operation & Sync

```
User Offline → Add Item
       ↓
useFirebaseSync Detects No Network
       ↓
Add to Offline Queue (localStorage)
       ↓
Update Local State (optimistic update)
       ↓
UI Updates Immediately
       ↓
Network Restored
       ↓
useOfflineSync Detects Connection
       ↓
Process Queue → Sync to Firebase
       ↓
Remove from Queue
       ↓
Verify Sync Success
```

---

## Build & Deployment

### Build Configuration

**Vite Configuration** ([vite.config.js](vite.config.js)):

```javascript
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg}'],
        runtimeCaching: [/* ... */]
      }
    })
  ],
  build: {
    target: 'es2015',
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom'],
          'motion': ['framer-motion'],
          'firebase': ['firebase/app', 'firebase/database']
        }
      }
    }
  }
});
```

### Build Process

```bash
# 1. Install dependencies
npm install

# 2. Run build
npm run build

# Build output:
dist/
├── index.html              # Entry point
├── assets/
│   ├── vendor.hash.js      # React, React-DOM (~180 KB)
│   ├── motion.hash.js      # Framer Motion (~120 KB)
│   ├── firebase.hash.js    # Firebase (~90 KB)
│   ├── index.hash.js       # App code (~175 KB)
│   └── index.hash.css      # Tailwind CSS (~45 KB)
├── sw.js                   # Service worker
└── manifest.webmanifest    # PWA manifest
```

### Deployment (Vercel)

**Configuration** ([vercel.json](vercel.json)):
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

**Environment Variables** (Vercel Dashboard):
```bash
VITE_GOOGLE_CALENDAR_API_KEY=xxx
VITE_CALENDAR_ID=xxx@gmail.com
```

**Deployment Steps**:
1. Connect repository to Vercel
2. Add environment variables
3. Deploy from `main` branch
4. Automatic deployments on push

---

## Performance Optimizations

### 1. **Code Splitting**
Breaking the bundle into smaller chunks for faster initial load.

**Implementation**:
- Manual chunks for vendor libraries
- Lazy loaded views and modals
- Dynamic imports with React.lazy()

**Impact**:
- Initial load: ~180 KB (vendor) + ~100 KB (app) = ~280 KB
- Subsequent loads: Cached, instant

### 2. **Image Optimization**
Lazy loading images and using appropriate formats.

**LazyImage Component** ([src/components/LazyImage.jsx](src/components/LazyImage.jsx)):
```javascript
const LazyImage = ({ src, alt }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onLoad={() => setLoaded(true)}
      className={loaded ? 'opacity-100' : 'opacity-0'}
    />
  );
};
```

### 3. **Service Worker Caching**
Aggressive caching for static assets and API responses.

**Cache Strategy**:
- **Static Assets**: Cache first (CSS, JS, images)
- **Firebase API**: Network first with cache fallback
- **Weather API**: Stale while revalidate (2-hour TTL)
- **Calendar API**: Stale while revalidate (2-hour TTL)

**Impact**:
- Offline functionality
- Instant repeat visits
- Reduced bandwidth usage

### 4. **Memoization**
Preventing unnecessary re-renders.

**Example**:
```javascript
const MemoizedTaskList = React.memo(TaskList, (prev, next) => {
  return prev.tasks === next.tasks;
});
```

### 5. **Debouncing & Throttling**
Limiting expensive operations.

**Example** (Voice Recognition):
```javascript
const debouncedProcess = useCallback(
  debounce((transcript) => {
    processCommand(transcript);
  }, 300),
  []
);
```

---

## Security Considerations

### 1. **Firebase Security Rules**
Database rules to prevent unauthorized access.

**Required Rules** (Not in codebase, must be set in Firebase Console):
```json
{
  "rules": {
    "groceryItems": {
      ".read": true,
      ".write": true
    },
    "tasks": {
      ".read": true,
      ".write": true
    },
    "meals": {
      ".read": true,
      ".write": true
    }
  }
}
```

**⚠️ WARNING**: Current rules allow public read/write. For production:
- Add authentication
- Restrict writes to authenticated users
- Validate data structure

### 2. **API Key Security**
Environment variables for sensitive credentials.

**Implementation**:
```javascript
// ✅ GOOD: Environment variable
const apiKey = import.meta.env.VITE_GOOGLE_CALENDAR_API_KEY;

// ❌ BAD: Hardcoded
const apiKey = "AIzaSyAbc123...";
```

**Current State**:
- ✅ Google Calendar API key in .env
- ❌ Firebase config hardcoded (public read/write DB, acceptable for personal use)

### 3. **XSS Prevention**
React's built-in escaping protects against XSS.

**Safe**:
```javascript
<div>{userInput}</div>  // Automatically escaped
```

**Dangerous** (avoided):
```javascript
<div dangerouslySetInnerHTML={{__html: userInput}} />  // Never used
```

### 4. **HTTPS Enforcement**
Service worker and voice control require HTTPS.

**Vercel**: Automatic HTTPS
**Development**: localhost exception

---

## Future Architecture Considerations

### 1. **Authentication**
If adding user accounts:
- Firebase Authentication
- Protected routes
- User-specific data paths

### 2. **Real-time Collaboration**
If adding multi-user editing:
- Operational transformation
- Conflict resolution
- Presence indicators

### 3. **Scalability**
If expanding data size:
- Pagination for large lists
- Virtual scrolling
- Indexed queries

### 4. **Testing Infrastructure**
If increasing test coverage:
- Component unit tests
- Integration tests
- E2E test suite
- Visual regression tests

---

## Development Workflow

### Local Development
```bash
npm run dev          # Start dev server (http://localhost:5173)
npm test            # Run unit tests
npm run build       # Production build
npm run preview     # Preview production build
```

### Adding a New Feature
1. Create component in `src/components/`
2. Create custom hook if needed in `src/hooks/`
3. Add Firebase path in `useFirebaseSync`
4. Update UI in dashboard view
5. Add tests (unit + E2E)
6. Update documentation

### Code Style
- **Formatting**: Prettier (not enforced)
- **Linting**: ESLint (minimal config)
- **Naming**: camelCase for functions, PascalCase for components
- **Files**: Component per file, index exports

---

## Glossary

- **PWA**: Progressive Web App - Installable, offline-capable web app
- **SPA**: Single Page Application - No full page reloads
- **HMR**: Hot Module Replacement - Live updates during development
- **SSR**: Server-Side Rendering - Not used in this project (CSR only)
- **CSR**: Client-Side Rendering - All rendering in browser
- **TTL**: Time To Live - Cache expiration duration
- **CRUD**: Create, Read, Update, Delete - Basic data operations

---

## References

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
