import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Separator } from '@/components/ui/separator'
import Head from 'next/head'

export const ProfileView = () => {
  return (
    <div className='flex h-full w-full items-center justify-center'>
      <Head>
        <title>Dashboard</title>
      </Head>
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Information</CardDescription>
        </CardHeader>
        <CardContent>
          
        </CardContent>
      </Card>
    </div>
  )
}
