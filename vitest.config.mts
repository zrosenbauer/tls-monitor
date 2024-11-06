import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    coverage: {
      provider: 'istanbul',
      reporter: ['html', 'text-summary', 'lcovonly'],
      all: true,
    },
    testTimeout: 15000,
  },
});
