import { useQuery } from '@tanstack/react-query'
import { axios } from '../../axios'
import { useGetProjectId } from '@/lib/hooks/useGetProjectId'
import { TProjectMember } from '@/lib/types/org'

/**
 * @hook useProjectTeam
 * @description Custom hook for managing project team members
 * @features
 * - Fetches team members for current project
 * - Provides team member data and loading state
 * - Auto-updates on team changes
 * @returns {Object} 
 * - data: Array of team members
 * - isLoading: Loading state
 * - error: Error state if any
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
