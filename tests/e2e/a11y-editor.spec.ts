import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test('@a11y dashboard page', async ({ page }) => {
  await page.goto('/private/dashboard')
  const results = await new AxeBuilder({ page }).analyze()
  const critical = results.violations.filter(
    (violation) =>
      violation.impact === 'critical' || violation.impact === 'serious',
  )
  expect(critical).toEqual([])
})

test('@a11y locations page', async ({ page }) => {
  await page.goto('/private/locations')
  const results = await new AxeBuilder({ page }).analyze()
  const critical = results.violations.filter(
    (violation) =>
      violation.impact === 'critical' || violation.impact === 'serious',
  )
  expect(critical).toEqual([])
})
