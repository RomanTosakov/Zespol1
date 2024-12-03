import { TProject } from './org'
import { Database } from './supabase-types'

export type TInvites = Database['public']['Tables']['invitations']['Row']

export type TUserInvite = TInvites & {
  project: TProject
}
