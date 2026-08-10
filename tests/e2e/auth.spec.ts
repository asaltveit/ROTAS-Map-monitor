import { expect, test } from '@playwright/test'

test('redirects unauthenticated users to login', async ({ page }) => {
  await page.goto('/private/dashboard')
  await expect(page).toHaveURL(/\/login/)
})

test('logs in as editor and reaches dashboard', async ({ page }) => {
  await page.goto('/login')
  await page.getByLabel('Email address').fill('editor@test.local')
  await page.getByLabel('Password').fill('test-password-123')
  await page.getByRole('button', { name: 'Sign in' }).click()
  await expect(page).toHaveURL(/\/private\/dashboard/)
  await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible()
})
