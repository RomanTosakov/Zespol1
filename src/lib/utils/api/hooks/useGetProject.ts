import { useGetProjectId } from '@/lib/hooks/useGetProjectId'
import { TProject } from '@/lib/types/org'
import { useQuery } from '@tanstack/react-query'
import { axios } from '../axios'

export const useGetProject = () => {
  const projectId = useGetProjectId()

  const { data, ...rest } = useQuery<unknown, Error, TProject>({
    queryKey: ['project', projectId],
    queryFn: () => {
      const data = axios.get(`/projects/${projectId}`, {})
      return data
    },
    enabled: !!projectId
  })

  return { data, ...rest }
} 