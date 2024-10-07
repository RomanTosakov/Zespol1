import { createServerPropsSupabase } from '@/lib/utils/supabase/createServerPropsSupabase'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'

export default function Page() {
  return <></>
}

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const supabase = createServerPropsSupabase(context)

  const { error } = await supabase.auth.signOut({ scope: 'local' })

  if (error) {
    return {
      redirect: {
        destination: '/500',
        permanent: false
      }
    }
  }

  return {
    redirect: {
      destination: `/auth`,
      permanent: false
    }
  }
}
