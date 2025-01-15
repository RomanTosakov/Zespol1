import { TTask } from '@/lib/types/tasks'
import { DraggableProvided } from '@hello-pangea/dnd'
import NiceModal from '@ebay/nice-modal-react'
import { TaskModal } from './TaskModal'

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
      <h3 className='font-medium'>{task.title}</h3>
      {task.project_members && (
        <div className='mt-2 text-sm text-gray-500'>Assigned to: {task.project_members.email}</div>
      )}
    </div>
  )
}
