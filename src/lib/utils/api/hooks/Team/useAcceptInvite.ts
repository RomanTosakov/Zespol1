import { UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { axios } from '../../axios'

type TUseAcceptInvite = () => UseMutationResult<
  any,
  any,
  {
    id: string
    token?: string
  },
  unknown
>

export const useAcceptInvite: TUseAcceptInvite = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async form => {
      const url = form.token 
        ? `/invites/${form.id}/accept?token=${form.token}`
        : `/invites/${form.id}/accept`
      return await axios.get(url)
    },
    onSuccess: async () => {
      const promiseUser = queryClient.invalidateQueries({
        queryKey: ['user']
      })
      const promiseInvites = queryClient.invalidateQueries({
        queryKey: ['invites']
      })

      await Promise.all([promiseUser, promiseInvites])
      toast.success('Invite accepted')
    },
    onError: (error: any) => {
      console.log(error)
      toast.error('Error accepting invite')
    }
  })
}
