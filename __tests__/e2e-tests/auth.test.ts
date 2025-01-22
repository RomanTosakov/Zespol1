import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test('should handle sign up flow', async ({ page }) => {
    await page.goto('/')

    // Enter email for new user
    await page.getByLabel('Email').fill(`test${Date.now()}@example.com`)
    await page.getByRole('button', { name: 'Submit' }).click()

    // Fill sign up form
    await page.getByLabel('Full Name').waitFor()
    await page.getByLabel('Full Name').fill('Test User')
    await page.getByLabel('Password').fill('TestPass123!')
    await page.getByRole('button', { name: 'Sign up' }).click()

    // Should redirect to dashboard
    await expect(page).toHaveURL('/projects/dashboard')
  })

  test('should handle sign in flow', async ({ page }) => {
    await page.goto('/')

    // Enter existing email
    await page.getByLabel('Email').fill('cylaros8@gmail.com')
    await page.getByRole('button', { name: 'Submit' }).click()

    // Enter password
    await page.getByLabel('Password').waitFor()
    await page.getByLabel('Password').fill('qweqweqwe')
    await page.getByRole('button', { name: 'Sign in' }).click()

    // Should redirect to dashboard
    await expect(page).toHaveURL('/projects/dashboard')
  })

  test('should handle invalid credentials', async ({ page }) => {
    await page.goto('/')

    // Enter email
    await page.getByLabel('Email').fill('wrong@example.com')
    await page.getByRole('button', { name: 'Submit' }).click()

    // Enter wrong password
    await page.getByLabel('Password').waitFor()
    await page.getByLabel('Password').fill('wrongpassword')
    await page.getByRole('button', { name: 'Sign in' }).click()

    // Should show error message
    await expect(page.getByText('Invalid login credentials')).toBeVisible()
  })
}) 