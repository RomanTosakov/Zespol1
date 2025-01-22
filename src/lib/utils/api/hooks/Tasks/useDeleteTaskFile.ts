import { useGetProjectId } from '@/lib/hooks/useGetProjectId'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axios } from '../../axios'

type TDeleteTaskFileParams = {
  taskId: string
  fileId: string
}

/**
 * Custom hook to delete a file attachment from a task
 * 
 * @remarks
 * This hook:
 * - Deletes a file using file ID and task ID
 * - Uses project ID from context
 * - Invalidates both task list and specific task cache
 * - Returns all mutation properties except mutate directly
 * 
 * @returns {UseMutationResult} Mutation object containing:
 *   - mutate: Function to delete file with {@link TDeleteTaskFileParams}
 *   - isLoading: Boolean indicating if the deletion is in progress
 *   - error: Error object if the deletion failed
 *   - Other standard react-query mutation properties
 */
export const useDeleteTaskFile = () => {
  const projectId = useGetProjectId()
  const queryClient = useQueryClient()

  const { ...rest } = useMutation<unknown, Error, TDeleteTaskFileParams>({
    mutationFn: async ({ taskId, fileId }) => {
      const { data } = await axios.delete(`/projects/${projectId}/tasks/${taskId}/files/${fileId}`)
      return data
    },
    onSuccess: (_, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: ['task', taskId] })
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] })
    }
  })

  return { ...rest }
}
