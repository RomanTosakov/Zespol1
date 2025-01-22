import { test, expect } from '@playwright/test'
import { join } from 'path'

test.use({ storageState: join(__dirname, '../playwright/.auth/user.json') })

test('first load', async ({ page }) => {
  await page.goto('/')

  // Wait for redirect to dashboard
  await expect(page).toHaveURL('/projects/dashboard')
})

test('create new project', async ({ page }) => {
  // Go to dashboard and wait for it to load
  await page.goto('/projects/dashboard')
  await page.waitForLoadState('networkidle')

  // Try to find create project button with different selectors
  const createButton = await page.waitForSelector(
    'a[href*="create"], a:has-text("Create project"), button:has-text("Create project")', 
    { timeout: 5000 }
  )
  await createButton.click()

  // Wait for the create form to appear
  await page.waitForURL('/projects/create')

  // Fill project form
  const projectName = `Test Project ${Date.now()}`
  await page.waitForSelector('input[name="name"], input[placeholder*="name" i]')
  await page.fill('input[name="name"], input[placeholder*="name" i]', projectName)

  // Find and click create button
  const submitButton = await page.waitForSelector('button[type="submit"], button:has-text("Create")')
  await submitButton.click()

  // Should redirect to project backlog page
  await expect(page).toHaveURL(/\/projects\/[^/]+\/boards\/backlog/, { timeout: 10000 })
  
  // Go back to dashboard
  await page.goto('/projects/dashboard')
  await page.waitForLoadState('networkidle')
  
  // Verify project was created by checking if we can see the project name in the list
  await expect(page.getByRole('link', { name: projectName })).toBeVisible({ timeout: 10000 })
})
