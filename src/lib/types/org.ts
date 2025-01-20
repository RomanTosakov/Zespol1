import { Database } from './supabase-types'

export type TRole = 'member' | 'administrator' | 'owner'

export type TOrgForm = {
  name: string
}

export type TProjectMember = {
  id: string
  profile_id: string
  project_id: string
  name: string
  role: TRole
  email: string
  created_at: string
}

export type TProject = {
  id: string
  name: string
  slug: string
  primary_owner: string
  created_at: string
}

export type TProjectRole = 'member' | 'administrator' | 'owner' | 'manager'
