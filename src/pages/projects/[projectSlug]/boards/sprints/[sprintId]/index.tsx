import { useSprint } from '@/lib/utils/api/hooks/Sprints/useSprint'
import { TTask, TTaskStatus } from '@/lib/types/tasks'
import { useRouter } from 'next/router'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { useEditTask } from '@/lib/utils/api/hooks/Tasks/useEditTask'
import { useState, useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { useCreateTask } from '@/lib/utils/api/hooks/Tasks/useCreateTasks'
import { LoaderCircle, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { useChangeOrder } from '@/lib/utils/api/hooks/Tasks/useChangeOrder'
import { TaskCard } from '@/lib/views/tasks/components/TaskCard'

type CreateTaskProps = {
  status: TTaskStatus
  sprintId: string
}

const CreateTaskButton = ({ status, sprintId }: CreateTaskProps) => {
  const [isCreating, setIsCreating] = useState(false)
  const [title, setTitle] = useState('')
  const createTask = useCreateTask()

  const handleToggle = (val: boolean) => {
    setIsCreating(val)
    if (val) {
      setTitle('')
    }
  }

  const handleCreateTask = useCallback(() => {
    const trimmedTitle = title.trim()
    if (!trimmedTitle) {
      toast.error('Task title cannot be empty')
      return
    }

    createTask.mutate(
      {
        title: trimmedTitle,
        status: status,
        sprint_id: sprintId
      },
      {
        onSuccess: () => {
          setTitle('')
          setIsCreating(false)
        },
        onError: error => {
          toast.error(error instanceof Error ? error.message : 'Failed to create task')
        }
      }
    )
  }, [title, createTask])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleToggle(false)
      }

      if (e.key === 'Enter' && isCreating && !createTask.isPending) {
        handleCreateTask()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleCreateTask, isCreating, createTask.isPending])

  return (
    <div
      className='flex w-full cursor-pointer items-center gap-1 rounded-b-sm py-1 opacity-0 transition-all hover:bg-secondary hover:opacity-100 group-hover:opacity-100'
      onClick={() => {
        if (!isCreating) {
          handleToggle(true)
        }
      }}
    >
      {createTask.isPending ? <LoaderCircle size={16} className='animate-spin' /> : <Plus size={16} />}
      {isCreating ? (
        <Input
          autoFocus
          onBlur={e => {
            if (!e.currentTarget.contains(e.relatedTarget)) {
              handleToggle(false)
            }
          }}
          value={title}
          className='w-full border-none'
          onChange={e => {
            setTitle(e.target.value)
          }}
          placeholder='What needs to be done?'
          disabled={createTask.isPending}
        />
      ) : (
        <p className='select-none text-sm font-semibold'>Create</p>
      )}
    </div>
  )
}

export default function Page() {
  const router = useRouter()
  const sprintId = router.query.sprintId as string
  const { sprint } = useSprint(sprintId)
  const { mutate: editTask } = useEditTask()
  const { mutate: changeOrder } = useChangeOrder()

  const [tasks, setTasks] = useState<TTask[]>(sprint?.tasks || [])

  useEffect(() => {
    setTasks(sprint?.tasks || [])
  }, [sprint?.tasks])

  const getTasksByStatus = (status: TTaskStatus) => {
    return tasks.filter(task => task.status === status).sort((a, b) => a.sort_id - b.sort_id) || []
  }

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || !tasks) return

    const sourceId = result.source.droppableId as TTaskStatus
    const destinationId = result.destination.droppableId as TTaskStatus

    const allTasks = [...tasks]
    const sourceItems = getTasksByStatus(sourceId)
    const destinationItems = sourceId === destinationId ? sourceItems : getTasksByStatus(destinationId)

    const [movedTask] = sourceItems.splice(result.source.index, 1)

    const updatedTask = { ...movedTask, status: destinationId }
    destinationItems.splice(result.destination.index, 0, updatedTask)

    const updatedTasks = allTasks.map(t => {
      if (t.id === movedTask.id) {
        return {
          ...t,
          status: destinationId,
          sort_id: result.destination!.index
        }
      }
      return t
    })

    setTasks(updatedTasks)

    if (sourceId === destinationId) {
      const tasksToUpdate = getTasksByStatus(sourceId).map((task, index) => ({
        id: task.id,
        sort_id: index
      }))
      changeOrder(tasksToUpdate)
    } else {
      editTask({
        formData: {
          ...movedTask,
          status: destinationId,
          sort_id: result.destination.index + 1
        },
        id: movedTask.id
      })
    }
  }

  const todoTasks = getTasksByStatus('todo')
  const inProgressTasks = getTasksByStatus('in-progress')
  const doneTasks = getTasksByStatus('done')

  return (
    <div className='p-6'>
      <h1 className='mb-6 text-2xl font-bold'>{sprint?.name}</h1>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className='grid grid-cols-3'>
          <div className='group border border-r-0 bg-secondary-dimmed p-4'>
            <h2 className='mb-4 font-semibold'>To Do ({todoTasks.length})</h2>
            <Droppable droppableId='todo'>
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={cn('mb-4 flex flex-col gap-4', snapshot.isDraggingOver && 'bg-muted/50')}
                >
                  {todoTasks.map((task: TTask, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {provided => <TaskCard task={task} provided={provided} />}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
            <CreateTaskButton status='todo' sprintId={sprintId} />
          </div>

          <div className='group border border-r-0 bg-secondary-dimmed p-4'>
            <h2 className='mb-4 font-semibold'>In Progress ({inProgressTasks.length})</h2>
            <Droppable droppableId='in-progress'>
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={cn('mb-4 flex flex-col gap-4', snapshot.isDraggingOver && 'bg-muted/50')}
                >
                  {inProgressTasks.map((task: TTask, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {provided => <TaskCard task={task} provided={provided} />}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
            <CreateTaskButton status='in-progress' sprintId={sprintId} />
          </div>

          <div className='group border bg-secondary-dimmed p-4'>
            <h2 className='mb-4 font-semibold'>Done ({doneTasks.length})</h2>
            <Droppable droppableId='done'>
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={cn('mb-4 flex flex-col gap-4', snapshot.isDraggingOver && 'bg-muted/50')}
                >
                  {doneTasks.map((task: TTask, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {provided => <TaskCard task={task} provided={provided} />}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
            <CreateTaskButton status='done' sprintId={sprintId} />
          </div>
        </div>
      </DragDropContext>
    </div>
  )
}
