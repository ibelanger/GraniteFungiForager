import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Enable global test APIs (describe, test, expect, etc.)
    globals: true,

    // Use jsdom for DOM simulation (needed for modules that interact with DOM)
    environment: 'jsdom',

    // Test file patterns
    include: ['tests/**/*.test.js', 'tests/**/*.spec.js'],

    // Coverage configuration
    coverage: {
      provider: 'c8',
      reporter: ['text', 'html', 'lcov', 'json'],
      exclude: [
        'node_modules/',
        'dist/',
        'tests/',
        '*.config.js',
        'src/ml/accuracy-improvement-pipeline.js' // ML pipeline - complex integration
      ],
      // Coverage thresholds (start conservative, increase over time)
      statements: 50,
      branches: 50,
      functions: 50,
      lines: 50
    },

    // Test timeouts
    testTimeout: 10000,
    hookTimeout: 10000,

    // Reporter configuration
    reporters: ['verbose'],

    // Setup files (run before each test file)
    setupFiles: ['./tests/setup.js']
  }
});
