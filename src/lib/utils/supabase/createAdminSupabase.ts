import { TSupabaseClient } from '@/lib/types/api'
import { createServerClient, serializeCookieHeader } from '@supabase/ssr'
import { NextApiRequest, NextApiResponse } from 'next'

export const createAdminSupabase = ({ req, res }: { req: NextApiRequest; res: NextApiResponse }) => {
  const supabase = createServerClient<TSupabaseClient>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return Object.keys(req.cookies).map(name => ({ name: '', value: '' }))
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
