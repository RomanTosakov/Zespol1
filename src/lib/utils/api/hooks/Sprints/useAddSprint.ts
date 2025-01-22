import { useGetProjectId } from '@/lib/hooks/useGetProjectId'
import { TSprintForm, TSprintWithTasks } from '@/lib/types/sprints'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axios } from '../../axios'

/**
 * Custom hook to create a new sprint in the current project
 * 
 * @remarks
 * This hook:
 * - Creates a new sprint using the provided form data
 * - Uses project ID from context
 * - Returns the created sprint with tasks
 * - Invalidates sprints cache on success
 * - Returns mutate function as 'addSprint' for clarity
 * 
 * @returns {UseMutationResult} Mutation object containing:
 *   - addSprint: Function to create sprint with {@link TSprintForm} data
 *   - isLoading: Boolean indicating if the mutation is in progress
 *   - error: Error object if the mutation failed
 *   - data: Created sprint data ({@link TSprintWithTasks})
 *   - Other standard react-query mutation properties
 */
export const useAddSprint = () => {
  const projectId = useGetProjectId()
  const queryClient = useQueryClient()

  const {
    mutate,
    isPending: isLoading,
    ...rest
  } = useMutation<TSprintWithTasks, Error, TSprintForm>({
    mutationFn: async (formData: TSprintForm) => {
      const { data } = await axios.post(`/projects/${projectId}/sprints`, {
        formData
      })
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sprints', projectId] })
    }
  })

  return { addSprint: mutate, isLoading, ...rest }
}
