import { Input } from '@/components/ui/input'
import { useCreateTask } from '@/lib/utils/api/hooks/Tasks/useCreateTasks'
import { LoaderCircle, Plus } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

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
    createTask.mutate(
      { title },
      {
        onSuccess: () => {
          handleToggle(false)
        }
      }
    )
  }, [title, createTask])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleToggle(false)
      }

      if (e.key === 'Enter') {
        handleCreateTask()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleCreateTask])

  return (
    <div
      className='flex w-full cursor-pointer items-center gap-1 rounded-b-sm py-1 transition-all hover:bg-secondary'
      onClick={() => {
        handleToggle(true)
      }}
    >
      {createTask.isPending ? <LoaderCircle size={16} className='animate-spin' /> : <Plus size={16} />}
      {isCreating ? (
        <>
          <Input
            ref={ref}
            onBlur={() => handleToggle(false)}
            value={title}
            className='w-full border-none'
            onChange={e => {
              setTitle(e.target.value)
            }}
            placeholder='What need to do?'
          />
        </>
      ) : (
        <p className='select-none text-sm font-semibold'>Create</p>
      )}
    </div>
  )
}
