import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog'
import { useTask } from '@/lib/utils/api/hooks/Tasks/useTask'
import { Skeleton } from '@/components/ui/skeleton'
import { StatusChip } from './StatusChip'
import { format } from 'date-fns'
import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { TTask } from '@/lib/types/tasks'
import { TaskMemberSelect } from './TaskMemberSelect'
import { EditableDescription } from './EditableDescription'
import { EditableTitle } from './EditableTitle'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { CalendarIcon, Trash2Icon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useEditTask } from '@/lib/utils/api/hooks/Tasks/useEditTask'
import { TaskComments } from './TaskComments'
import { useDeleteTask } from '@/lib/utils/api/hooks/Tasks/useDeleteTask'
import ConfirmDialog from '@/components/ui/confirm-dialog'

type TaskModalProps = {
  initialTask: TTask
}

export const TaskModal = NiceModal.create<TaskModalProps>(({ initialTask }) => {
  const modal = useModal()
  const { task, isLoading } = useTask({
    taskId: initialTask.id,
    task: initialTask
  })
  const { mutate: editTask } = useEditTask()
  const deleteTask = useDeleteTask()

  const handleDateChange = (date: Date | undefined) => {
    if (!task) return
    editTask({
      formData: { ...task, due_date: date ? date.toISOString() : null },
      id: task.id
    })
  }

  const handleDelete = () => {
    NiceModal.show(ConfirmDialog, {
      title: 'Delete Task',
      description: 'Are you sure you want to delete this task? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'destructive',
      onConfirm: () => {
        deleteTask.mutate(
          { taskId: task!.id },
          {
            onSuccess: () => {
              modal.hide()
              console.log('Task deleted')
            }
          }
        )
      }
    })
  }

  return (
    <Dialog open={modal.visible} onOpenChange={() => modal.hide()}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader className='flex flex-row items-start justify-between pt-6'>
          <div className='flex-1'>{isLoading ? <Skeleton className='h-7 w-3/4' /> : <EditableTitle task={task} />}</div>
          <Button variant='ghost' size='icon' className='h-8 w-8' onClick={handleDelete}>
            <Trash2Icon className='h-4 w-4 text-muted-foreground hover:text-destructive' />
          </Button>
        </DialogHeader>

        <div className='space-y-6'>
          {isLoading ? (
            <div className='space-y-2'>
              <Skeleton className='h-4 w-1/4' />
              <Skeleton className='h-20 w-full' />
            </div>
          ) : (
            <>
              <div className='flex items-center gap-4'>
                <StatusChip task={task} />
                <TaskMemberSelect task={task} />
                {task?.created_at && (
                  <span className='text-sm text-muted-foreground'>
                    Created on {format(new Date(task.created_at), 'MMM d, yyyy')}
                  </span>
                )}
              </div>

              <div className='space-y-2'>
                <h3 className='font-medium'>Description</h3>
                <EditableDescription task={task} />
              </div>

              <div className='flex gap-8'>
                {task?.start_date && (
                  <div>
                    <h3 className='font-medium'>Start Date</h3>
                    <p className='text-sm text-muted-foreground'>{format(new Date(task.start_date), 'MMM d, yyyy')}</p>
                  </div>
                )}

                <div>
                  <h3 className='font-medium'>Due Date</h3>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant='outline'
                        className={cn(
                          'w-[240px] justify-start text-left font-normal',
                          !task?.due_date && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className='mr-2 h-4 w-4' />
                        {task?.due_date ? format(new Date(task.due_date), 'PPP') : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      style={{
                        zIndex: 9999
                      }}
                      className='w-auto p-0'
                      align='start'
                    >
                      <Calendar
                        mode='single'
                        selected={task?.due_date ? new Date(new Date(task.due_date).getTime() + 86400000) : undefined}
                        onSelect={handleDateChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <TaskComments task={task} />
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
})
