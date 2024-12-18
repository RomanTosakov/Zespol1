import { Database } from './supabase-types'

export type TTask = Omit<Database['public']['Tables']['tasks']['Row'], 'status'> & {
  status: TTaskStatus
}

export type TInsertTask = Database['public']['Tables']['tasks']['Insert']

export type TTaskStatus = 'todo' | 'in-progress' | 'done'

export type TTaskForm = {
  title: string
}
