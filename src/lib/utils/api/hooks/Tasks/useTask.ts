import { useGetProjectId } from '@/lib/hooks/useGetProjectId'
import { TTask } from '@/lib/types/tasks'
import { useQuery } from '@tanstack/react-query'
import { axios } from '../../axios'

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
