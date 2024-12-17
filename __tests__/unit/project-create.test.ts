import { orgSchema } from "@/lib/schemas/orgSchema"
import { TEnterNameForm } from "@/lib/types/projects"

describe('Enter emailSchema', () => {
    it('should validate', async () => {
      const body: TEnterNameForm = { name: 'coolmailcom' }
      const result = await orgSchema.validate(body)
      expect(body).toBe(result)
    })
    it('should throw error', async () => {
      try {
        const body: TEnterNameForm = { name: 'co' }
        const result = await orgSchema.validate(body)
        expect(false).toBe(true)
      } catch (error) {
        expect(error).toBeTruthy()
      }
    })
    it('should throw error', async () => {
        try {
          const body: TEnterNameForm = { name: 'h4T9jKpXz7WmBqLr8YnFdA6ClNvMtQ0EsVyZw2PoRxGbJHfLdMp5XoWuCvNsYrTx1PkJnZgHdWqRmQlFs2AvTz9YrPqWuMtZxEs0BnChFy4XvLrGpWmNvYsMqAoZdRfQlJpXwEsTyN9Po2RmFcBn5JHqT7YdLsVxMtWuAoFkQrXoNgWpHdYsTxBn2YrMoWlFd5NpXmPoLvXqTzYhRmFgHdJHWrAoXnZvBqLkXy7NfTsQrPoVxMqF4WrJmAoZvBnWuT1LpYmHdVxNsT7RpAoMqJHhFgPoWrLmT9AoFvBnWpH4Jefgerfvbef ' }
          const result = await orgSchema.validate(body)
          expect(false).toBe(true)
        } catch (error) {
          expect(error).toBeTruthy()
        }
    })
      it('should throw error', async () => {
        try {
          const body: TEnterNameForm = { name: '' }
          const result = await orgSchema.validate(body)
          expect(false).toBe(true)
        } catch (error) {
          expect(error).toBeTruthy()
        }
    })
    it('should throw error', async () => {
        try {
          const body: TEnterNameForm = { name: 'dashboard' }
          const result = await orgSchema.validate(body)
          expect(false).toBe(true)
        } catch (error) {
          expect(error).toBeTruthy()
        }
    })
  })