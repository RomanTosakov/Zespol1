import { TProfile } from '@/lib/types/profile';
import { useQuery } from '@tanstack/react-query';
import { axios } from '../axios';

/**
 * Custom hook to fetch a specific user's profile by their ID
 * 
 * @param {string} userId - The ID of the user whose profile to fetch
 * 
 * @returns {Object} Query result object containing:
 *   - data: User profile data ({@link TProfile})
 *   - isLoading: Boolean indicating if the query is loading
 *   - error: Error object if the query failed
 *   - Other standard react-query properties
 */
export const useGetUserProfile = (userId: string) => {
  const { data, ...rest } = useQuery<TProfile, Error>({
    queryKey: ['user', 'profile', userId],
    queryFn: async () => {
      const response = await axios.get(`/profiles/${userId}`);
      return response.data;
    },
  });

  return { data, ...rest };
};
