import { useGetProjectId } from '@/lib/hooks/useGetProjectId'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { axios } from '../../axios'

type TMemberResponse = {
  id: string
  role: string
  profile_id: string
  project_id: string
}

export const useCurrentMemberRole = () => {
  const projectId = useGetProjectId()
  const queryClient = useQueryClient()

  const invalidateRole = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: ['current-member-role', projectId]
      }),
      queryClient.invalidateQueries({
        queryKey: ['members', projectId]
      }),
      queryClient.refetchQueries({
        queryKey: ['current-member-role', projectId]
      }),
      queryClient.refetchQueries({
        queryKey: ['members', projectId]
      })
    ])
  }

  const query = useQuery({
    queryKey: ['current-member-role', projectId],
    queryFn: async () => {
      try {
        console.log('Fetching role for project:', projectId)
        
        const response = await axios.get(`/projects/${projectId}/members/me`)
        console.log('Raw response:', {
          response,
          type: typeof response,
          keys: Object.keys(response)
        })

        if (!response) {
          console.error('No response received')
          throw new Error('No response received')
        }

        const responseData = response
        console.log('Response data:', responseData)

        if (typeof responseData !== 'object' || responseData === null) {
          console.error('Response is not an object:', responseData)
          throw new Error('Invalid response type')
        }

        if (!('role' in responseData)) {
          console.error('No role property in response:', responseData)
          throw new Error('No role property in response')
        }

        if (!responseData.role) {
          console.error('Role is empty:', responseData)
          throw new Error('Empty role in response')
        }

        console.log('Successfully extracted role:', responseData.role)
        return responseData.role as string

      } catch (error: any) {
        console.error('Full error details:', {
          error,
          name: error.name,
          message: error.message,
          stack: error.stack,
          isAxiosError: error.isAxiosError,
          config: error?.config,
          response: error?.response
        })
        throw error
      }
    },
    enabled: !!projectId,
    retry: 1,
    staleTime: 30000
  })

  return {
    ...query,
    invalidateRole
  }
} 