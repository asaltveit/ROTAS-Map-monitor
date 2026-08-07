import { defineConfig, devices } from '@playwright/test'

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:3000'

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? 'github' : 'list',
  globalSetup: './tests/e2e/global-setup.ts',
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'unauthenticated',
      use: { ...devices['Desktop Chrome'] },
      testMatch: /auth\.spec\.ts|a11y-public\.spec\.ts/,
    },
    {
      name: 'editor',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'tests/e2e/.auth/editor.json',
      },
      testMatch: /locations\.spec\.ts|a11y-editor\.spec\.ts/,
    },
    {
      name: 'admin',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'tests/e2e/.auth/admin.json',
      },
      testMatch: /admin\.spec\.ts|manage-users\.spec\.ts|monitor\.spec\.ts|a11y-admin\.spec\.ts/,
    },
  ],
  webServer: {
    command: 'npm run start',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      ...process.env,
      CRON_SECRET: process.env.CRON_SECRET ?? 'test-cron-secret',
      ROTAS_MAP_URL: process.env.ROTAS_MAP_URL ?? 'http://127.0.0.1:9999',
      NEXT_PUBLIC_ROTAS_MAP_URL:
        process.env.NEXT_PUBLIC_ROTAS_MAP_URL ?? 'http://127.0.0.1:9999',
    },
  },
})
