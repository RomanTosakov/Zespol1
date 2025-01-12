import { Input } from '@/components/ui/input'
import { useCreateTask } from '@/lib/utils/api/hooks/Tasks/useCreateTasks'
import { LoaderCircle, Plus } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

export const CreateTask: React.FC = () => {
  const [isCreating, setIsCreating] = useState(false)
  const [title, setTitle] = useState('')
  const ref = useRef<HTMLInputElement>(null)
  const createTask = useCreateTask()

  const handleToggle = (val: boolean) => {
    setIsCreating(val)
    if (val) {
      setTitle('')
      setTimeout(() => {
        ref.current?.focus()
      }, 0)
    }
  }

  const handleCreateTask = useCallback(() => {
    const trimmedTitle = title.trim()
    if (!trimmedTitle) {
      toast.error('Task title cannot be empty')
      return
    }

    createTask.mutate(
      { title: trimmedTitle },
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
      className='flex w-full cursor-pointer items-center gap-1 rounded-b-sm py-1 transition-all hover:bg-secondary'
      onClick={() => {
        if (!isCreating) {
          handleToggle(true)
        }
      }}
    >
      {createTask.isPending ? <LoaderCircle size={16} className='animate-spin' /> : <Plus size={16} />}
      {isCreating ? (
        <>
          <Input
            ref={ref}
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
        </>
      ) : (
        <p className='select-none text-sm font-semibold'>Create</p>
      )}
    </div>
  )
}
