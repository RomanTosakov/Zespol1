import { TTask } from '@/lib/types/tasks'
import { StatusChip } from './StatusChip'
import { TaskMemberSelect } from './TaskMemberSelect'
import { EditableTitle } from './EditableTitle'
import { CalendarIcon, GripVerticalIcon } from 'lucide-react'
import { format } from 'date-fns'

type TaskRowProps = {
  task: TTask
  onClick?: () => void
}

export const TaskRow: React.FC<TaskRowProps> = ({ task, onClick }) => {
  return (
    <div
      className='flex h-11 w-full items-center justify-between bg-background px-4 pl-0 hover:bg-accent'
      onClick={onClick}
    >
      <div className='flex items-center gap-2'>
        <GripVerticalIcon className='text-muted-foreground' />
        <EditableTitle task={task} />
      </div>
      <div className='flex items-center gap-4'>
        {task.due_date && (
          <div className='flex items-center gap-2'>
            <CalendarIcon className='h-4 w-4 text-muted-foreground' />
            <p className='text-muted-foreground'>{format(new Date(task.due_date), 'PPP')}</p>
          </div>
        )}
        <TaskMemberSelect task={task} />
        <StatusChip task={task} />
      </div>
    </div>
  )
}
