import { createServerPropsSupabase } from '@/lib/utils/supabase/createServerPropsSupabase'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'

/**
 * @page Index
 * @description Landing page with authentication routing
 * @features
 * - Authentication check
 * - Route redirection
 * - Session management
 * @redirects
 * - /projects: Authenticated users
 * - /auth: Unauthenticated users
 * - /500: Server errors
 */

export default function Home() {
  return null
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

  if (userData) {
    return {
      redirect: {
        destination: '/projects',
        permanent: false
      }
    }
  }

  return {
    redirect: {
      destination: '/auth',
      permanent: false
    }
  }
}
