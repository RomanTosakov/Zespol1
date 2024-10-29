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

test('Has Logout button', async ({ page }) => {
  await page.goto('/')

  const button = await page.getByText('')
  await expect(button).toBeVisible()
})

test('Entering title project', async ({ page }) => {
  await page.goto('/')
  const input = await page.getByPlaceholder('Project name')
  const button = await page.getByText('Create')
  var title = 'test1'
  input.fill(title)
  button.click()

  //await expect(page).toHaveURL(localhost:3000/projects/{title})
})
