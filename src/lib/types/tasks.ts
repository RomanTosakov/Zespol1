import { TProjectMember } from './org'
import { TSprint } from './sprints'
import { Database } from './supabase-types'

export type TTask = Omit<Database['public']['Tables']['tasks']['Row'], 'status'> & {
  status: TTaskStatus
  sprints: TSprint | null
  project_members: TProjectMember | null
}

export type TInsertTask = Database['public']['Tables']['tasks']['Insert']

export type TTaskStatus = 'todo' | 'in-progress' | 'done'

export type TTaskForm = {
  title: string
}

export type TTaskOrderChange = {
  id: string
  sort_id: number
}
