import { test, expect } from '@playwright/test'

test('has title', async ({ page }) => {
  await page.goto('/')

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Email/)
})

test('Has Submit button', async ({ page }) => {
  await page.goto('/')

  const button = await page.getByText('Submit')
  await expect(button).toBeVisible()
})

test('Entering email', async ({ page }) => {
  await page.goto('/')
  const input = await page.getByPlaceholder('qwe@example.com')
  const button = await page.getByText('Submit')

  input.fill('dasda@gmail.com')
  button.click()

  await expect(page).toHaveTitle(/Fill form/)
})
