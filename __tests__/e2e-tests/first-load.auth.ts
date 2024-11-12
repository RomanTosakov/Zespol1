import { test, expect } from '@playwright/test'

test('has title  loggined', async ({ page }) => {
  await page.goto('/')

  await expect(page).toHaveTitle(/Dashboard/)
})

test('create new project', async ({ page }) => {
  await page.goto('/projects/create')

  const input = await page.getByPlaceholder('Project name')
  const button = await page.getByText('Create')

  input.fill('Test project')
  button.click()
})
