import { TTask } from '@/lib/types/tasks'
import { DraggableProvided } from '@hello-pangea/dnd'
import NiceModal from '@ebay/nice-modal-react'
import { TaskModal } from './TaskModal'
import { FileIcon } from 'lucide-react'
import { format } from 'date-fns'

type TaskCardProps = {
  task: TTask
  provided: DraggableProvided
}

export const TaskCard = ({ task, provided }: TaskCardProps) => {
  const handleTaskClick = () => {
    NiceModal.show(TaskModal, { initialTask: task })
  }

  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className='rounded-lg border bg-secondary p-4 shadow-sm hover:bg-accent'
      onClick={handleTaskClick}
    >
      <div className='flex items-center gap-2'>
        <h4 className='text-xs text-muted-foreground'>{task.slug}</h4>
        <h3 className='font-medium'>{task.title}</h3>
      </div>
      <div className='mt-2 space-y-2'>
        {task.description && <p className='line-clamp-1 text-sm text-muted-foreground'>{task.description}</p>}
        <div className='flex flex-col justify-between text-sm text-muted-foreground'>
          <div className='flex items-center gap-2'>
            {task.project_members && <span>{task.project_members.name || task.project_members.email}</span>}
          </div>
          <div className='flex items-center gap-2'>
            {task.due_date && <span>Due {format(new Date(task.due_date), 'MMM d')}</span>}
            {task.files && task.files.length > 0 && <FileIcon className='h-4 w-4' />}
          </div>
        </div>
      </div>
    </div>
  )
}
