import { useQuery } from '@tanstack/react-query'
import { axios } from '../../axios'
import { useGetProjectId } from '@/lib/hooks/useGetProjectId'
import { TProjectMember } from '@/lib/types/org'

export const useProjectTeam = () => {
  const projectId = useGetProjectId()

  const { data, ...rest } = useQuery<unknown, Error, TProjectMember[]>({
    queryKey: ['team', projectId],
    queryFn: () => {
      const data = axios.get(`/projects/${projectId}/team`)

      return data
    }
  })

  return { data, ...rest }
}
