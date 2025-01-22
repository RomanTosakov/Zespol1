import { useGetProjectId } from '@/lib/hooks/useGetProjectId'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { toast } from 'sonner'
import { axios } from '../axios'

/**
 * Custom hook to delete the current project
 * 
 * @remarks
 * This hook:
 * - Deletes the current project using the project ID from context
 * - Shows success/error toast notifications
 * - Redirects to home page on successful deletion
 * 
 * @returns {UseMutationResult} Mutation object containing:
 *   - mutate: Function to trigger project deletion
 *   - isLoading: Boolean indicating if the deletion is in progress
 *   - error: Error object if the deletion failed
 *   - Other standard react-query mutation properties
 */
export const useDeleteProject = () => {
  const projectId = useGetProjectId()
  const router = useRouter()

  return useMutation({
    mutationFn: async () => {
      return await axios.delete(`/projects/${projectId}`)
    },
    onSuccess: () => {
      toast.success('Project deleted successfully')
      router.push('/')
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || 'Failed to delete project')
    }
  })
} 