import { GetServerSideProps, GetServerSidePropsContext } from 'next'

export default function Home() {
  return <div></div>
}

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const { req, res } = context

  return {
    redirect: {
      destination: '/auth',
      permanent: false
    }
  }
}
