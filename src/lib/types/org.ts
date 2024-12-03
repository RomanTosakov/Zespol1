import { Database } from './supabase-types'

export type TOrgForm = {
  name: string
}

export type TProjectMember = Database['public']['Tables']['project_members']['Row']

export type TProject = Database['public']['Tables']['projects']['Row']
