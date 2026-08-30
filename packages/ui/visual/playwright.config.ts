import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: '.',
  snapshotDir: './snapshots',
  outputDir: './test-results',
  use: {
    baseURL: 'http://localhost:5173',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'cd ../.. && pnpm -F playground dev',
    port: 5173,
    reuseExistingServer: true,
    timeout: 30000,
  },
})
