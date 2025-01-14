import { useGetProjectId } from '@/lib/hooks/useGetProjectId'
import { TSprintWithTasks } from '@/lib/types/sprints'
import { useQuery } from '@tanstack/react-query'
import { axios } from '../../axios'

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
