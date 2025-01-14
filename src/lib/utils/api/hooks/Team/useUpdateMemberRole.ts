import { useGetProjectId } from '@/lib/hooks/useGetProjectId'
import { TProjectMember } from '@/lib/types/org'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { axios } from '../../axios'

type UpdateRoleParams = {
  memberId: string
  role: TProjectMember['role']
}

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