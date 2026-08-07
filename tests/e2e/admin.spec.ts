import { expect, test } from '@playwright/test'

test('shows admin navigation links', async ({ page }) => {
  await page.goto('/private/admin')
  await expect(page.getByRole('link', { name: 'Add user' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Manage users' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Remove user' })).toBeVisible()
})
