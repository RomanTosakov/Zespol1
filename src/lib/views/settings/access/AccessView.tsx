/**
 * @component AccessView
 * @description Manages project access and member permissions
 * @features
 * - Member role management
 * - Access control
 * - Member removal
 * - Role-based permissions
 * @hooks
 * - useProjectTeam: Fetches team member data
 */

import { Card } from '@/components/ui/card'
import { useProjectTeam } from '@/lib/utils/api/hooks/Team/useProjectTeam'
import { MemberRow } from './components/MemberRow'
import { Skeleton } from '@/components/ui/skeleton'

export const AccessView = () => {
  const { data: members, isLoading } = useProjectTeam()

  return (
    <div className='flex w-full flex-col gap-4 p-16'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-semibold'>Access Management</h1>
      </div>

      <Card className='w-full'>
        <div className='flex w-full flex-col'>
          <div className='grid grid-cols-4 gap-4 border-b p-4 font-medium'>
            <div>Name</div>
            <div>Email</div>
            <div>Role</div>
            <div className='text-right'>Actions</div>
          </div>

          {isLoading ? (
            <div className='flex flex-col gap-4 p-4'>
              {[...Array(5)].map((_, i) => (
                <div key={i} className='grid grid-cols-4 gap-4'>
                  <Skeleton className='h-8 w-full' />
                  <Skeleton className='h-8 w-full' />
                  <Skeleton className='h-8 w-full' />
                  <Skeleton className='h-8 w-full' />
                </div>
              ))}
            </div>
          ) : (
            <div className='flex flex-col'>
              {members?.map(member => (
                <MemberRow key={member.id} member={member} />
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
