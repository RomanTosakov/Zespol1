import { Skeleton } from '@/components/ui/skeleton'
import { useProjectTeam } from '@/lib/utils/api/hooks/Team/useProjectTeam'
import { User2 } from 'lucide-react'

export const TeamBlock = () => {
  const { data, isLoading } = useProjectTeam()

  return (
    <div className='grid h-fit w-full grid-cols-1 items-center pb-4'>
      {isLoading ? (
        <div className='flex flex-col gap-2'>
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className='h-9 w-[150px]' />
          ))}
        </div>
      ) : (
        <div className='flex w-full min-w-[150px] flex-col gap-4'>
          {data?.map(user => (
            <div key={user.id} className='flex w-full items-center gap-2 rounded-md border p-4'>
              <User2 />
              <div className='flex flex-col gap-1'>
                <p>{`${user.name} (${user.role})`}</p>
                <p className='text-xs font-extralight'>{user.email}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
