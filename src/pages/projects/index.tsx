import { GetServerSideProps, GetServerSidePropsContext } from 'next'

export default function Page() {
  return (
    <div>
      <h1>Projects</h1>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const { req, res } = context

  return {
    redirect: {
      destination: '/projects/create',
      permanent: false
    }
  }
}
