import { useGetProjectId } from '@/lib/hooks/useGetProjectId'
import { TSprintWithTasks } from '@/lib/types/sprints'
import { useQuery } from '@tanstack/react-query'
import { axios } from '../../axios'

export const useSprint = (sprintId: string) => {
  const projectId = useGetProjectId()

  const { data, ...rest } = useQuery<unknown, Error, TSprintWithTasks>({
    queryKey: ['sprints', projectId, sprintId],
    queryFn: () => {
      const data = axios.get(`/projects/${projectId}/sprints/${sprintId}`, {})
      return data
    },
    enabled: !!projectId && !!sprintId
  })

  return { sprint: data, ...rest }
}
