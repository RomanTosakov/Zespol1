import { test, expect } from '@playwright/test'

test.describe('Tasks Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to first project
    await page.goto('/projects/dashboard')
    await page.getByRole('link', { name: /Project/ }).first().click()
    
    // Go to tasks page
    await page.getByRole('link', { name: 'Tasks' }).click()
  })

  test('should create a new task', async ({ page }) => {
    // Click create task button
    await page.getByRole('button', { name: 'Create task' }).click()

    // Fill task form
    const taskTitle = `Test Task ${Date.now()}`
    await page.getByLabel('Title').fill(taskTitle)
    await page.getByLabel('Description').fill('This is a test task description')
    await page.getByRole('button', { name: 'Create' }).click()

    // Should show success message and new task
    await expect(page.getByText('Task created successfully')).toBeVisible()
    await expect(page.getByText(taskTitle)).toBeVisible()
  })

  test('should list existing tasks', async ({ page }) => {
    // Check if tasks are listed
    await expect(page.getByRole('listitem')).toHaveCount(1)
    
    // Check if create task button is visible
    await expect(page.getByRole('button', { name: 'Create task' })).toBeVisible()
  })

  test('should update task status', async ({ page }) => {
    // Find first task and change status
    await page.getByRole('listitem').first().click()
    await page.getByRole('button', { name: 'Status' }).click()
    await page.getByRole('option', { name: 'In Progress' }).click()

    // Should show success message
    await expect(page.getByText('Task updated successfully')).toBeVisible()
  })

  test('should edit task details', async ({ page }) => {
    // Open first task
    await page.getByRole('listitem').first().click()

    // Edit task
    const newTitle = `Updated Task ${Date.now()}`
    await page.getByLabel('Title').fill(newTitle)
    await page.getByRole('button', { name: 'Save' }).click()

    // Should show success message and updated task
    await expect(page.getByText('Task updated successfully')).toBeVisible()
    await expect(page.getByText(newTitle)).toBeVisible()
  })

  test('should delete task', async ({ page }) => {
    // Open first task
    await page.getByRole('listitem').first().click()

    // Delete task
    await page.getByRole('button', { name: 'Delete' }).click()
    await page.getByRole('button', { name: 'Confirm' }).click()

    // Should show success message
    await expect(page.getByText('Task deleted successfully')).toBeVisible()
  })
}) 