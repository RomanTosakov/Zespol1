import { useGetProjectId } from '@/lib/hooks/useGetProjectId'
import { TSprintWithTasks } from '@/lib/types/sprints'
import { useQuery } from '@tanstack/react-query'
import { axios } from '../../axios'

/**
 * @hook useSprints
 * @description Custom hook for managing project sprints
 * @features
 * - Fetches all sprints for current project
 * - Provides sprint data and loading state
 * - Auto-updates on sprint changes
 * - Handles sprint caching
 * @returns {Object}
 * - sprints: Array of project sprints with tasks
 * - isLoading: Loading state
 * - error: Error state if any
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
