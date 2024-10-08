import { signInSchema } from '@/lib/schemas/signIn'
import { TApiError, TSupabaseClient } from '@/lib/types/api'
import { TSignInForm } from '@/lib/types/auth'
import { ValidateForm } from '@/lib/utils/api/ValidateForm'
import { createServerSupabase } from '@/lib/utils/supabase/createServerSupabase'
import { NextApiRequest, NextApiResponse } from 'next/types'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerSupabase(req, res)

  const { method } = req
  try {
    switch (method) {
      case 'POST':
        return await ValidateForm({ req, res, supabase, handler: handlePOST, schema: signInSchema })

      default:
        res.setHeader('Allow', ['POST'])

        return res.status(405).end(`Method ${method} Not Allowed`)
    }
  } catch (error) {
    console.error(error)

    return res.status(500).json({ error })
  }
}

const handlePOST = async (req: NextApiRequest, res: NextApiResponse, supabase: TSupabaseClient) => {
  try {
    const { email, password } = req.body.formData as TSignInForm

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      const errorData: TApiError = {
        message: error.message,
        status: 400
      }

      throw errorData
    }

    if (!data || !data.user) {
      const errorData: TApiError = {
        message: 'Error signing in',
        status: 400
      }

      throw errorData
    }

    return res.status(200).json({
      message: 'Sign in successful'
    })
  } catch (error) {
    const errorData = error as TApiError

    return res.status(errorData.status).json({ error: errorData.message })
  }
}
