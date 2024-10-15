import { emailSchema, passwordSchema } from '@/lib/schemas/email'
import { enterEmailSchema } from '@/lib/schemas/enterEmail'
import { signInSchema } from '@/lib/schemas/signIn'
import { TEnterEmailForm, TSignInForm } from '@/lib/types/auth'
import { error } from 'console'

describe('Example', () => {
  it('should return true', () => {
    expect(true).toBe(true)
  })
})

describe('EnteremailSchema', () => {
  it('should validate', async () => {
    const body: TEnterEmailForm = { email: 'coolmail@2.com' }
    const result = await enterEmailSchema.validate(body)
    expect(body).toBe(result)
  })
  it('should throw error', async () => {
    try {
      const body: TEnterEmailForm = { email: 'coolmail2.com' }
      const result = await enterEmailSchema.validate(body)
      expect(false).toBe(true)
    } catch (error) {
      expect(error).toBeTruthy()
    }
  })
})

describe('signInSchema', () => {
  it('should validate', async () => {
    const body: TSignInForm = { email: 'alexey199124@gmail.com', password: 'asdfghjklou' }
    const result = await signInSchema.validate(body)
    expect(body).toBe(result)
  })

  it('should throw error email', async () => {
    try {
      const body: TSignInForm = { email: 'alexey199124gmail.com', password: 'adasdaasdasdasd' }
      const result = await signInSchema.validate(body)
      expect(false).toBe(true)
    } catch (error) {
      expect(error).toBeTruthy
    }
  })

  it('should throw error password', async () => {
    try {
      const body: TSignInForm = { email: 'example@gmail.com', password: '' }
      const result = await signInSchema.validate(body)
      expect(false).toBe(true)
    } catch (error) {
      expect(error).toBeTruthy
    }
  })

  it('should throw error email password', async () => {
    try {
      const body: TSignInForm = { email: 'examplegmail.com', password: '' }
      const result = await signInSchema.validate(body)
      expect(false).toBe(true)
    } catch (error) {
      expect(error).toBeTruthy
    }
  })
})
