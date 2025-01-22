import { TProfile } from '@/lib/types/profile'
import { useQuery } from '@tanstack/react-query'
import { axios } from '../axios'

/**
 * Custom hook to fetch the current user's profile
 * 
 * @remarks
 * Uses a 1-hour stale time to minimize unnecessary refetches
 * 
 * @returns {Object} Query result object containing:
 *   - data: Current user's profile ({@link TProfile})
 *   - isLoading: Boolean indicating if the query is loading
 *   - error: Error object if the query failed
 *   - Other standard react-query properties
 */
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
