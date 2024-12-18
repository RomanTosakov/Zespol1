import { TTask } from '@/lib/types/tasks'
import { StatusChip } from './StatusChip'

export const TaskRow: React.FC<{ task: TTask }> = ({ task }) => {
  return (
    <div className='flex justify-between p-2 transition-all hover:bg-secondary'>
      <div className='flex gap-4'>
        <p>{task.slug}</p>
        <p>{task.title}</p>
      </div>
      <div className='flex gap-4'>
        <StatusChip task={task} />
      </div>
    </div>
  )
}
