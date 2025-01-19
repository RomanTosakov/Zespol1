import { UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { axios } from '../../axios'
import { useRouter } from 'next/router'
import { AxiosError } from 'axios'

type TAcceptInviteParams = {
  id: string
  token: string
}

type TUseAcceptInvite = () => UseMutationResult<
  any,
  any,
  TAcceptInviteParams,
  unknown
>

export const useAcceptInvite: TUseAcceptInvite = () => {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: async ({ id, token }) => {
      try {
        console.log('Accepting invite:', { id, token })
        const response = await axios.get(`/invites/${id}/accept`, {
          params: { token }
        })
        
        console.log('Accept invite response:', response)
        
        if (!response) {
          throw new Error('Failed to accept invite')
        }
        return response
      } catch (error) {
        console.error('Error accepting invite:', error)
        if (error instanceof AxiosError) {
          console.error('Error details:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
          })
        }
        throw error
      }
    },
    onSuccess: async (response) => {
      try {
        console.log('Successfully accepted invite:', response)
        
        // Invalidate all relevant queries
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ['user'] }),
          queryClient.invalidateQueries({ queryKey: ['invites'] }),
          queryClient.invalidateQueries({ queryKey: ['projects'] }),
          queryClient.invalidateQueries({ queryKey: ['user', 'projects'] })
        ])

        toast.success('Successfully joined the project')

        // Force reload the page to ensure we get fresh data
        window.location.reload()
      } catch (error) {
        console.error('Error updating cache after invite acceptance:', error)
        toast.error('Error updating project data')
      }
    },
    onError: (error: any) => {
      console.error('Invite acceptance error:', error?.response?.data || error)
      
      const errorMessage = error?.response?.data?.error || 'Error accepting invite'
      toast.error(errorMessage)

      if (error?.response?.status === 401) {
        router.push('/auth')
      }
    }
  })
}
