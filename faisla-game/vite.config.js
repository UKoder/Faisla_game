import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/faisla-game/' : '/',
  preview: {
    allowedHosts: 'all',
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/*.png'],
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,webp,woff2}'],
        navigateFallback: 'index.html',
        navigateFallbackDenylist: [/^\/api/],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\./,
            handler: 'CacheFirst',
            options: { cacheName: 'fonts', expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 } },
          },
        ],
      },
      manifest: {
        name: 'Faisla — Farmer Decision Game',
        short_name: 'Faisla',
        description: 'A financial literacy game for Indian farmers. Play offline, learn real-world money skills.',
        start_url: mode === 'production' ? '/faisla-game/' : '/',
        scope: mode === 'production' ? '/faisla-game/' : '/',
        display: 'standalone',
        orientation: 'any',
        background_color: '#0d0a04',
        theme_color: '#d4a843',
        categories: ['games', 'education'],
        icons: [
          {
            src: mode === 'production' ? '/faisla-game/icons/icon.svg' : '/icons/icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any',
          },
          {
            src: mode === 'production' ? '/faisla-game/icons/icon-192.png' : '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: mode === 'production' ? '/faisla-game/icons/icon-512.png' : '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable any',
          },
        ],
        screenshots: [],
      },
    }),
  ],
}))
