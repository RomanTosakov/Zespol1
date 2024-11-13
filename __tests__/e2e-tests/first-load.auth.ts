import { test, expect } from '@playwright/test'

test('has title  loggined', async ({ page }) => {
  await page.goto('/')

  await expect(page).toHaveTitle(/Dashboard/)
})

test('create new project', async ({ page }) => {
  await page.goto('/projects/create')

  const input = await page.getByPlaceholder('Project name')
  await input.waitFor({ state: 'visible' });
  const button = await page.locator('button', { hasText: 'Create' });

  await input.fill('Test project')
  await button.click()
})
