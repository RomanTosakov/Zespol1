import { useGetProjectId } from '@/lib/hooks/useGetProjectId'
import { TProjectMember } from '@/lib/types/org'
import { useQuery } from '@tanstack/react-query'
import { axios } from '../../axios'

/**
 * Custom hook to fetch all members of the current project
 * 
 * @remarks
 * This hook:
 * - Uses the project ID from context
 * - Only executes when project ID is available
 * - Returns detailed member information including roles
 * 
 * @returns {UseQueryResult} Query result object containing:
 *   - data: Array of project members ({@link TProjectMember}[])
 *   - isLoading: Boolean indicating if the query is loading
 *   - error: Error object if the query failed
 *   - Other standard react-query properties
 */
export const useMembers = () => {
  const projectId = useGetProjectId()

  return useQuery({
    queryKey: ['members', projectId],
    queryFn: async () => {
      const { data } = await axios.get<TProjectMember[]>(`/projects/${projectId}/members`)
      return data
    },
    enabled: !!projectId
  })
} 