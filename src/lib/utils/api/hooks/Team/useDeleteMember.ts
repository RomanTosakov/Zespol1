import { useGetProjectId } from '@/lib/hooks/useGetProjectId'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { toast } from 'sonner'
import { axios } from '../../axios'
import { useGetProfile } from '@/lib/utils/api/hooks/useGetProfile'

type DeleteMemberParams = {
  memberId: string
  profileId: string
}

/**
 * Custom hook to remove a member from the current project
 * 
 * @remarks
 * This hook:
 * - Removes a team member from the current project
 * - Handles cache invalidation for team-related queries
 * - Shows success/error toast notifications
 * - Redirects to dashboard if the user removes themselves
 * 
 * @returns {UseMutationResult} Mutation object containing:
 *   - mutate: Function to trigger member removal with {@link DeleteMemberParams}
 *   - isLoading: Boolean indicating if the mutation is in progress
 *   - error: Error object if the mutation failed
 *   - Other standard react-query mutation properties
 */
export const useDeleteMember = () => {
  const projectId = useGetProjectId()
  const queryClient = useQueryClient()
  const router = useRouter()
  const { profile } = useGetProfile()

  return useMutation({
    mutationFn: async ({ memberId }: DeleteMemberParams) => {
      const { data } = await axios.delete(`/projects/${projectId}/members/${memberId}`)
      return data
    },
    onSuccess: (_, { profileId }) => {
      queryClient.invalidateQueries({ queryKey: ['project-team', projectId] })
      queryClient.invalidateQueries({ queryKey: ['team', projectId] })
      queryClient.invalidateQueries({ queryKey: ['members', projectId] })
      
      // If the user is leaving the project (deleting themselves), redirect to dashboard
      const isSelfDeletion = profile?.id === profileId
      if (isSelfDeletion) {
        router.push('/projects/dashboard')
      }
      
      toast.success('Member removed from project successfully')
    },
    onError: () => {
      toast.error('Failed to remove member from project')
    }
  })
} 