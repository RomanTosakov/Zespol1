import { inviteSchema } from '@/lib/schemas/invite'
import { TProjectRole } from '@/lib/types/org'

describe('Invite Validation', () => {
  it('should validate valid invite data', async () => {
    const validInvite = {
      email: 'test@example.com',
      role: 'member' as TProjectRole
    }
    const result = await inviteSchema.validate(validInvite)
    expect(result).toEqual(validInvite)
  })

  it('should reject invalid email formats', async () => {
    const invalidEmails = [
      'invalid-email',
      'test@',
      '@example.com',
      'test@.com',
      'test@example.',
      'test@example..com'
    ]

    for (const email of invalidEmails) {
      await expect(inviteSchema.validate({ email, role: 'member' })).rejects.toThrow()
    }
  })

  it('should use member as default role if not specified', async () => {
    const inviteWithoutRole = {
      email: 'test@example.com'
    }
    const result = await inviteSchema.validate(inviteWithoutRole)
    expect(result.role).toBe('member')
  })

  it('should reject owner role in invites', async () => {
    const invalidRoleInvite = {
      email: 'test@example.com',
      role: 'owner' as TProjectRole
    }
    await expect(inviteSchema.validate(invalidRoleInvite)).rejects.toThrow()
  })

  it('should accept valid project roles', async () => {
    const validRoles: TProjectRole[] = ['member', 'administrator', 'manager']
    
    for (const role of validRoles) {
      const invite = {
        email: 'test@example.com',
        role
      }
      const result = await inviteSchema.validate(invite)
      expect(result.role).toBe(role)
    }
  })

  it('should reject empty email', async () => {
    const emptyEmailInvite = {
      email: '',
      role: 'member' as TProjectRole
    }
    await expect(inviteSchema.validate(emptyEmailInvite)).rejects.toThrow()
  })

  it('should reject invalid role values', async () => {
    const invalidRoleInvite = {
      email: 'test@example.com',
      role: 'invalid-role'
    }
    await expect(inviteSchema.validate(invalidRoleInvite)).rejects.toThrow()
  })
}) 