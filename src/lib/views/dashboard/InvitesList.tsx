import { Skeleton } from '@/components/ui/skeleton'
import { useGetInvites } from '@/lib/utils/api/hooks/useGetInvites'

export const InvitesList = () => {
  const { data, isLoading } = useGetInvites()

  return (
    <div className='pr-6'>
      {isLoading ? (
        <div className='flex flex-col gap-2'>
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className='h-9 w-[150px]' />
          ))}
        </div>
      ) : data?.length ? (
        <></>
      ) : (
        <div className='text-center font-semibold'>No invites found</div>
      )}
    </div>
  )
}
