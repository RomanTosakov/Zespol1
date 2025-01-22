import { test, expect } from '@playwright/test'

test.describe('Projects Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/projects/dashboard')
  })

  test('should create a new project', async ({ page }) => {
    // Click create project button
    await page.getByRole('link', { name: 'Create project' }).click()

    // Fill project form
    const projectName = `Test Project ${Date.now()}`
    await page.getByLabel('Name').fill(projectName)
    await page.getByRole('button', { name: 'Create' }).click()

    // Should redirect to project page and show success message
    await expect(page).toHaveURL(/\/projects\/[^/]+\/dashboard/)
    await expect(page.getByText('Project created successfully')).toBeVisible()
  })

  test('should list existing projects', async ({ page }) => {
    // Check if projects are listed
    await expect(page.getByRole('link', { name: /Project/ })).toBeVisible()
    
    // Check if create project button is visible
    await expect(page.getByRole('link', { name: 'Create project' })).toBeVisible()
  })

  test('should navigate to project details', async ({ page }) => {
    // Click on first project
    await page.getByRole('link', { name: /Project/ }).first().click()

    // Should show project dashboard
    await expect(page).toHaveURL(/\/projects\/[^/]+\/dashboard/)
  })

  test('should handle project settings', async ({ page }) => {
    // Navigate to first project
    await page.getByRole('link', { name: /Project/ }).first().click()
    
    // Go to settings
    await page.getByRole('link', { name: 'Settings' }).click()

    // Update project name
    const newName = `Updated Project ${Date.now()}`
    await page.getByLabel('Name').fill(newName)
    await page.getByRole('button', { name: 'Save' }).click()

    // Should show success message
    await expect(page.getByText('Project updated successfully')).toBeVisible()
  })
}) 