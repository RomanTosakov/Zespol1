import { useGetProjectId } from '@/lib/hooks/useGetProjectId'
import { TInvites } from '@/lib/types/invites'
import { useQuery } from '@tanstack/react-query'
import { axios } from '../../axios'

/**
 * Custom hook to fetch all pending invites for the current project
 * 
 * @remarks
 * Uses the project ID from context to fetch pending team invitations
 * 
 * @returns {Object} Query result object containing:
 *   - data: Array of project invites ({@link TInvites}[])
 *   - isLoading: Boolean indicating if the query is loading
 *   - error: Error object if the query failed
 *   - Other standard react-query properties
 */
export const useProjectInvites = () => {
  const projectId = useGetProjectId()

  const { data, ...rest } = useQuery<unknown, Error, TInvites[]>({
    queryKey: ['invites', projectId],
    queryFn: () => {
      const data = axios.get(`/projects/${projectId}/team/invites`)

      return data
    }
  })

  return { data, ...rest }
}
