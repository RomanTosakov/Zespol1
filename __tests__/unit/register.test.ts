import { signUpSchema } from '@/lib/schemas/signUp'
import { TSignUpForm } from '@/lib/types/auth'

describe('Registration Validation', () => {
  describe('Basic Validation', () => {
    it('should validate valid registration data', async () => {
      const validData: TSignUpForm = {
        email: 'test@example.com',
        full_name: 'John Doe',
        password: 'Password123!'
      }
      const result = await signUpSchema.validate(validData)
      expect(result).toEqual(validData)
    })

    it('should reject empty registration data', async () => {
      const emptyData: Partial<TSignUpForm> = {}
      await expect(signUpSchema.validate(emptyData)).rejects.toThrow()
    })
  })

  describe('Email Validation', () => {
    it('should validate various email formats', async () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.com',
        'user+label@domain.com',
        'user@subdomain.domain.com',
        '123@domain.com',
        'user@domain.co.uk',
        '.user@domain.com' // Valid according to Yup's email validation
      ]

      for (const email of validEmails) {
        const data: TSignUpForm = {
          email,
          full_name: 'John Doe',
          password: 'Password123!'
        }
        const result = await signUpSchema.validate(data)
        expect(result.email).toBe(email)
      }
    })

    it('should reject invalid email formats', async () => {
      const invalidEmails = [
        'invalid-email',
        '@domain.com',
        'user@',
        'user@.com',
        'user@domain.',
        'user@domain..com',
        'user name@domain.com'
      ]

      for (const email of invalidEmails) {
        const data: TSignUpForm = {
          email,
          full_name: 'John Doe',
          password: 'Password123!'
        }
        await expect(signUpSchema.validate(data)).rejects.toThrow()
      }
    })
  })

  describe('Full Name Validation', () => {
    it('should validate various name formats', async () => {
      const validNames = [
        'John Doe',
        'Mary Jane',
        'José María',
        'Jean-Pierre',
        'O\'Connor',
        'Smith Jr.',
        'Dr. John Smith',
        'Иван Иванов',
        '张三',
        'John-Jane Doe',
        'a', // Valid since there's no length constraint
        'a'.repeat(100) // Valid since there's no length constraint
      ]

      for (const full_name of validNames) {
        const data: TSignUpForm = {
          email: 'test@example.com',
          full_name,
          password: 'Password123!'
        }
        const result = await signUpSchema.validate(data)
        expect(result.full_name).toBe(full_name)
      }
    })

    it('should reject invalid name formats', async () => {
      const invalidNames = [
        '', // Empty string is invalid
        null, // Null is invalid
        undefined // Undefined is invalid
      ]

      for (const full_name of invalidNames) {
        const data = {
          email: 'test@example.com',
          full_name,
          password: 'Password123!'
        }
        await expect(signUpSchema.validate(data)).rejects.toThrow()
      }
    })
  })

  describe('Password Validation', () => {
    it('should validate strong passwords', async () => {
      const validPasswords = [
        'Password123!',
        'StrongP@ss1',
        'C0mplex!Pass',
        'Abcd123!@#',
        'P@ssw0rd123',
        'Test1234!@',
        'a'.repeat(100) // Valid since there's no max length
      ]

      for (const password of validPasswords) {
        const data: TSignUpForm = {
          email: 'test@example.com',
          full_name: 'John Doe',
          password
        }
        const result = await signUpSchema.validate(data)
        expect(result.password).toBe(password)
      }
    })

    it('should reject weak passwords', async () => {
      const weakPasswords = [
        '', // Empty
        'pass', // Too short (< 8 chars)
        '1234567' // Too short (< 8 chars)
      ]

      for (const password of weakPasswords) {
        const data: TSignUpForm = {
          email: 'test@example.com',
          full_name: 'John Doe',
          password
        }
        await expect(signUpSchema.validate(data)).rejects.toThrow()
      }
    })
  })

  describe('Combined Validation', () => {
    it('should validate complete registration data', async () => {
      const testCases = [
        {
          email: 'john.doe@example.com',
          full_name: 'John Doe',
          password: 'StrongP@ss1'
        },
        {
          email: 'jane.smith@company.co.uk',
          full_name: 'Jane Smith-Jones',
          password: 'C0mplex!Pass'
        },
        {
          email: 'user123@domain.com',
          full_name: 'Dr. Robert Brown Jr.',
          password: 'Test1234!@'
        }
      ]

      for (const testCase of testCases) {
        const result = await signUpSchema.validate(testCase)
        expect(result).toEqual(testCase)
      }
    })

    it('should reject partially invalid data', async () => {
      const invalidCases = [
        {
          email: 'valid@example.com',
          full_name: '', // Invalid name
          password: 'Password123!'
        },
        {
          email: 'invalid-email', // Invalid email
          full_name: 'John Doe',
          password: 'Password123!'
        },
        {
          email: 'valid@example.com',
          full_name: 'John Doe',
          password: 'pass' // Invalid password
        }
      ]

      for (const testCase of invalidCases) {
        await expect(signUpSchema.validate(testCase)).rejects.toThrow()
      }
    })
  })
}) 