import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'test/e2e',
  use: {
    baseURL: 'http://localhost:4321',
  },
  // no webServer — dev server is already running
});
