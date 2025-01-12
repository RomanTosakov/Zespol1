import { Database } from './supabase-types'
import { TTask } from './tasks'

export type TSprint = Database['public']['Tables']['sprints']['Row']

export type TSprintWithTasks = TSprint & {
  tasks: TTask[]
}

export type TSprintForm = {
  title: string
  description: string
  startDate: string
  endDate: string
}
