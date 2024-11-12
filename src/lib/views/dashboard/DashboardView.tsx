import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { InvitesList } from './InvitesList'
import { ProjectsList } from './ProjectsList'
import { Separator } from '@/components/ui/separator'
import Head from 'next/head'

export const DashboardView = () => {
  return (
    <div className='flex h-full w-full items-center justify-center'>
      <Head>
        <title>Dashboard</title>
      </Head>
      <Card>
        <CardHeader>
          <CardTitle>Projects</CardTitle>
          <CardDescription>Accept invite or create your own project</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid h-fit w-fit grid-cols-2 items-center px-4 py-9'>
            <InvitesList />

            <div className='h-full border-l pl-6'>
              <Link href={'/projects/create'} passHref>
                <Button>Create a new project</Button>
              </Link>
            </div>
          </div>
          <Separator />

          <ProjectsList />
        </CardContent>
      </Card>
    </div>
  )
}
