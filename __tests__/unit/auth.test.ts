import { signUpSchema } from '@/lib/schemas/signUp'
import { TSignUpForm } from '@/lib/types/auth'

describe('SignUp Schema Validation', () => {
  it('should validate valid signup data', async () => {
    const validData: TSignUpForm = {
      email: 'test@example.com',
      password: 'Password123!',
      full_name: 'Test User'
    }
    const result = await signUpSchema.validate(validData)
    expect(result).toEqual(validData)
  })

  it('should reject invalid email', async () => {
    const invalidData: TSignUpForm = {
      email: 'invalid-email',
      password: 'Password123!',
      full_name: 'Test User'
    }
    await expect(signUpSchema.validate(invalidData)).rejects.toThrow()
  })

  it('should reject weak password', async () => {
    const weakPasswordData: TSignUpForm = {
      email: 'test@example.com',
      password: '123', // Too short
      full_name: 'Test User'
    }
    await expect(signUpSchema.validate(weakPasswordData)).rejects.toThrow()
  })

  it('should reject empty name', async () => {
    const emptyNameData: TSignUpForm = {
      email: 'test@example.com',
      password: 'Password123!',
      full_name: ''
    }
    await expect(signUpSchema.validate(emptyNameData)).rejects.toThrow()
  })
}) 