import { useGetProjectId } from '@/lib/hooks/useGetProjectId'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { axios } from '../../axios'

type TDeleteCommentParams = {
  taskId: string
  commentId: string
}

/**
 * Custom hook to delete a task comment
 * 
 * @remarks
 * This hook:
 * - Deletes a comment using comment ID and task ID
 * - Uses project ID from context
 * - Invalidates both task list and specific task cache
 * - Shows success/error toast notifications
 * - Handles error messages from the API response
 * 
 * @returns {UseMutationResult} Mutation object containing:
 *   - mutate: Function to delete comment with {@link TDeleteCommentParams}
 *   - isLoading: Boolean indicating if the mutation is in progress
 *   - error: Error object if the mutation failed
 *   - Other standard react-query mutation properties
 */
export const useDeleteComment = () => {
  const projectId = useGetProjectId()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ taskId, commentId }: TDeleteCommentParams) => {
      return await axios.delete(`/projects/${projectId}/tasks/${taskId}/comments/${commentId}`)
    },
    onSuccess: async (_, { taskId }) => {
      await queryClient.invalidateQueries({ queryKey: ['tasks', projectId] })
      await queryClient.invalidateQueries({ queryKey: ['task', taskId] })
      toast.success('Comment deleted successfully')
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || 'Failed to delete comment')
    }
  })
} 