import { useGetProjectId } from '@/lib/hooks/useGetProjectId'
import { UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { axios } from '../../axios'
import { useGetProfile } from '../useGetProfile'
import { TProjectRole } from '@/lib/types/org'

type TInviteRole = Exclude<TProjectRole, 'owner'>

type TUseCreateInvite = () => UseMutationResult<
  any,
  any,
  {
    email: string
    role: TInviteRole
  },
  unknown
>

export const useCreateInvite: TUseCreateInvite = () => {
  const { profile: inviter, isLoading, isError, error: userError } = useGetProfile();
  const projectId = useGetProjectId()
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async form => {
      return await axios.post(`/projects/${projectId}/team/invites`, {
        formData: form
      })
    },
    onSuccess: async (data, form) => {
      queryClient.invalidateQueries({
        queryKey: ['invites', projectId]
      })
      queryClient.invalidateQueries({
        queryKey: ['projects', projectId]
      })

      if (!inviter) {
        toast.error('Failed to get inviter information')
        return
      }

      try {
        await axios.post('/send', {
          email: form.email,
          projectId: projectId,
          inviter: {
            name: inviter.name || 'Team Member',
            email: inviter.email
          }
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        toast.success('Invite sent and email notification delivered');
      } catch (error) {
        console.error('Failed to send email notification:', error);
        toast.error('Invite created but failed to send email notification');
      }
    },
    onError: (error: any) => {
      console.log(error)

      switch (error.status) {
        case 422:
          toast.error('Invalid email')
          break
        case 408:
          toast.error('User already invited')
          break
        case 409:
          toast.error('User already in team')
          break
        default:
          toast.error('Error sending invite')
          break
      }
    }
  })
}
