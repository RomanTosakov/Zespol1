import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { TTask, TTaskComment } from '@/lib/types/tasks'
import { useAddComment } from '@/lib/utils/api/hooks/Tasks/useAddComment'
import { useEditComment } from '@/lib/utils/api/hooks/Tasks/useEditComment'
import { useDeleteComment } from '@/lib/utils/api/hooks/Tasks/useDeleteComment'
import { useProjectTeam } from '@/lib/utils/api/hooks/Team/useProjectTeam'
import { useCurrentMemberRole } from '@/lib/utils/api/hooks/Team/useCurrentMemberRole'
import { useUser } from '@/lib/utils/api/hooks/useUser'
import { format } from 'date-fns'
import { PencilIcon, TrashIcon } from 'lucide-react'
import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { axios } from '@/lib/utils/api/axios'
import { useGetProjectId } from '@/lib/hooks/useGetProjectId'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

type TaskCommentsProps = {
  task: TTask
}

export const TaskComments = ({ task }: TaskCommentsProps) => {
  const [comment, setComment] = useState('')
  const [editingComment, setEditingComment] = useState<TTaskComment | null>(null)
  const [editedTitle, setEditedTitle] = useState('')

  const addComment = useAddComment()
  const editComment = useEditComment()
  const deleteComment = useDeleteComment()
  const { data: teamMembers } = useProjectTeam()
  const { data: currentRole } = useCurrentMemberRole()
  const { data: currentUser } = useUser()
  const queryClient = useQueryClient()
  const projectId = useGetProjectId()

  const canDeleteComment = (commentAuthorId: string) => {
    if (!currentUser || !currentRole) return false
    if (currentRole === 'owner' || currentRole === 'administrator') return true
    return currentUser.id === commentAuthorId
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment.trim()) return

    addComment.mutate(
      {
        taskId: task.id,
        title: comment
      },
      {
        onSuccess: () => {
          setComment('')
        }
      }
    )
  }

  const handleEdit = async (comment: TTaskComment) => {
 
  
        setEditingComment(comment)
        setEditedTitle(comment.title)
      
  
  }

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingComment || !editedTitle.trim()) return

    editComment.mutate(
      {
        taskId: task.id,
        commentId: editingComment.id,
        title: editedTitle
      },
      {
        onSuccess: () => {
          setEditingComment(null)
          setEditedTitle('')
        }
      }
    )
  }

  const handleDelete = (commentId: string) => {
    deleteComment.mutate({
      taskId: task.id,
      commentId
    })
  }

  return (
    <div className='space-y-4'>
      <h3 className='font-medium'>Comments</h3>

      <form onSubmit={handleSubmit} className='flex gap-2'>
        <Input
          placeholder='Add a comment...'
          value={comment}
          onChange={e => setComment(e.target.value)}
          className='flex-1'
        />
        <Button type='submit' disabled={!comment.trim() || addComment.isPending}>
          Add
        </Button>
      </form>

      <div className='space-y-4'>
        {task.comments
          ?.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .map(comment => {
            const member = comment.member_id ? teamMembers?.find(member => member.id === comment.member_id) : null
            const isEditing = editingComment?.id === comment.id
            const canDelete = canDeleteComment(member?.profile_id || '')

            return (
              <div key={comment.id} className='space-y-1'>
                <div className='flex items-center gap-2'>
                  <span className='font-medium'>{member?.name || 'Unknown User'}</span>
                  <span className='text-sm text-muted-foreground'>
                    {format(new Date(comment.created_at), 'MMM d, yyyy h:mm a')}
                    {comment.edited_at && ' (edited)'}
                  </span>
                  <div className='flex gap-1'>
                    {member?.profile_id === currentUser?.id && !isEditing && (
                      <Button variant='ghost' size='icon' className='h-6 w-6' onClick={() => handleEdit(comment)}>
                        <PencilIcon className='h-3 w-3' />
                      </Button>
                    )}
                    {canDelete && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant='ghost' size='icon' className='h-6 w-6'>
                            <TrashIcon className='h-3 w-3 text-destructive' />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Comment</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this comment? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDelete(comment.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </div>
                {isEditing ? (
                  <form onSubmit={handleSaveEdit} className='flex gap-2'>
                    <Input
                      value={editedTitle}
                      onChange={e => setEditedTitle(e.target.value)}
                      className='flex-1'
                      autoFocus
                      onKeyDown={e => {
                        if (e.key === 'Escape') {
                          setEditingComment(null)
                          setEditedTitle('')
                        }
                      }}
                    />
                    <Button type='submit' disabled={!editedTitle.trim() || editComment.isPending}>
                      Save
                    </Button>
                    <Button
                      type='button'
                      variant='outline'
                      onClick={() => {
                        setEditingComment(null)
                        setEditedTitle('')
                      }}
                    >
                      Cancel
                    </Button>
                  </form>
                ) : (
                  <p className='text-sm'>{comment.title}</p>
                )}
              </div>
            )
          })}
      </div>
    </div>
  )
}
