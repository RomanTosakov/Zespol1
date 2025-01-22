import { useQuery } from '@tanstack/react-query'
import { axios } from '../../axios'
import { useGetProjectId } from '@/lib/hooks/useGetProjectId'
import { TProjectMember } from '@/lib/types/org'

/**
 * Custom hook to fetch all team members of the current project
 * 
 * @remarks
 * Uses the project ID from context to fetch the team members list
 * 
 * @returns {Object} Query result object containing:
 *   - data: Array of project team members ({@link TProjectMember}[])
 *   - isLoading: Boolean indicating if the query is loading
 *   - error: Error object if the query failed
 *   - Other standard react-query properties
 */
export const useProjectTeam = () => {
  const projectId = useGetProjectId()

  const { data, ...rest } = useQuery<unknown, Error, TProjectMember[]>({
    queryKey: ['team', projectId],
    queryFn: () => {
      const data = axios.get(`/projects/${projectId}/team`)

      return data
    }
  })

  return { data, ...rest }
}
