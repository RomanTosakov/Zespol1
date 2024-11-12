import { test as setup, expect } from '@playwright/test'
import path from 'path'

const authFile = path.join(__dirname, '../playwright/.auth/user.json')

setup('authenticate', async ({ page }) => {
  await page.goto('/')

  await page.fill('input[name="email"]', 'cylaros8@gmail.com')

  await page.click('button[type="submit"]')

  await page.fill('input[name="password"]', 'Hjvfirf2004+')

  await page.click('button[type="submit"]')

  await page.waitForURL('/projects/dashboard')

  await page.context().storageState({ path: authFile })
})
