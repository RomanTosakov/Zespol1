import { test, expect } from '@playwright/test'

test.describe('Invites Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to first project
    await page.goto('/projects/dashboard')
    await page.getByRole('link', { name: /Project/ }).first().click()
    
    // Go to settings page
    await page.getByRole('link', { name: 'Settings' }).click()
  })

  test('should send project invite', async ({ page }) => {
    // Click invite member button
    await page.getByRole('button', { name: 'Invite member' }).click()

    // Fill invite form
    const testEmail = `test${Date.now()}@example.com`
    await page.getByLabel('Email').fill(testEmail)
    await page.getByRole('combobox', { name: 'Role' }).click()
    await page.getByRole('option', { name: 'Member' }).click()
    await page.getByRole('button', { name: 'Send invite' }).click()

    // Should show success message
    await expect(page.getByText('Invite sent successfully')).toBeVisible()
  })

  test('should list pending invites', async ({ page }) => {
    // Go to invites tab
    await page.getByRole('tab', { name: 'Invites' }).click()

    // Check if invites are listed
    await expect(page.getByRole('listitem')).toBeVisible()
  })

  test('should cancel invite', async ({ page }) => {
    // Go to invites tab
    await page.getByRole('tab', { name: 'Invites' }).click()

    // Cancel first invite
    await page.getByRole('button', { name: 'Cancel invite' }).first().click()
    await page.getByRole('button', { name: 'Confirm' }).click()

    // Should show success message
    await expect(page.getByText('Invite cancelled successfully')).toBeVisible()
  })

  test('should resend invite', async ({ page }) => {
    // Go to invites tab
    await page.getByRole('tab', { name: 'Invites' }).click()

    // Resend first invite
    await page.getByRole('button', { name: 'Resend invite' }).first().click()

    // Should show success message
    await expect(page.getByText('Invite resent successfully')).toBeVisible()
  })

  test('should handle invalid email format', async ({ page }) => {
    // Click invite member button
    await page.getByRole('button', { name: 'Invite member' }).click()

    // Fill invalid email
    await page.getByLabel('Email').fill('invalid-email')
    await page.getByRole('combobox', { name: 'Role' }).click()
    await page.getByRole('option', { name: 'Member' }).click()
    await page.getByRole('button', { name: 'Send invite' }).click()

    // Should show error message
    await expect(page.getByText('Invalid email format')).toBeVisible()
  })

  test('should prevent duplicate invites', async ({ page }) => {
    // Click invite member button
    await page.getByRole('button', { name: 'Invite member' }).click()

    // Fill email of existing member
    await page.getByLabel('Email').fill('cylaros8@gmail.com')
    await page.getByRole('combobox', { name: 'Role' }).click()
    await page.getByRole('option', { name: 'Member' }).click()
    await page.getByRole('button', { name: 'Send invite' }).click()

    // Should show error message
    await expect(page.getByText('User is already a member of this project')).toBeVisible()
  })
}) 