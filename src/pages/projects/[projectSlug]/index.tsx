import { GetServerSidePropsContext } from 'next'

const Page = () => {
  return <></>
}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const { params } = context

  return {
    redirect: {
      destination: `/projects/${params?.projectSlug}/boards/backlog`,
      permanent: false
    }
  }
}

export default Page
