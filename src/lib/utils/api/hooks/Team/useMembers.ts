import { useGetProjectId } from '@/lib/hooks/useGetProjectId'
import { TProjectMember } from '@/lib/types/org'
import { useQuery } from '@tanstack/react-query'
import { axios } from '../../axios'

export const useMembers = () => {
  const projectId = useGetProjectId()

  return useQuery({
    queryKey: ['members', projectId],
    queryFn: async () => {
      const { data } = await axios.get<TProjectMember[]>(`/projects/${projectId}/members`)
      return data
    },
    enabled: !!projectId
  })
} 