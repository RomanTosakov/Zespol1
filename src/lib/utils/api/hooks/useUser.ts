import { TProfile } from '@/lib/types/profile'
import { useQuery } from '@tanstack/react-query'
import { axios } from '../axios'

export const useUser = () => {
  const { data, ...rest } = useQuery<unknown, Error, TProfile>({
    queryKey: ['user'],
    queryFn: () => {
      const data = axios.get(`/user`, {})

      return data
    },
    staleTime: 1000 * 60 * 60
  })

  return { data, ...rest }
}
