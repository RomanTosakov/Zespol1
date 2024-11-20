import { createServerPropsSupabase } from '@/lib/utils/supabase/createServerPropsSupabase';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { ProfileView } from '@/lib/views/profile/ProfileView';
import { TProfile } from '@/lib/types/profile';

export default function Page({ profile }: { profile: TProfile }) {
  return <ProfileView profile={profile} />;
}

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const supabase = createServerPropsSupabase(context);

  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError) {
    return {
      redirect: {
        destination: '/500',
        permanent: false,
      },
    };
  }

  if (!userData) {
    return {
      redirect: {
        destination: '/auth',
        permanent: false,
      },
    };
  }

  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userData.user.id)
    .single();

  if (profileError || !profileData) {
    return {
      redirect: {
        destination: '/500',
        permanent: false,
      },
    };
  }

  return {
    props: {
      profile: profileData,
    },
  };
};
