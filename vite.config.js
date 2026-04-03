import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/marrakechdardiafa/',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-supabase': ['@supabase/supabase-js'],
          'vendor-leaflet': ['leaflet'],
          'vendor-icons': ['@phosphor-icons/react'],
          'vendor-gsap': ['gsap'],
        }
      }
    }
  }
})
