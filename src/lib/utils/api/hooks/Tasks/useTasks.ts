import { useGetProjectId } from '@/lib/hooks/useGetProjectId'
import { useQuery } from '@tanstack/react-query'
import { axios } from '../../axios'
import { TTask } from '@/lib/types/tasks'

/**
 * @hook useTasks
 * @description Custom hook for managing project tasks
 * @features
 * - Fetches all tasks for current project
 * - Provides task data and loading state
 * - Auto-updates on task changes
 * - Handles task caching
 * @returns {Object}
 * - tasks: Array of project tasks
 * - isLoading: Loading state
 * - error: Error state if any
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
