import { Button } from '@/components/ui/button'
import { useSprints } from '@/lib/utils/api/hooks/Sprints/useSprints'
import { PlusIcon } from 'lucide-react'
import { SprintRow } from './components/SprintRow'
import { CreateSprintDialog } from './components/CreateSprintDialog'
import NiceModal from '@ebay/nice-modal-react'
import { Skeleton } from '@/components/ui/skeleton'
import { useCurrentMemberRole } from '@/lib/utils/api/hooks/Team/useCurrentMemberRole'

export const SprintView = () => {
  const { sprints, isLoading } = useSprints()
  const { data: currentRole } = useCurrentMemberRole()

  const canCreateSprints = ['administrator', 'owner'].includes(currentRole?.toLowerCase() || '')

  const handleCreateSprint = () => {
    NiceModal.show(CreateSprintDialog)
  }

  return (
    <div className='w-full space-y-6 p-6'>
      <div className='flex w-full items-center justify-between'>
        <h1 className='text-2xl font-bold'>Sprints</h1>
        {canCreateSprints && (
          <Button onClick={handleCreateSprint}>
            <PlusIcon className='mr-2 h-4 w-4' />
            New Sprint
          </Button>
        )}
      </div>

      <div className='space-y-2'>
        {isLoading ? (
          <>
            <Skeleton className='h-11 w-full' />
            <Skeleton className='h-11 w-full' />
            <Skeleton className='h-11 w-full' />
          </>
        ) : sprints?.length === 0 ? (
          <div className='flex h-32 items-center justify-center rounded-md border border-dashed'>
            <div className='text-center'>
              <h3 className='text-lg font-medium'>No sprints yet</h3>
              <p className='text-sm text-muted-foreground'>Create a sprint to get started</p>
            </div>
          </div>
        ) : (
          sprints?.map(sprint => <SprintRow key={sprint.id} sprint={sprint} />)
        )}
      </div>
    </div>
  )
}
