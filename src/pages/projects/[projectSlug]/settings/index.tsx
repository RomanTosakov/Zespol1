import React from 'react'
import { GetServerSidePropsContext } from 'next'

const Page = () => {
  return <></>
}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const { params } = context

  return {
    redirect: {
      destination: `/projects/${params?.projectSlug}/settings/details`,
      permanent: false
    }
  }
}

export default Page 