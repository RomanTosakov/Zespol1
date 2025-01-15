import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useProjectTeam } from '@/lib/utils/api/hooks/Team/useProjectTeam'
import { useEditTask } from '@/lib/utils/api/hooks/Tasks/useEditTask'
import { TTask } from '@/lib/types/tasks'
import { Skeleton } from '@/components/ui/skeleton'
import { useCurrentMemberRole } from '@/lib/utils/api/hooks/Team/useCurrentMemberRole'

type TaskMemberSelectProps = {
  task: TTask
}

export const TaskMemberSelect: React.FC<TaskMemberSelectProps> = ({ task }) => {
  const { data: members, isLoading } = useProjectTeam()
  const editTask = useEditTask()
  const { data: currentRole, isLoading: isLoadingRole } = useCurrentMemberRole()

  const canAssignTasks = currentRole === 'owner' || currentRole === 'administrator'

  if (isLoading || isLoadingRole) {
    return <Skeleton className='h-8 w-[150px]' />
  }

  return (
    <Select
      value={task.member_id || ''}
      onValueChange={value => {
        if (!canAssignTasks) return
        editTask.mutate({
          id: task.id,
          formData: {
            ...task,
            member_id: value === 'unassigned' ? null : value
          }
        })
      }}
      disabled={!canAssignTasks}
    >
      <SelectTrigger className='w-[150px]'>
        <SelectValue placeholder='Assign member' />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={'unassigned'}>Unassigned</SelectItem>
        {members?.map(member => (
          <SelectItem key={member.id} value={member.id}>
            {member.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
