import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test('@a11y manage users page', async ({ page }) => {
  await page.goto('/private/admin/manage-users')
  const results = await new AxeBuilder({ page }).analyze()
  const critical = results.violations.filter(
    (violation) =>
      violation.impact === 'critical' || violation.impact === 'serious',
  )
  expect(critical).toEqual([])
})
