import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import Head from 'next/head'
import { ProjectsList } from '../dashboard/ProjectsList'
import { InvitesBlock } from './InvitesBlock'
import { TeamBlock } from './TeamBlock'

export const TeamsView = () => {
  return (
    <div className='flex h-full w-full items-center justify-center'>
      <Head>
        <title>Dashboard</title>
      </Head>
      <Card>
        <CardHeader>
          <CardTitle>Team</CardTitle>
          <CardDescription>Project team</CardDescription>
        </CardHeader>
        <CardContent>
          <TeamBlock />

          <Separator />

          <InvitesBlock />
        </CardContent>
      </Card>
    </div>
  )
}
