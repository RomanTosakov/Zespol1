import { TSprint, TSprintWithTasks } from '@/lib/types/sprints'
import { useQuery } from '@tanstack/react-query'
import { axios } from '../../axios'
import { useGetProjectId } from '@/lib/hooks/useGetProjectId'

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
