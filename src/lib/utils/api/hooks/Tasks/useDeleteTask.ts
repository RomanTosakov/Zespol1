import { useGetProjectId } from '@/lib/hooks/useGetProjectId'
import { TTask } from '@/lib/types/tasks'
import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { axios } from '../../axios'

type TUseDeleteTask = () => UseMutationResult<
  any,
  any,
  {
    taskId: string
  },
  unknown
>

/**
 * Custom hook to delete a task from the current project
 * 
 * @remarks
 * This hook:
 * - Deletes a task using the provided task ID
 * - Uses project ID from context
 * - Invalidates tasks cache on success
 * - Shows success/error toast notifications
 * 
 * @returns {UseMutationResult} Mutation object containing:
 *   - mutate: Function to trigger task deletion with { taskId: string }
 *   - isLoading: Boolean indicating if the mutation is in progress
 *   - error: Error object if the mutation failed
 *   - Other standard react-query mutation properties
 */
export const useDeleteTask: TUseDeleteTask = () => {
  const projectId = useGetProjectId()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ taskId }) => {
      return await axios.delete(`/projects/${projectId}/tasks/${taskId}`)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['tasks', projectId]
      })

      toast.success('Task deleted')
    },
    onError: error => {
      toast.error('Error while deleting task')
    }
  })
}
