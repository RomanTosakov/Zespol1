import { TTask } from '../types/tasks'

export const cleanTaskData = (task: TTask): Omit<TTask, 'sprints' | 'project_members' | 'comments' | 'files'> => {
  const { sprints, project_members, comments, files, ...cleanedTask } = task
  return cleanedTask
}
