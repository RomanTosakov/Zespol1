import { useQuery } from '@tanstack/react-query';
import { createBrowserSupabase } from '@/lib/utils/supabase/createBrowserSupabase';
import { Tables } from '@/lib/types/supabase-types'; // Путь к вашим типам
import { useEffect, useState } from 'react';

// Хук для получения профиля текущего пользователя
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
