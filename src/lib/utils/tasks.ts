import { TTask } from '../types/tasks'

export const cleanTaskData = (task: TTask): Omit<TTask, 'sprints' | 'project_members' | 'comments'> => {
  const { sprints, project_members, comments, ...cleanedTask } = task
  return cleanedTask
}
