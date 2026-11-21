import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Builds every figure into one script and one stylesheet that index.html
// loads as plain static files, so GitHub Pages needs no build step.
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../assets/figures',
    emptyOutDir: true,
    target: 'es2020',
    cssCodeSplit: false,
    modulePreload: false,
    // The kit's brand registry points at two logos over Vite's 4 KB default.
    // Inlined, they drop out with the unused registry instead of shipping as
    // stray files.
    assetsInlineLimit: 8192,
    rollupOptions: {
      input: 'main.tsx',
      output: {
        entryFileNames: 'figures.js',
        assetFileNames: 'figures[extname]',
      },
    },
  },
  resolve: { dedupe: ['react', 'react-dom'] },
})
