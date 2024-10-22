import { createServerPropsSupabase } from '@/lib/utils/supabase/createServerPropsSupabase'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'

export default function Page() {
  return (
    <div>
      <h1>Projects</h1>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const supabase = createServerPropsSupabase(context)

  const { data: userData, error: userError } = await supabase.auth.getUser()

  if (userError) {
    return {
      redirect: {
        destination: '/500',
        permanent: false
      }
    }
  }

  if (!userData) {
    return {
      redirect: {
        destination: '/auth',
        permanent: false
      }
    }
  }

  const { data: usersProjects, error: projectsError } = await supabase
    .from('projects')
    .select('*, project_members!inner(*)')
    .eq('project_members.profile_id', userData.user.id)

  if (projectsError) {
    return {
      redirect: {
        destination: '/500',
        permanent: false
      }
    }
  }

  if (!usersProjects.length) {
    return {
      redirect: {
        destination: '/projects/create',
        permanent: false
      }
    }
  }

  if (usersProjects.length === 1) {
    return {
      redirect: {
        destination: `/projects/${usersProjects[0].slug}`,
        permanent: false
      }
    }
  }

  return {
    redirect: {
      destination: '/projects/dashboard',
      permanent: false
    }
  }
}
