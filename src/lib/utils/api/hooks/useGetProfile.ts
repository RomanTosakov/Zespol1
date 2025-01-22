import { useQuery } from '@tanstack/react-query';
import { createBrowserSupabase } from '@/lib/utils/supabase/createBrowserSupabase';
import { Tables } from '@/lib/types/supabase-types'; // Путь к вашим типам
import { useEffect, useState } from 'react';

/**
 * Custom hook to fetch the current user's profile from Supabase
 * 
 * @remarks
 * This hook:
 * 1. Fetches the current user's ID from Supabase auth
 * 2. Uses the ID to fetch the complete profile from the profiles table
 * 3. Only executes the profile query when userId is available
 * 
 * @returns {Object} Object containing:
 *   - profile: User profile data from 'profiles' table ({@link Tables<'profiles'>})
 *   - isLoading: Boolean indicating if the query is loading
 *   - isError: Boolean indicating if an error occurred
 *   - error: Error object if the query failed
 */
export const useGetProfile = () => {
  const supabase = createBrowserSupabase();
    
  const [userId, setUserId] = useState<string | null>(null);

  // Получаем текущего пользователя через Supabase
  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error fetching user:', error);
      } else {
        setUserId(data.user?.id || null);
      }
    };

    fetchUser();
  }, []);

  // Запрос для получения профиля по userId
  const { data: profile, isLoading, isError, error } = useQuery<
    Tables<'profiles'>,
    Error
  >({
    queryKey: ['profile', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!userId, // Выполняем запрос, только если userId доступен
  });

  return { profile, isLoading, isError, error };
};
