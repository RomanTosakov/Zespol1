import { TSprintWithTasks } from '@/lib/types/sprints'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { useRouter } from 'next/router'

type SprintRowProps = {
  sprint: TSprintWithTasks
}

export const SprintRow: React.FC<SprintRowProps> = ({ sprint }) => {
  const router = useRouter()
  const { projectSlug } = router.query as { projectSlug: string }

  const handleClick = () => {
    router.push(`/projects/${projectSlug}/boards/sprints/${sprint.id}`)
  }

  return (
    <div
      className='flex h-11 w-full cursor-pointer items-center justify-between rounded-md bg-secondary-dimmed px-4 hover:bg-accent'
      onClick={handleClick}
    >
      <div className='flex items-center gap-2'>
        <h3 className='font-medium'>{sprint.name}</h3>
        <span className='text-sm text-muted-foreground'>({sprint.tasks?.length || 0} tasks)</span>
      </div>
      <div className='flex items-center gap-4'>
        {sprint.start_date && (
          <div className='flex items-center gap-2'>
            <CalendarIcon className='h-4 w-4 text-muted-foreground' />
            <p className='text-sm text-muted-foreground'>
              {format(new Date(sprint.start_date), 'MMM d')} -{' '}
              {sprint.end_date ? format(new Date(sprint.end_date), 'MMM d, yyyy') : 'No end date'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
