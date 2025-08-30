import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const baseUrl = env.VITE_BASE_URL || "/";
  
  return {
  base: "/",
  build: {
    target: 'es2015', // Better compatibility with older browsers
    modulePreload: {
      polyfill: true
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          motion: ['framer-motion'],
          firebase: ['firebase/app', 'firebase/database', 'firebase/auth']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  server: {
    proxy: {
      '/api/ha': {
        target: env.VITE_HA_BASE_URL || 'http://localhost:8123',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/ha/, ''),
        headers: {
          'Authorization': `Bearer ${env.VITE_HA_TOKEN || ''}`
        }
      }
    }
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Family Hub',
        short_name: 'FamilyHub',
        description: 'Family dashboard for managing tasks, shopping lists, and meal planning',
        theme_color: '#5A3210',
        background_color: '#F7E4C3',
        display: 'standalone',
        orientation: 'portrait',
        start_url: "/",
        scope: "/",
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: 'apple-touch-icon.png',
            sizes: '180x180',
            type: 'image/png',
            purpose: 'apple touch icon'
          }
        ]
      },
      selfDestroying: true,
      workbox: {
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        navigateFallback: null,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.open-meteo\.com/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'weather-api',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 2 // 2 hours
              }
            }
          },
          {
            urlPattern: /^https:\/\/.*\.firebaseio\.com/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'firebase-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 // 24 hours
              },
              plugins: [{
                cacheKeyWillBeUsed: async ({ request }) => {
                  // Remove auth tokens from cache key for security
                  const url = new URL(request.url);
                  url.searchParams.delete('auth');
                  return url.href;
                }
              }]
            }
          },
          {
            urlPattern: /^https:\/\/.*\.googleapis\.com/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'google-apis',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 12 // 12 hours
              }
            }
          }
        ]
      }
    })
  ],
  };
});