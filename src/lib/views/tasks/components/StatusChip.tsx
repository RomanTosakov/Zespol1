import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { TTask } from '@/lib/types/tasks'
import { cn } from '@/lib/utils'
import { useEditTask } from '@/lib/utils/api/hooks/Tasks/useEditTask'
import { useState } from 'react'

export const StatusChip: React.FC<{ task: TTask }> = ({ task }) => {
  const editTask = useEditTask()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild className='w-[107px] cursor-pointer'>
        <p
          className={cn('rounded-sm bg-secondary p-1 text-sm hover:bg-secondary-dimmed', {
            'bg-blue-500 hover:bg-blue-600': task.status === 'in-progress',
            'bg-green-500 hover:bg-green-600': task.status === 'done'
          })}
        >
          {task.status.toUpperCase()}
        </p>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={e => {
            e.stopPropagation()
            editTask.mutate(
              { id: task.id, formData: { ...task, status: 'todo' } },
              {
                onSuccess: () => {
                  setIsOpen(false)
                }
              }
            )
          }}
          className='cursor-pointer bg-secondary p-1 text-sm'
        >
          <p>TODO</p>
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={e => {
            e.stopPropagation()
            editTask.mutate(
              { id: task.id, formData: { ...task, status: 'in-progress' } },
              {
                onSuccess: () => {
                  setIsOpen(false)
                }
              }
            )
          }}
          className='cursor-pointer bg-blue-500 p-1 text-sm'
        >
          <p>IN-PROGRESS</p>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={e => {
            e.stopPropagation()
            editTask.mutate(
              { id: task.id, formData: { ...task, status: 'done' } },
              {
                onSuccess: () => {
                  setIsOpen(false)
                }
              }
            )
          }}
          className='cursor-pointer bg-green-500 p-1 text-sm'
        >
          <p>DONE</p>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
