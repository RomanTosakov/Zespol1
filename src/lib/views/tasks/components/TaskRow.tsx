import { useRouter } from 'next/router'
import { TTask } from '@/lib/types/tasks'
import { StatusChip } from './StatusChip'

export const TaskRow: React.FC<{ task: TTask }> = ({ task }) => {
  const router = useRouter()
  const { projectSlug } = router.query

  const handleTaskClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent event bubbling
    router.push(`/projects/${projectSlug}/${task.id}/editTask`)
  }

  return (
    <div 
      onClick={handleTaskClick}
      className='flex w-full cursor-pointer items-center justify-between border-b p-2 hover:bg-secondary'
    >
      <div className='flex items-center gap-2'>
        <p className='text-sm'>{task.title || ''}</p>
      </div>
      <StatusChip task={task} />
    </div>
  )
}