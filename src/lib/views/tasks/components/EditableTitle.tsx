import { Input } from '@/components/ui/input'
import { TTask } from '@/lib/types/tasks'
import { useEditTask } from '@/lib/utils/api/hooks/Tasks/useEditTask'
import { useEffect, useState } from 'react'

type EditableTitleProps = {
  task: TTask
}

export const EditableTitle: React.FC<EditableTitleProps> = ({ task }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(task.title)
  const editTask = useEditTask()

  useEffect(() => {
    if (!isEditing) {
      setTitle(task.title)
    }
  }, [task.title, isEditing])

  const handleSave = () => {
    if (!title.trim()) return

    editTask.mutate(
      {
        id: task.id,
        formData: {
          ...task,
          title
        }
      },
      {
        onSuccess: () => {
          setIsEditing(false)
        }
      }
    )
  }

  if (isEditing) {
    return (
      <Input
        autoFocus
        value={title}
        onChange={e => setTitle(e.target.value)}
        onBlur={handleSave}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            e.preventDefault()
            handleSave()
          }
          if (e.key === 'Escape') {
            setIsEditing(false)
            setTitle(task.title)
          }
        }}
        onClick={e => e.stopPropagation()}
        className='text-xl font-medium'
      />
    )
  }

  return (
    <h2
      onClick={e => {
        setIsEditing(true)
        e.stopPropagation()
      }}
      className='cursor-pointer text-xl font-medium'
    >
      {task.title || 'Untitled'}
    </h2>
  )
}
