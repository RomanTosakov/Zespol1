import { PostgrestError, SupabaseClient } from '@supabase/supabase-js'
import { Database } from './supabase-types'

export type TApiError = {
  message: string | PostgrestError
  status: number
}

export type TSupabaseClient = SupabaseClient<Database>
