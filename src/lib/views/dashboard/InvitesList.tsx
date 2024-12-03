import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useAcceptInvite } from '@/lib/utils/api/hooks/Team/useAcceptInvite'
import { useGetInvites } from '@/lib/utils/api/hooks/useGetInvites'

export const InvitesList = () => {
  const { data, isLoading } = useGetInvites()
  const acceptInvite = useAcceptInvite()

  return (
    <div className='pr-6'>
      {isLoading ? (
        <div className='flex flex-col gap-2'>
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className='h-9 w-[150px]' />
          ))}
        </div>
      ) : data?.length ? (
        <div className='flex w-full flex-col gap-4'>
          {data.map(invite => (
            <div key={invite.id} className='flex w-full items-center gap-2 rounded-md border p-4'>
              <div className='flex flex-col gap-2'>
                <p>{`Invited to project ${invite.project.name}`}</p>

                <Button
                  isLoading={acceptInvite.isPending}
                  onClick={() => {
                    acceptInvite.mutate({ id: invite.id })
                  }}
                >
                  Accept
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className='text-center font-semibold'>No invites found</div>
      )}
    </div>
  )
}
