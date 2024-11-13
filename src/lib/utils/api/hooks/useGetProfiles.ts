import { TProfile } from '@/lib/types/profile';
import { useQuery } from '@tanstack/react-query';
import { axios } from '../axios';

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
