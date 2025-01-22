import { useGetProjectId } from '@/lib/hooks/useGetProjectId'
import { TSprintForm, TSprintWithTasks } from '@/lib/types/sprints'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axios } from '../../axios'
import { toast } from 'sonner'

type TEditSprintParams = {
  formData: TSprintForm
  id: string
}

/**
 * Custom hook to edit an existing sprint
 * 
 * @remarks
 * This hook:
 * - Updates a sprint using the provided form data and sprint ID
 * - Uses project ID from context
 * - Returns the updated sprint with tasks
 * - Invalidates sprints cache on success
 * - Shows success toast notification
 * - Returns mutate function as 'editSprint' for clarity
 * 
 * @returns {UseMutationResult} Mutation object containing:
 *   - editSprint: Function to update sprint with {@link TEditSprintParams}
 *   - isLoading: Boolean indicating if the mutation is in progress
 *   - error: Error object if the mutation failed
 *   - data: Updated sprint data ({@link TSprintWithTasks})
 *   - Other standard react-query mutation properties
 */
export const useEditSprint = () => {
  const projectId = useGetProjectId()
  const queryClient = useQueryClient()

  const {
    mutate,
    isPending: isLoading,
    ...rest
  } = useMutation<TSprintWithTasks, Error, TEditSprintParams>({
    mutationFn: async ({ formData, id }: TEditSprintParams) => {
      const { data } = await axios.put(`/projects/${projectId}/sprints/${id}`, {
        formData
      })
      return data
    },
    onSuccess: async (_, { id }) => {
      await queryClient.invalidateQueries({ queryKey: ['sprints', projectId] })

      toast.success('Sprint updated successfully')
    }
  })

  return { editSprint: mutate, isLoading, ...rest }
}
