import { useEditTask } from '@/lib/utils/api/hooks/Tasks/useEditTask'
import { TTask } from '@/lib/types/tasks'
import { SprintSelect } from '../../sprints/components/SprintSelect'

type TaskSprintSelectProps = {
  task: TTask
}

export const TaskSprintSelect: React.FC<TaskSprintSelectProps> = ({ task }) => {
  const { mutate: editTask, isPending: isLoading } = useEditTask()

  const handleChange = (sprintId: string | null) => {
    editTask({
      formData: { ...task, sprint_id: sprintId },
      id: task.id
    })
  }

  return <SprintSelect value={task.sprint_id} onChange={handleChange} disabled={isLoading} />
}
