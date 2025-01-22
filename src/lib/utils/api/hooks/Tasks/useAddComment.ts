import { useGetProjectId } from '@/lib/hooks/useGetProjectId'
import { TTaskComment } from '@/lib/types/tasks'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { axios } from '../../axios'

type AddCommentParams = {
  taskId: string
  title: string
}

/**
 * Custom hook to add a comment to a task
 * 
 * @remarks
 * This hook:
 * - Adds a new comment to a specific task
 * - Uses project ID from context
 * - Returns the created comment data
 * - Invalidates both task list and specific task cache
 * - Shows success toast notification
 * 
 * @returns {UseMutationResult} Mutation object containing:
 *   - mutate: Function to add comment with {@link AddCommentParams}
 *   - isLoading: Boolean indicating if the mutation is in progress
 *   - error: Error object if the mutation failed
 *   - data: Created comment data ({@link TTaskComment})
 *   - Other standard react-query mutation properties
 */
export const useAddComment = () => {
  const queryClient = useQueryClient()
  const projectId = useGetProjectId()

  return useMutation({
    mutationFn: async ({ taskId, title }: AddCommentParams) => {
      const { data } = await axios.post<TTaskComment>(`/projects/${projectId}/tasks/${taskId}/comments`, { title })
      return data
    },
    onSuccess: async (_, { taskId }) => {
      await queryClient.invalidateQueries({ queryKey: ['tasks', projectId] })
      await queryClient.invalidateQueries({ queryKey: ['task', taskId] })
      toast.success('Comment added')
    }
  })
}
