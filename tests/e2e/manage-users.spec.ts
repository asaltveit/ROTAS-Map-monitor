import { expect, test } from '@playwright/test'

test('disables role changes for the signed-in admin', async ({ page }) => {
  await page.goto('/private/admin/manage-users')
  await expect(page.getByRole('heading', { name: /manage users/i })).toBeVisible()
  await expect(page.getByText('You cannot change your own role.')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Save' }).first()).toBeDisabled()
})
