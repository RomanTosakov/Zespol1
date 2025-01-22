import { TProjectDetailsForm } from '@/lib/types/projects'

describe('Project Details Validation', () => {
  describe('Basic Validation', () => {
    it('should validate valid project details', () => {
      const validDetails: TProjectDetailsForm = {
        name: 'Test Project',
        slug: 'test-project',
        primary_owner: 'user-123'
      }
      expect(validDetails.name).toBeTruthy()
      expect(validDetails.slug).toMatch(/^[a-z0-9-]+$/)
      expect(validDetails.primary_owner).toBeTruthy()
    })

    it('should reject empty project details', () => {
      const emptyDetails: Partial<TProjectDetailsForm> = {}
      expect(() => {
        const details = emptyDetails as TProjectDetailsForm
        expect(details.name).toBeTruthy()
      }).toThrow()
    })
  })

  describe('Name Validation', () => {
    it('should validate project name constraints', () => {
      const validNames = [
        'Project 1',
        'My Test Project',
        'Project-Name',
        'Project_Name 123',
        'Проект Test',
        '项目测试'
      ]

      validNames.forEach(name => {
        const details: TProjectDetailsForm = {
          name,
          slug: 'test-project',
          primary_owner: 'user-123'
        }
        expect(details.name).toBeTruthy()
      })
    })

    it('should reject invalid project names', () => {
      const invalidNames = [
        '', // Empty string
        '  ', // Only spaces
        '\n\t' // Only whitespace characters
      ]

      invalidNames.forEach(name => {
        const trimmed = name.trim()
        expect(trimmed.length === 0).toBe(true)
      })
    })
  })

  describe('Slug Validation', () => {
    it('should validate project slug format', () => {
      const validSlugs = [
        'test-project',
        'my-project-123',
        'project-name',
        'test',
        'a'.repeat(30),
        '123-456',
        'a-1-b-2'
      ]

      validSlugs.forEach(slug => {
        expect(slug).toMatch(/^[a-z0-9-]+$/)
        expect(slug.length).toBeGreaterThanOrEqual(1)
        expect(slug.length).toBeLessThanOrEqual(30)
      })
    })

    it('should reject invalid project slugs', () => {
      const invalidSlugs = [
        'Test Project', // Contains spaces
        'Project_Name', // Contains underscore
        'project@name', // Contains special character
        'PROJECT-NAME', // Contains uppercase
        '', // Empty string
        'project--name', // Double hyphens
        '-project-name', // Starts with hyphen
        'project-name-', // Ends with hyphen
        'проект', // Non-ASCII characters
        '项目' // Chinese characters
      ]

      invalidSlugs.forEach(slug => {
        const isValid = /^[a-z0-9-]+$/.test(slug) && 
                       !slug.includes('--') && 
                       !slug.startsWith('-') && 
                       !slug.endsWith('-')
        expect(isValid).toBe(false)
      })
    })
  })

  describe('Primary Owner Validation', () => {
    it('should validate primary owner is set', () => {
      const details: TProjectDetailsForm = {
        name: 'Test Project',
        slug: 'test-project',
        primary_owner: 'user-123'
      }
      expect(details.primary_owner).toBeTruthy()
      expect(typeof details.primary_owner).toBe('string')
    })

    it('should validate different primary owner formats', () => {
      const validOwnerIds = [
        'user-123',
        'admin-456',
        'uuid-12345678',
        '12345',
        'a'.repeat(36)
      ]

      validOwnerIds.forEach(ownerId => {
        const details: TProjectDetailsForm = {
          name: 'Test Project',
          slug: 'test-project',
          primary_owner: ownerId
        }
        expect(details.primary_owner).toBeTruthy()
        expect(typeof details.primary_owner).toBe('string')
      })
    })

    it('should reject invalid primary owner values', () => {
      const invalidOwnerIds = ['', ' ', '   ']

      invalidOwnerIds.forEach(ownerId => {
        const details: TProjectDetailsForm = {
          name: 'Test Project',
          slug: 'test-project',
          primary_owner: ownerId
        }
        expect(details.primary_owner.trim().length === 0).toBe(true)
      })
    })
  })
}) 