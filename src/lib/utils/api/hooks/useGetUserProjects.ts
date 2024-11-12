import { TProject } from '@/lib/types/projects'
import { useQuery } from '@tanstack/react-query'
import { axios } from '../axios'

export const useGetUserProjects = () => {
  const { data, ...rest } = useQuery<unknown, Error, TProject[]>({
    queryKey: ['user', 'projects'],
    queryFn: () => {
      const data = axios.get(`/projects`)

      return data
    }
  })

  return { data, ...rest }
}
