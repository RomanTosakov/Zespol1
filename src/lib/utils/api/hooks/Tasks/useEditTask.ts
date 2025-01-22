import { useGetProjectId } from '@/lib/hooks/useGetProjectId'
import { TTask } from '@/lib/types/tasks'
import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { axios } from '../../axios'

type TUseEditTask = () => UseMutationResult<
  any,
  any,
  {
    formData: TTask
    id: string
  },
  unknown
>

/**
 * Custom hook to edit an existing task
 * 
 * @remarks
 * This hook:
 * - Updates a task using the provided task data and ID
 * - Uses project ID from context
 * - Invalidates tasks, task details, and sprints cache on success
 * - Shows success/error toast notifications
 * - Returns the updated task data
 * 
 * @returns {UseMutationResult} Mutation object containing:
 *   - mutate: Function to trigger task update with { formData: {@link TTask}, id: string }
 *   - isLoading: Boolean indicating if the mutation is in progress
 *   - error: Error object if the mutation failed
 *   - Other standard react-query mutation properties
 */
export const useEditTask: TUseEditTask = () => {
  const projectId = useGetProjectId()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ formData: form, id }) => {
      return (await axios.patch(`/projects/${projectId}/tasks/${id}`, {
        formData: form
      })) as TTask
    },
    onSuccess: async data => {
      queryClient.invalidateQueries({
        queryKey: ['tasks', projectId]
      })

      queryClient.invalidateQueries({
        queryKey: ['task']
      })

      await queryClient.invalidateQueries({
        queryKey: ['sprints']
      })

      toast.success('Task edited')
    },

    onError: error => {
      toast.error('Error while editing task')
    }
  })
}
