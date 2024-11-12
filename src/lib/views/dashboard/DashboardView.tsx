import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { InvitesList } from './InvitesList'

export const DashboardView = () => {
  return (
    <div className='flex h-full w-full items-center justify-center'>
      <Card>
        <CardHeader>
          <CardTitle>Projects</CardTitle>
          <CardDescription>Accept invite or create your own project</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex h-fit w-fit items-center px-4 py-9'>
            <InvitesList />

            <div className='border-l pl-6'>
              <Link href={'/projects/create'} passHref>
                <Button>Create a new project</Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
