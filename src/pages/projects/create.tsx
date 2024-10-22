import { GetStaticProps, GetStaticPropsContext } from 'next'

export default function Page() {
  return <div></div>
}

export const getStaticProps: GetStaticProps = async (context: GetStaticPropsContext) => {
  const { params } = context

  return {
    props: {
      isPublic: false,
      isCreateOrg: true
    }
  }
}
