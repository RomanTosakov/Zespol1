import { test as setup, expect } from '@playwright/test'
import { join } from 'path'

setup('authenticate', async ({ page }) => {
  // Go to the login page and wait for it to load
  await page.goto('/')
  await page.waitForLoadState('networkidle')

  try {
    // Try different selectors for email input
    const emailInput = await page.waitForSelector('input[type="email"], input[placeholder*="email" i], input[name*="email" i], input[id*="email" i]', { timeout: 5000 })
    await emailInput.fill('cylaros8@gmail.com')
    
    // Find and click submit button
    const submitButton = await page.waitForSelector('button[type="submit"], button:has-text("Submit"), button:has-text("Continue")', { timeout: 5000 })
    await submitButton.click()

    // Wait to see which form appears (registration or login)
    try {
      // Check if full name input appears (registration flow)
      const fullNameInput = await page.waitForSelector('input[placeholder*="name" i], input[name*="name" i], input[id*="name" i]', { timeout: 3000 })
      if (fullNameInput) {
        // Registration flow
        await fullNameInput.fill('Test User')
        const passwordInput = await page.waitForSelector('input[type="password"]')
        await passwordInput.fill('qweqweqwe')
        const signUpButton = await page.waitForSelector('button[type="submit"], button:has-text("Sign up")')
        await signUpButton.click()
      }
    } catch {
      // Login flow (no full name input found)
      const passwordInput = await page.waitForSelector('input[type="password"]')
      await passwordInput.fill('qweqweqwe')
      const signInButton = await page.waitForSelector('button[type="submit"], button:has-text("Sign in"), button:has-text("Login")')
      await signInButton.click()
    }

    // Wait for successful login and navigation to dashboard
    await expect(page).toHaveURL('/projects/dashboard', { timeout: 10000 })

    // Store the authentication state in a standardized location
    await page.context().storageState({
      path: join(__dirname, '../playwright/.auth/user.json')
    })
  } catch (error) {
    console.error('Failed to authenticate:', error)
    throw error
  }
}) 