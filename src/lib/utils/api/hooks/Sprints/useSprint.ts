import { TSprint, TSprintWithTasks } from '@/lib/types/sprints'
import { useQuery } from '@tanstack/react-query'
import { axios } from '../../axios'
import { useGetProjectId } from '@/lib/hooks/useGetProjectId'

/**
 * Custom hook to fetch a single sprint with its associated tasks
 * 
 * @remarks
 * This hook:
 * - Uses the project ID from context and provided sprint ID
 * - Only executes when both project ID and sprint ID are available
 * - Returns sprint under 'sprint' key instead of 'data'
 * - Includes associated tasks for the sprint
 * 
 * @param {string} sprintId - ID of the sprint to fetch
 * 
 * @returns {Object} Query result object containing:
 *   - sprint: Sprint details with tasks ({@link TSprintWithTasks})
 *   - isLoading: Boolean indicating if the query is loading
 *   - error: Error object if the query failed
 *   - Other standard react-query properties
 */
export const useSprint = (sprintId: string) => {
  const projectId = useGetProjectId()

  const { data: sprint, ...rest } = useQuery<TSprintWithTasks>({
    queryKey: ['sprints', projectId, sprintId],
    queryFn: async () => {
      const data = await axios.get(`/projects/${projectId}/sprints/${sprintId}`)

      return data as unknown as TSprintWithTasks
    },
    enabled: !!projectId && !!sprintId
  })

  return {
    sprint,
    ...rest
  }
}
