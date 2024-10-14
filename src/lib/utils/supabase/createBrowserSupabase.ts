import { TSupabaseClient } from '@/lib/types/api'
import { createBrowserClient } from '@supabase/ssr'

export const createBrowserSupabase = () => {
  const supabase = createBrowserClient<TSupabaseClient>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  return supabase
}
