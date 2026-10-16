import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// v0.48 §11 — RTL added; UI tests use happy-dom. Unit tests stay on
// the Node environment; only *.tsx test files opt into happy-dom.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'node',
    include: ['src/**/__tests__/**/*.test.{ts,tsx}'],
    reporters: ['default'],
    // v0.49 §11 — registers jest-dom matchers and RTL cleanup. Guarded
    // internally so Node-environment unit tests are unaffected.
    setupFiles: ['src/test/setup.ts'],
    globals: false,
    environmentMatchGlobs: [
      ['src/**/__tests__/**/*.test.tsx', 'happy-dom'],
    ],
  },
});
