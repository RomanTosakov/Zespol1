import { useGetProjectId } from '@/lib/hooks/useGetProjectId'
import { TProject } from '@/lib/types/org'
import { useQuery } from '@tanstack/react-query'
import { axios } from '../axios'

/**
 * Custom hook to fetch details of the current project
 * 
 * @remarks
 * This hook:
 * - Uses the project ID from context
 * - Only executes the query when a project ID is available
 * 
 * @returns {Object} Query result object containing:
 *   - data: Project details ({@link TProject})
 *   - isLoading: Boolean indicating if the query is loading
 *   - error: Error object if the query failed
 *   - Other standard react-query properties
 */
export const useGetProject = () => {
  const projectId = useGetProjectId()

  const { data, ...rest } = useQuery<unknown, Error, TProject>({
    queryKey: ['project', projectId],
    queryFn: () => {
      const data = axios.get(`/projects/${projectId}`, {})
      return data
    },
    enabled: !!projectId
  })

  return { data, ...rest }
} 