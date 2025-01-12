import { useTasks } from '@/lib/utils/api/hooks/Tasks/useTasks'
import { CreateTask } from './components/CreateTask'
import { TaskRow } from './components/TaskRow'
import { Skeleton } from '@/components/ui/skeleton'
import NiceModal from '@ebay/nice-modal-react'
import { TaskModal } from './components/TaskModal'
import { TTask } from '@/lib/types/tasks'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { useChangeOrder } from '@/lib/utils/api/hooks/Tasks/useChangeOrder'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

export const BackLogView: React.FC = () => {
  const { tasks, isLoading } = useTasks()
  const { mutate: changeOrder } = useChangeOrder()

  const [tasksData, setTasksData] = useState<TTask[]>(tasks ?? [])

  const handleTaskClick = (task: TTask) => {
    NiceModal.show(TaskModal, { initialTask: task })
  }

  useEffect(() => {
    setTasksData(tasks ?? [])
  }, [tasks])

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || !tasksData) return

    const items = Array.from(tasksData)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    // Update sort_id for affected tasks
    const updates = items.map((task, index) => ({
      id: task.id,
      sort_id: index + 1
    }))

    changeOrder(updates)
    setTasksData(items)
  }

  return (
    <div className='flex w-full flex-col p-16'>
      <div className='mb-2 flex w-full items-center justify-between font-normal text-foreground'>
        <p>{`Backlog (${tasks?.length ?? '0'} items)`}</p>
      </div>
      {isLoading ? (
        <div className='h-fit w-full cursor-pointer border bg-secondary-dimmed [&>*:not(:first-child)]:border-t'>
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className='h-11 w-full rounded-none' />
          ))}
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId='tasks'>
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={cn(
                  'h-fit w-full cursor-pointer border bg-secondary-dimmed [&>*:not(:first-child)]:border-t'
                )}
              >
                {tasksData?.map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {provided => (
                      <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                        <TaskRow task={task} onClick={() => handleTaskClick(task)} />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
      <CreateTask />
    </div>
  )
}
