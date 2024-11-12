import { useQuery } from '@tanstack/react-query'
import { axios } from '../axios'
import { TInvites } from '@/lib/types/invites'

export const useGetInvites = () => {
  const { data, ...rest } = useQuery<unknown, Error, TInvites[]>({
    queryKey: ['invites'],
    queryFn: () => {
      const data = axios.get(`/invites`, {})

      return data
    }
  })

  return { data, ...rest }
}
