import { useGetProjectId } from '@/lib/hooks/useGetProjectId'
import { TTask } from '@/lib/types/tasks'
import { useQuery } from '@tanstack/react-query'
import { axios } from '../../axios'

/**
 * Custom hook to fetch a single task by ID
 * 
 * @remarks
 * This hook:
 * - Uses the project ID from context and provided task ID
 * - Accepts optional initial task data
 * - Only executes when both project ID and task ID are available
 * - Returns task under 'task' key instead of 'data'
 * 
 * @param {Object} params - Hook parameters
 * @param {string} params.taskId - ID of the task to fetch
 * @param {TTask} [params.task] - Optional initial task data
 * 
 * @returns {Object} Query result object containing:
 *   - task: Task details ({@link TTask})
 *   - isLoading: Boolean indicating if the query is loading
 *   - error: Error object if the query failed
 *   - Other standard react-query properties
 */
export const useTask = ({ taskId, task }: { taskId: string; task?: TTask }) => {
  const projectId = useGetProjectId()

  const { data, ...rest } = useQuery<unknown, Error, TTask>({
    queryKey: ['task', taskId],
    queryFn: () => {
      const data = axios.get(`/projects/${projectId}/tasks/${taskId}`, {})
      return data
    },
    initialData: task,
    enabled: !!projectId && !!taskId
  })

  return { task: data, ...rest }
}
