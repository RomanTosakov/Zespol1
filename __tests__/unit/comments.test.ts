import { TProjectRole } from '@/lib/types/org'
import { TTaskComment } from '@/lib/types/tasks'

describe('Comment Permissions', () => {
  const mockComment: TTaskComment = {
    id: 'comment-1',
    title: 'Test comment',
    task_id: 'task-1',
    member_id: 'user-1',
    created_at: new Date().toISOString(),
    edited_at: null
  }

  const canDeleteComment = (userRole: TProjectRole, userId: string, commentAuthorId: string): boolean => {
    if (userRole === 'owner' || userRole === 'administrator') return true
    return userId === commentAuthorId
  }

  it('should allow users to delete their own comments', () => {
    const userId = 'user-1'
    const userRole: TProjectRole = 'member'
    
    expect(canDeleteComment(userRole, userId, mockComment.member_id)).toBeTruthy()
  })

  it('should not allow users to delete others comments', () => {
    const userId = 'user-2'
    const userRole: TProjectRole = 'member'
    
    expect(canDeleteComment(userRole, userId, mockComment.member_id)).toBeFalsy()
  })

  it('should allow administrators to delete any comment', () => {
    const userId = 'admin-1'
    const userRole: TProjectRole = 'administrator'
    
    expect(canDeleteComment(userRole, userId, mockComment.member_id)).toBeTruthy()
  })

  it('should allow owners to delete any comment', () => {
    const userId = 'owner-1'
    const userRole: TProjectRole = 'owner'
    
    expect(canDeleteComment(userRole, userId, mockComment.member_id)).toBeTruthy()
  })
}) 