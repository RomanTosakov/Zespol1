import { TProject } from '@/lib/types/projects'
import { useQuery } from '@tanstack/react-query'
import { axios } from '../axios'

/**
 * Custom hook to fetch all projects for the current user
 * 
 * @returns {Object} Query result object containing:
 *   - data: Array of user's projects ({@link TProject}[])
 *   - isLoading: Boolean indicating if the query is loading
 *   - error: Error object if the query failed
 *   - Other standard react-query properties
 */
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
