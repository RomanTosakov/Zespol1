import { Textarea } from '@/components/ui/textarea'
import { TTask } from '@/lib/types/tasks'
import { useEditTask } from '@/lib/utils/api/hooks/Tasks/useEditTask'
import { useState } from 'react'

type EditableDescriptionProps = {
  task: TTask
}

export const EditableDescription: React.FC<EditableDescriptionProps> = ({ task }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [description, setDescription] = useState(task.description || '')
  const editTask = useEditTask()

  const handleSave = () => {
    editTask.mutate(
      {
        id: task.id,
        formData: {
          ...task,
          description
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
      <Textarea
        autoFocus
        value={description}
        onChange={e => setDescription(e.target.value)}
        onBlur={handleSave}
        onKeyDown={e => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSave()
          }
          if (e.key === 'Escape') {
            setIsEditing(false)
            setDescription(task.description || '')
          }
        }}
        className='min-h-[100px] resize-none'
        placeholder='Add a description...'
      />
    )
  }

  return (
    <p onClick={() => setIsEditing(true)} className='min-h-[24px] cursor-pointer text-sm text-muted-foreground'>
      {task.description || 'No description provided'}
    </p>
  )
}
