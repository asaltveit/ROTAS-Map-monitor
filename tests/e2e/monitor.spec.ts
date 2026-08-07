import { expect, test } from '@playwright/test'

test('renders monitor dashboard cards', async ({ page }) => {
  await page.goto('/private/dashboard')
  await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible()
})
