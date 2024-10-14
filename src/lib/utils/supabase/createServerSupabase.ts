import { TSupabaseClient } from '@/lib/types/api'
import { createServerClient, serializeCookieHeader } from '@supabase/ssr'
import { type NextApiRequest, type NextApiResponse } from 'next'

export const createServerSupabase = (req: NextApiRequest, res: NextApiResponse) => {
  const supabase = createServerClient<TSupabaseClient>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return Object.keys(req.cookies).map(name => ({ name, value: req.cookies[name] || '' }))
        },
        setAll(cookiesToSet) {
          res.setHeader(
            'Set-Cookie',
            cookiesToSet.map(({ name, value, options }) => serializeCookieHeader(name, value, options))
          )
        }
      }
    }
  ) as unknown as TSupabaseClient

  return supabase
}
