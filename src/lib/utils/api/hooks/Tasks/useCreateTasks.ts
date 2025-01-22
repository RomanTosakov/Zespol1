import { useGetProjectId } from '@/lib/hooks/useGetProjectId'
import { TTaskForm } from '@/lib/types/tasks'
import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { axios } from '../../axios'

type TUseCreateTask = () => UseMutationResult<any, any, TTaskForm, unknown>

/**
 * Custom hook to create a new task in the current project
 * 
 * @remarks
 * This hook:
 * - Creates a new task using the provided form data
 * - Uses project ID from context
 * - Invalidates both tasks and sprints cache on success
 * - Shows success/error toast notifications
 * 
 * @returns {UseMutationResult} Mutation object containing:
 *   - mutate: Function to trigger task creation with {@link TTaskForm} data
 *   - isLoading: Boolean indicating if the mutation is in progress
 *   - error: Error object if the mutation failed
 *   - Other standard react-query mutation properties
 */
export const useCreateTask: TUseCreateTask = () => {
  const projectId = useGetProjectId()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async form => {
      return await axios.post(`/projects/${projectId}/tasks`, {
        formData: form
      })
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['tasks', projectId]
      })

      await queryClient.invalidateQueries({
        queryKey: ['sprints', projectId]
      })

      toast.success('Task created')
    },

    onError: error => {
      toast.error('Error while creating task')
    }
  })
}
