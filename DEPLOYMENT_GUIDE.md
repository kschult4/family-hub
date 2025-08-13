# Home Dashboard Deployment Guide

## Overview

This guide covers deployment considerations, performance optimization, and production setup for the Home Dashboard functionality.

## Environment Configuration

### Development Environment

```bash
# Development with mock data (default)
VITE_USE_MOCK_HA=true

# Development with live Home Assistant
VITE_USE_MOCK_HA=false
VITE_HA_BASE_URL=http://homeassistant.local:8123
VITE_HA_TOKEN=your_development_token
```

### Production Environment

```bash
# Production configuration
VITE_USE_MOCK_HA=false
VITE_HA_BASE_URL=https://your-ha-domain.com
VITE_HA_TOKEN=your_production_long_lived_access_token

# Optional: Enable debug logging
DEBUG=home-dashboard:*

# Optional: Performance monitoring
VITE_ENABLE_PERFORMANCE_MONITORING=true
```

### Home Assistant Requirements

#### Minimum Version
- **Home Assistant Core**: 2023.1.0 or later
- **WebSocket API**: Enabled (default)
- **REST API**: Enabled (default)

#### Required Configuration

```yaml
# configuration.yaml
http:
  cors_allowed_origins:
    - "https://your-family-hub-domain.com"
    - "http://localhost:3000"  # For development
  use_x_forwarded_for: true
  trusted_proxies:
    - 127.0.0.1
    - 192.168.0.0/24  # Adjust to your network

# Enable WebSocket API (enabled by default)
websocket_api:

# Enable REST API (enabled by default) 
api:
```

#### Long-Lived Access Token Setup

1. Go to Home Assistant Profile → Security
2. Create Long-Lived Access Token
3. Copy token and store securely
4. Set as `VITE_HA_TOKEN` environment variable

## Build Configuration

### Production Build

```bash
# Install dependencies
npm ci --only=production

# Run production build
npm run build

# Optional: Analyze bundle size
npm run analyze
```

### Build Optimization

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  build: {
    // Optimize for production
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor chunks for better caching
          vendor: ['react', 'react-dom'],
          homeassistant: ['./src/services/homeAssistant.js', './src/services/haWebSocket.js'],
          ui: ['react-beautiful-dnd', 'framer-motion']
        }
      }
    },
    // Generate source maps for debugging
    sourcemap: true,
    // Optimize chunk size
    chunkSizeWarningLimit: 1000
  },
  plugins: [
    // Bundle analyzer
    visualizer({
      filename: 'dist/bundle-analysis.html',
      open: false,
      gzipSize: true,
      brotliSize: true
    })
  ]
})
```

## Performance Optimization

### React Optimization

```javascript
// Component-level optimizations
import { memo, useMemo, useCallback } from 'react'

const DeviceCard = memo(({ device, onToggle, onLongPress }) => {
  // Memoize expensive calculations
  const brightnessPercentage = useMemo(() => {
    return Math.round((device.attributes?.brightness || 0) / 255 * 100)
  }, [device.attributes?.brightness])
  
  // Stable callback references
  const handleToggle = useCallback(() => {
    onToggle?.(device.entity_id)
  }, [onToggle, device.entity_id])
  
  return (
    // Component JSX
  )
})
```

### Bundle Optimization

```javascript
// Lazy loading for routes
import { lazy, Suspense } from 'react'

const HomeDashboard = lazy(() => import('./views/HomeDashboard'))

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeDashboard />
    </Suspense>
  )
}
```

### Asset Optimization

```bash
# Optimize images during build
npm install --save-dev imagemin imagemin-webp

