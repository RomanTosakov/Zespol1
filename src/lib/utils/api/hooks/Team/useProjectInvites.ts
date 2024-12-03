import { useGetProjectId } from '@/lib/hooks/useGetProjectId'
import { TInvites } from '@/lib/types/invites'
import { useQuery } from '@tanstack/react-query'
import { axios } from '../../axios'

export const useProjectInvites = () => {
  const projectId = useGetProjectId()

  const { data, ...rest } = useQuery<unknown, Error, TInvites[]>({
    queryKey: ['invites', projectId],
    queryFn: () => {
      const data = axios.get(`/projects/${projectId}/team/invites`)

      return data
    }
  })

  return { data, ...rest }
}
