import { Database } from './supabase-types'
import { TTask } from './tasks'

export type TSprint = Database['public']['Tables']['sprints']['Row']

export type TSprintWithTasks = TSprint & {
  tasks: TTask[]
}

export type TSprintForm = {
  name: string
  description: string | null
  start_date: string | null
  end_date: string | null
}
