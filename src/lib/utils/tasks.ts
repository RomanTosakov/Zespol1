import { TTask } from '../types/tasks'

export const cleanTaskData = (task: TTask): Omit<TTask, 'sprints' | 'project_members'> => {
  const { sprints, project_members, ...cleanedTask } = task
  return cleanedTask
}
