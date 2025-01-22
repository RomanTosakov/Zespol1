import { useGetProjectId } from '@/lib/hooks/useGetProjectId'
import { TProjectMember } from '@/lib/types/org'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { axios } from '../../axios'

type UpdateRoleParams = {
  memberId: string
  role: TProjectMember['role']
}

/**
 * Custom hook to update a team member's role in the current project
 * 
 * @remarks
 * This hook:
 * - Updates a member's role using project ID from context
 * - Invalidates team cache on success
 * - Shows success/error toast notifications
 * 
 * @returns {UseMutationResult} Mutation object containing:
 *   - mutate: Function to trigger role update with {@link UpdateRoleParams}
 *   - isLoading: Boolean indicating if the mutation is in progress
 *   - error: Error object if the mutation failed
 *   - Other standard react-query mutation properties
 */
export const useUpdateMemberRole = () => {
  const projectId = useGetProjectId()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ memberId, role }: UpdateRoleParams) => {
      const { data } = await axios.patch(
        `/projects/${projectId}/members/${memberId}`,
        { role }
      )
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-team', projectId] })
      toast.success('Member role updated successfully')
    },
    onError: () => {
      toast.error('Failed to update member role')
    }
  })
} 