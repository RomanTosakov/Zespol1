import { Database } from './supabase-types'

export type TProject = Database['public']['Tables']['projects']['Row']

export type TEnterNameForm = {
    name: string
}