import { useQuery } from '@tanstack/react-query'
import { axios } from '../axios'
import { TInvites, TUserInvite } from '@/lib/types/invites'

export const useGetInvites = () => {
  const { data, ...rest } = useQuery<unknown, Error, TUserInvite[]>({
    queryKey: ['invites'],
    queryFn: async () => {
      const response = await axios.get(`/invites`)
      return response
    }
  })

  return { data, ...rest }
}
