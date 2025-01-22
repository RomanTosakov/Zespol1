import { useGetProjectId } from '@/lib/hooks/useGetProjectId'
import { TProject } from '@/lib/types/org'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { axios } from '../axios'

/**
 * Custom hook to update a project's details
 * 
 * @remarks
 * This hook uses the current project ID from context and handles:
 * - Updating project data via API
 * - Cache invalidation for project and tasks
 * - Success/error toast notifications
 * 
 * @returns {UseMutationResult} Mutation object containing:
 *   - mutate: Function to trigger the project update
 *   - isLoading: Boolean indicating if the mutation is in progress
 *   - error: Error object if the mutation failed
 *   - Other standard react-query mutation properties
 */
export const useUpdateProject = () => {
  const projectId = useGetProjectId()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (formData: TProject) => {
      return await axios.patch(`/projects/${projectId}`, {
        formData
      })
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['project', projectId]
      })
      await queryClient.invalidateQueries({
        queryKey: ['tasks', projectId]
      })
      toast.success('Project updated successfully')
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || 'Failed to update project')
    }
  })
} 