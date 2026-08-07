import { expect, test } from '@playwright/test'

test('filters locations and opens delete dialog', async ({ page }) => {
  await page.goto('/private/locations')
  await expect(page.getByRole('heading', { name: /locations/i })).toBeVisible()

  await page.getByPlaceholder('ID, place, text, shelfmark…').fill('Rome')
  await expect(page.getByText('Forum')).toBeVisible()

  await page.getByRole('button', { name: 'Delete' }).first().click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.getByRole('button', { name: 'Cancel' }).click()
})
