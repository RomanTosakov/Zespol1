import { useGetProjectId } from '@/lib/hooks/useGetProjectId'
import { TTaskComment } from '@/lib/types/tasks'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { axios } from '../../axios'

type EditCommentParams = {
  taskId: string
  commentId: string
  title: string
}

/**
 * Custom hook to edit an existing task comment
 * 
 * @remarks
 * This hook:
 * - Updates a comment's content using comment ID and task ID
 * - Uses project ID from context
 * - Returns the updated comment data
 * - Invalidates both task list and specific task cache
 * - Shows success toast notification
 * 
 * @returns {UseMutationResult} Mutation object containing:
 *   - mutate: Function to edit comment with {@link EditCommentParams}
 *   - isLoading: Boolean indicating if the mutation is in progress
 *   - error: Error object if the mutation failed
 *   - data: Updated comment data ({@link TTaskComment})
 *   - Other standard react-query mutation properties
 */
export const useEditComment = () => {
  const queryClient = useQueryClient()
  const projectId = useGetProjectId()

  return useMutation({
    mutationFn: async ({ taskId, commentId, title }: EditCommentParams) => {
      const { data } = await axios.patch<TTaskComment>(`/projects/${projectId}/tasks/${taskId}/comments/${commentId}`, {
        title
      })
      return data
    },
    onSuccess: async (_, { taskId }) => {
      await queryClient.invalidateQueries({ queryKey: ['tasks', projectId] })
      await queryClient.invalidateQueries({ queryKey: ['task', taskId] })
      toast.success('Comment updated')
    }
  })
}
