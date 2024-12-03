import { useGetProjectId } from '@/lib/hooks/useGetProjectId'
import { UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { axios } from '../../axios'

type TUseCreateInvite = () => UseMutationResult<
  any,
  any,
  {
    email: string
  },
  unknown
>

export const useCreateInvite: TUseCreateInvite = () => {
  const projectId = useGetProjectId()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async form => {
      return await axios.post(`/projects/${projectId}/team/invites`, {
        formData: form
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['invites', projectId]
      })
      toast.success('Invite sent')
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
