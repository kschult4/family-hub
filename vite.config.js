import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
  base: "/family-hub/",
  build: {
    target: 'es2015', // Better compatibility with older browsers
    modulePreload: {
      polyfill: true
    },
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
        start_url: '/family-hub/',
        scope: '/family-hub/',
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
          }
        ]
      },
      workbox: {
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
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
          }
        ]
      }
    })
  ],
  };
});