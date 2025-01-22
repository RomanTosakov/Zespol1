import { useGetProjectId } from '@/lib/hooks/useGetProjectId'
import { TSprintWithTasks } from '@/lib/types/sprints'
import { useQuery } from '@tanstack/react-query'
import { axios } from '../../axios'

/**
 * Custom hook to fetch all sprints with their associated tasks for the current project
 * 
 * @remarks
 * This hook:
 * - Uses the project ID from context
 * - Only executes when project ID is available
 * - Returns sprints array under 'sprints' key instead of 'data'
 * - Includes associated tasks for each sprint
 * 
 * @returns {Object} Query result object containing:
 *   - sprints: Array of sprints with tasks ({@link TSprintWithTasks}[])
 *   - isLoading: Boolean indicating if the query is loading
 *   - error: Error object if the query failed
 *   - Other standard react-query properties
 */
export const useSprints = () => {
  const projectId = useGetProjectId()

  const { data, ...rest } = useQuery<unknown, Error, TSprintWithTasks[]>({
    queryKey: ['sprints', projectId],
    queryFn: () => {
      const data = axios.get(`/projects/${projectId}/sprints`, {})
      return data
    },
    enabled: !!projectId
  })

  return { sprints: data, ...rest }
}
