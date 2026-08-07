import fs from 'node:fs'
import path from 'node:path'
import { chromium, type FullConfig } from '@playwright/test'
import {
  ensureTestUsers,
  signInTestUser,
  TEST_PASSWORD,
  TEST_USERS,
} from '../helpers/supabase'

const authDir = path.join(process.cwd(), 'tests/e2e/.auth')

async function saveStorageState(
  email: string,
  fileName: string,
  baseURL: string,
): Promise<void> {
  const browser = await chromium.launch()
  const page = await browser.newPage()

  await page.goto(`${baseURL}/login`)
  await page.getByLabel('Email address').fill(email)
  await page.getByLabel('Password').fill(TEST_PASSWORD)
  await page.getByRole('button', { name: 'Sign in' }).click()
  await page.waitForURL('**/private/dashboard')

  fs.mkdirSync(authDir, { recursive: true })
  await page.context().storageState({ path: path.join(authDir, fileName) })
  await browser.close()

  await signInTestUser(email)
}

export default async function globalSetup(config: FullConfig): Promise<void> {
  const baseURL =
    config.projects[0]?.use.baseURL ??
    process.env.PLAYWRIGHT_BASE_URL ??
    'http://127.0.0.1:3000'

  await ensureTestUsers()
  await saveStorageState(TEST_USERS.editor.email, 'editor.json', baseURL)
  await saveStorageState(TEST_USERS.admin.email, 'admin.json', baseURL)
}
