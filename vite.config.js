import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: 'dist', // Output directory for the build
    emptyOutDir: true, // Clear the output directory before building
    sourcemap: false, // Disable sourcemap generation
    cssCodeSplit: true, // Enable CSS code splitting
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Create separate chunks for libraries or large modules
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    }
  }
})
