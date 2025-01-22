import { useGetProjectId } from '@/lib/hooks/useGetProjectId'
import { useQuery } from '@tanstack/react-query'
import { axios } from '../../axios'
import { TTask } from '@/lib/types/tasks'

/**
 * Custom hook to fetch all tasks for the current project
 * 
 * @remarks
 * This hook:
 * - Uses the project ID from context
 * - Only executes when project ID is available
 * - Returns tasks array under 'tasks' key instead of 'data'
 * 
 * @returns {Object} Query result object containing:
 *   - tasks: Array of project tasks ({@link TTask}[])
 *   - isLoading: Boolean indicating if the query is loading
 *   - error: Error object if the query failed
 *   - Other standard react-query properties
 */
export const useTasks = () => {
  const projectId = useGetProjectId()

  const { data, ...rest } = useQuery<unknown, Error, TTask[]>({
    queryKey: ['tasks', projectId],
    queryFn: () => {
      const data = axios.get(`/projects/${projectId}/tasks`, {})

      return data
    },
    enabled: !!projectId
  })

  return { tasks: data, ...rest }
}