# Add to build process
npx imagemin src/assets/*.{jpg,png} --out-dir=dist/assets --plugin=webp
```

## Deployment Platforms

### Raspberry Pi Deployment

#### Hardware Requirements
- **Raspberry Pi 4 (4GB+)**: Recommended for optimal performance
- **Raspberry Pi 3B+**: Minimum requirement with performance limitations
- **MicroSD Card**: Class 10, 32GB+ recommended
- **Touchscreen**: 7" or larger official Pi touchscreen

#### Pi OS Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Chromium for kiosk mode
sudo apt-get install -y chromium-browser unclutter

# Clone and build project
git clone https://github.com/your-org/family-hub.git
cd family-hub
npm ci
npm run build

# Serve with simple HTTP server
npm install -g serve
serve -s dist -p 3000
```

#### Kiosk Mode Setup

```bash
# Create kiosk startup script
sudo nano /home/pi/kiosk.sh

#!/bin/bash
xset s noblank
xset s off
xset -dpms
unclutter -idle 0.5 -root &

chromium-browser \
  --noerrdialogs \
  --disable-infobars \
  --kiosk \
  --disable-session-crashed-bubble \
  --disable-component-extensions-with-background-pages \
  --disable-background-networking \
  --disable-background-timer-throttling \
  --disable-renderer-backgrounding \
  --disable-backgrounding-occluded-windows \
  --disable-features=TranslateUI \
  --touch-events=enabled \
  --enable-pinch \
  http://localhost:3000

# Make executable
chmod +x /home/pi/kiosk.sh

# Add to autostart
sudo nano /etc/xdg/lxsession/LXDE-pi/autostart
# Add: @/home/pi/kiosk.sh
```

### PWA Deployment (Netlify/Vercel)

#### Netlify Deployment

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=dist

# Set environment variables in Netlify dashboard
VITE_USE_MOCK_HA=false
VITE_HA_BASE_URL=https://your-homeassistant.com
VITE_HA_TOKEN=your_production_token
```

#### Vercel Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod

# Set environment variables
vercel env add VITE_USE_MOCK_HA
vercel env add VITE_HA_BASE_URL  
vercel env add VITE_HA_TOKEN
```

### Docker Deployment

```dockerfile
# Dockerfile
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

```nginx
# nginx.conf
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Enable gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Handle client-side routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
}
```

```bash
# Build and run Docker container
docker build -t family-hub .
docker run -p 8080:80 family-hub
```

## Performance Monitoring

### Core Web Vitals

```javascript
// Performance monitoring setup
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

function sendToAnalytics({ name, value, id }) {
  // Send metrics to your analytics service
  console.log('Performance metric:', { name, value, id })
}

// Monitor all Core Web Vitals
getCLS(sendToAnalytics)
getFID(sendToAnalytics)
getFCP(sendToAnalytics)
getLCP(sendToAnalytics)
getTTFB(sendToAnalytics)
```

### Custom Performance Metrics

```javascript
// Component render time monitoring
import { useEffect } from 'react'

export function usePerformanceMonitor(componentName) {
  useEffect(() => {
    const startTime = performance.now()
    
    return () => {
      const endTime = performance.now()
      const renderTime = endTime - startTime
      
      if (renderTime > 100) { // Threshold: 100ms
        console.warn(`Slow render: ${componentName} took ${renderTime.toFixed(2)}ms`)
      }
    }
  }, [componentName])
}

// Usage in components
function HomeDashboard() {
  usePerformanceMonitor('HomeDashboard')
  // Component logic...
}
```

### Memory Usage Monitoring

```javascript
// Monitor memory usage
function monitorMemoryUsage() {
  if ('memory' in performance) {
    const memory = performance.memory
    console.log({
      usedJSHeapSize: `${(memory.usedJSHeapSize / 1048576).toFixed(2)} MB`,
      totalJSHeapSize: `${(memory.totalJSHeapSize / 1048576).toFixed(2)} MB`,
      jsHeapSizeLimit: `${(memory.jsHeapSizeLimit / 1048576).toFixed(2)} MB`
    })
  }
}

// Monitor every 30 seconds in development
if (process.env.NODE_ENV === 'development') {
  setInterval(monitorMemoryUsage, 30000)
}
```

## Security Considerations

### Environment Variables

```bash
# Never commit sensitive data to version control
# Use .env.local for local development secrets
echo "VITE_HA_TOKEN=your_token_here" >> .env.local
echo ".env.local" >> .gitignore
```

### Content Security Policy

```html
<!-- Add to index.html -->
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  connect-src 'self' https://your-homeassistant.com ws://your-homeassistant.com wss://your-homeassistant.com;
  script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
">
```

### API Token Security

```javascript
// Token validation utility
export function validateToken(token) {
  if (!token || token.length < 10) {
    throw new Error('Invalid Home Assistant token')
  }
  
  // Don't log tokens in production
  if (process.env.NODE_ENV === 'development') {
    console.log('Token length:', token.length)
  }
}

// Use in API calls
export async function makeAuthenticatedRequest(url, token, options = {}) {
  validateToken(token)
  
  return fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers
    }
  })
}
```

## Error Monitoring

### Sentry Integration

```bash
npm install @sentry/react @sentry/tracing
```

```javascript
// sentry.js
import * as Sentry from '@sentry/react'
import { BrowserTracing } from '@sentry/tracing'

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: process.env.VITE_SENTRY_DSN,
    integrations: [
      new BrowserTracing(),
    ],
    tracesSampleRate: 0.1,
    environment: process.env.NODE_ENV,
    beforeSend(event) {
      // Filter sensitive data
      if (event.extra?.token) {
        delete event.extra.token
      }
      return event
    }
  })
}

// Error boundary
export const SentryErrorBoundary = Sentry.withErrorBoundary(App, {
  fallback: ({ error, resetError }) => (
    <div className="error-fallback">
      <h1>Something went wrong</h1>
      <p>{error.message}</p>
      <button onClick={resetError}>Try again</button>
    </div>
  )
})
```

### Custom Error Tracking

```javascript
// Error tracking utility
export class ErrorTracker {
  static track(error, context = {}) {
    console.error('Error tracked:', error, context)
    
    // Send to monitoring service
    if (process.env.NODE_ENV === 'production') {
      fetch('/api/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: error.message,
          stack: error.stack,
          context,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href
        })
      }).catch(err => console.error('Failed to track error:', err))
    }
  }
}

// Usage in components
try {
  await toggleDevice(entityId)
} catch (error) {
  ErrorTracker.track(error, { 
    component: 'DeviceCard', 
    entityId,
    action: 'toggle' 
  })
  setError(error)
}
```

## Backup and Recovery

### Configuration Backup

```bash
# Backup widget layouts
mkdir -p backups
date=$(date +%Y%m%d_%H%M%S)

# Export localStorage data
node -e "
const fs = require('fs');
const backup = {
  timestamp: new Date().toISOString(),
  layouts: {
    pi: localStorage.getItem('home-dashboard-layout-pi'),
    pwa: localStorage.getItem('home-dashboard-layout-pwa')
  }
};
fs.writeFileSync('backups/widget_layouts_$date.json', JSON.stringify(backup, null, 2));
"
```

### Automated Health Checks

```javascript
// Health check endpoint
export async function healthCheck() {
  const checks = {
    homeAssistant: false,
    webSocket: false,
    localStorage: false,
    timestamp: new Date().toISOString()
  }
  
  try {
    // Check Home Assistant API
    const response = await fetch(`${baseUrl}/api/states`, {
      headers: { 'Authorization': `Bearer ${token}` },
      timeout: 5000
    })
    checks.homeAssistant = response.ok
  } catch (error) {
    console.error('HA API check failed:', error)
  }
  
  try {
    // Check localStorage
    localStorage.setItem('health-check', 'test')
    localStorage.removeItem('health-check')
    checks.localStorage = true
  } catch (error) {
    console.error('localStorage check failed:', error)
  }
  
  return checks
}

// Run health check on startup
healthCheck().then(status => {
  console.log('System health:', status)
  if (!status.homeAssistant) {
    console.warn('Home Assistant connection failed')
  }
})
```

## Maintenance

### Log Management

```javascript
// Structured logging
export const Logger = {
  info: (message, meta = {}) => {
    console.log(`[INFO] ${new Date().toISOString()} ${message}`, meta)
  },
  warn: (message, meta = {}) => {
    console.warn(`[WARN] ${new Date().toISOString()} ${message}`, meta)
  },
  error: (message, meta = {}) => {
    console.error(`[ERROR] ${new Date().toISOString()} ${message}`, meta)
  },
  debug: (message, meta = {}) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[DEBUG] ${new Date().toISOString()} ${message}`, meta)
    }
  }
}
```

### Update Procedures

```bash
# Safe update procedure
# 1. Backup current installation
cp -r dist dist_backup_$(date +%Y%m%d)

# 2. Pull latest changes
git pull origin main

# 3. Install dependencies
npm ci

# 4. Run tests
npm run test

# 5. Build new version
npm run build

# 6. Validate health checks
# (Run manual validation or automated tests)

# 7. If issues occur, rollback
# rm -rf dist && mv dist_backup_$(date +%Y%m%d) dist
```

### Performance Benchmarks

```javascript
// Benchmark key operations
export async function runBenchmarks() {
  const results = {}
  
  // Component render benchmark
  const renderStart = performance.now()
  render(<HomeDashboard />)
  results.renderTime = performance.now() - renderStart
  
  // API response benchmark
  const apiStart = performance.now()
  await haApi.getStates(baseUrl, token)
  results.apiResponseTime = performance.now() - apiStart
  
  // WebSocket connection benchmark
  const wsStart = performance.now()
  const ws = createWebSocketConnection(baseUrl, token)
  await ws.connect()
  results.wsConnectionTime = performance.now() - wsStart
  
  console.table(results)
  return results
}
```

## Troubleshooting

### Common Deployment Issues

#### CORS Errors
```
Access to fetch at 'http://homeassistant.local:8123/api/states' from origin 'https://your-domain.com' has been blocked by CORS policy
```
**Solution**: Add your domain to Home Assistant CORS configuration

#### WebSocket Connection Failures
```
WebSocket connection to 'ws://homeassistant.local:8123/api/websocket' failed
```
**Solutions**:
- Check Home Assistant WebSocket API is enabled
- Verify network connectivity
- Check firewall settings
- Try WSS for HTTPS sites

#### Build Failures
```
Error: Cannot resolve module 'react-beautiful-dnd'
```
**Solutions**:
- Clear node_modules and package-lock.json
- Run `npm ci` instead of `npm install`
- Check Node.js version compatibility

#### Performance Issues on Pi
**Symptoms**: Slow rendering, unresponsive touch
**Solutions**:
- Enable hardware acceleration in Chromium
- Reduce number of simultaneous widgets
- Disable animations in low-performance mode
- Increase GPU memory split

### Debug Mode

```javascript
// Enable debug logging
localStorage.setItem('debug', 'home-dashboard:*')

// Component debug info
if (process.env.NODE_ENV === 'development') {
  window.debugInfo = {
    devices: devices.length,
    scenes: scenes.length,
    layout: layout.length,
    isConnected,
    lastUpdate: new Date().toISOString()
  }
}
```

---

This deployment guide ensures reliable, performant deployment of the Home Dashboard across various platforms and environments. Follow the appropriate sections based on your deployment target and requirements.