import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import pluginRewriteAll from 'vite-plugin-rewrite-all'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    pluginRewriteAll(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',

      workbox: {
        skipWaiting: true,
        clientsClaim: true,
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === 'document',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'html-cache',
            },
          },
        ],
      },

      manifest: {
        name: 'Sistema de tesorería',
        short_name: 'Sistema de tesorería',
        description: 'Sistema de tesorería Megadis',
        icons: [
          {
            src: '/logo.svg',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/logo.svg',
            sizes: '512x512',
            type: 'image/png'
          }
        ],
        start_url: '.',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#000000'
      }
    })
  ],
  define: {
    _global: {}
  }
})