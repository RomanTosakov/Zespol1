import { Database } from './supabase-types'

export type TRole = 'member' | 'administrator' | 'owner'

export type TOrgForm = {
  name: string
}

export type TProjectMember = Database['public']['Tables']['project_members']['Row']

export type TProject = Database['public']['Tables']['projects']['Row']

export type TProjectRole = 'member' | 'administrator' | 'owner' | 'manager'
