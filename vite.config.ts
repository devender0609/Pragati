import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        // The product.
        main: resolve(__dirname, 'index.html'),
        // v0.77 — the visual exploration harness. A second entry rather
        // than a route inside the app: three unapproved Home concepts
        // must not be reachable from the product, and the product's
        // tests must not have to accommodate them.
        concepts: resolve(__dirname, 'concepts.html'),
      },
    },
  },
});
