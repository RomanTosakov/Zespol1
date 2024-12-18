import { useGetProjectId } from '@/lib/hooks/useGetProjectId'
import { useQuery } from '@tanstack/react-query'
import { axios } from '../../axios'
import { TTask } from '@/lib/types/tasks'

export const useTasks = () => {
  const projectId = useGetProjectId()

  const { data, ...rest } = useQuery<unknown, Error, TTask[]>({
    queryKey: ['tasks', projectId],
    queryFn: () => {
      const data = axios.get(`/projects/${projectId}/tasks`, {})

      return data
    },
    staleTime: 1000 * 60 * 60
  })

  return { tasks: data, ...rest }
}
