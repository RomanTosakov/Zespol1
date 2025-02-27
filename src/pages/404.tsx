import { useRouter } from 'next/router'
import { useEffect } from 'react'

const Page = () => {
  const router = useRouter()

  useEffect(() => {
    router.push('/')
  }, [router])

  return <></>
}

export default Page
