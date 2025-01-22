import { orgSchema } from '@/lib/schemas/orgSchema'
import { TOrgForm } from '@/lib/types/org'

describe('Project Schema Validation', () => {
  it('should validate valid project data', async () => {
    const validData: TOrgForm = {
      name: 'Test Project'
    }
    const result = await orgSchema.validate(validData)
    expect(result).toEqual(validData)
  })

  it('should reject project name that is too short', async () => {
    const shortNameData: TOrgForm = {
      name: 'Te'
    }
    await expect(orgSchema.validate(shortNameData)).rejects.toThrow()
  })

  it('should reject project name that is too long', async () => {
    const longNameData: TOrgForm = {
      name: 'a'.repeat(256)
    }
    await expect(orgSchema.validate(longNameData)).rejects.toThrow()
  })

  it('should reject reserved project names', async () => {
    const reservedNames = ['dashboard', 'create', 'projects', 'project']
    
    for (const name of reservedNames) {
      const data: TOrgForm = { name }
      await expect(orgSchema.validate(data)).rejects.toThrow()
    }
  })

  it('should accept valid project names', async () => {
    const validNames = [
      'My Project',
      'Test Project 123',
      'Project-Name',
      'Project_Name',
      'ValidName'.repeat(20) // Long but within limits
    ]

    for (const name of validNames) {
      const data: TOrgForm = { name }
      const result = await orgSchema.validate(data)
      expect(result).toEqual(data)
    }
  })
}) 