import { test, expect } from '@playwright/test'

test.describe('Sprints Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to first project
    await page.goto('/projects/dashboard')
    await page.getByRole('link', { name: /Project/ }).first().click()
    
    // Go to sprints page
    await page.getByRole('link', { name: 'Sprints' }).click()
  })

  test('should create a new sprint', async ({ page }) => {
    // Click create sprint button
    await page.getByRole('button', { name: 'Create sprint' }).click()

    // Fill sprint form
    const sprintName = `Sprint ${Date.now()}`
    await page.getByLabel('Name').fill(sprintName)
    await page.getByLabel('Start Date').fill('2024-01-01')
    await page.getByLabel('End Date').fill('2024-01-14')
    await page.getByRole('button', { name: 'Create' }).click()

    // Should show success message and new sprint
    await expect(page.getByText('Sprint created successfully')).toBeVisible()
    await expect(page.getByText(sprintName)).toBeVisible()
  })

  test('should list existing sprints', async ({ page }) => {
    // Check if sprints are listed
    await expect(page.getByRole('listitem')).toHaveCount(1)
    
    // Check if create sprint button is visible
    await expect(page.getByRole('button', { name: 'Create sprint' })).toBeVisible()
  })

  test('should view sprint details', async ({ page }) => {
    // Click on first sprint
    await page.getByRole('listitem').first().click()

    // Check sprint details
    await expect(page.getByText('Sprint Details')).toBeVisible()
    await expect(page.getByText('Tasks')).toBeVisible()
    await expect(page.getByText('Progress')).toBeVisible()
  })

  test('should edit sprint details', async ({ page }) => {
    // Open first sprint
    await page.getByRole('listitem').first().click()

    // Click edit button
    await page.getByRole('button', { name: 'Edit' }).click()

    // Update sprint details
    const newName = `Updated Sprint ${Date.now()}`
    await page.getByLabel('Name').fill(newName)
    await page.getByRole('button', { name: 'Save' }).click()

    // Should show success message and updated sprint
    await expect(page.getByText('Sprint updated successfully')).toBeVisible()
    await expect(page.getByText(newName)).toBeVisible()
  })

  test('should add tasks to sprint', async ({ page }) => {
    // Open first sprint
    await page.getByRole('listitem').first().click()

    // Add task to sprint
    await page.getByRole('button', { name: 'Add tasks' }).click()
    await page.getByRole('checkbox').first().check()
    await page.getByRole('button', { name: 'Add selected' }).click()

    // Should show success message
    await expect(page.getByText('Tasks added to sprint successfully')).toBeVisible()
  })

  test('should complete sprint', async ({ page }) => {
    // Open first sprint
    await page.getByRole('listitem').first().click()

    // Complete sprint
    await page.getByRole('button', { name: 'Complete sprint' }).click()
    await page.getByRole('button', { name: 'Confirm' }).click()

    // Should show success message
    await expect(page.getByText('Sprint completed successfully')).toBeVisible()
  })
}) 