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

/**
 * Custom hook to accept a project invitation
 * 
 * @remarks
 * This hook:
 * - Accepts a project invitation using invite ID and optional token
 * - Invalidates user and invites cache on success
 * - Shows success/error toast notifications
 * - Supports both authenticated and token-based invite acceptance
 * 
 * @returns {UseMutationResult} Mutation object containing:
 *   - mutate: Function to accept invite with { id: string, token?: string }
 *   - isLoading: Boolean indicating if the mutation is in progress
 *   - error: Error object if the mutation failed
 *   - Other standard react-query mutation properties
 */
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
