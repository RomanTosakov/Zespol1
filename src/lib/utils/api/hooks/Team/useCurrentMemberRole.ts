import { useGetProjectId } from '@/lib/hooks/useGetProjectId'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { axios } from '../../axios'

type TMemberResponse = {
  id: string
  role: string
  profile_id: string
  project_id: string
}

/**
 * Custom hook to fetch and manage the current user's role in the project
 * 
 * @remarks
 * This hook:
 * - Fetches the current user's role in the project
 * - Provides a function to invalidate and refetch role data
 * - Includes extensive error handling and logging
 * - Uses a 30-second stale time for caching
 * - Only retries failed requests once
 * - Only executes when project ID is available
 * 
 * @returns {Object} Extended query result object containing:
 *   - data: Current user's role (string)
 *   - isLoading: Boolean indicating if the query is loading
 *   - error: Error object if the query failed
 *   - invalidateRole: Function to force refresh role data
 *   - Other standard react-query properties
 */
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