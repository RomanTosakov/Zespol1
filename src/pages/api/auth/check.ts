import { enterEmailSchema } from '@/lib/schemas/enterEmail'
import { TApiError, TSupabaseClient } from '@/lib/types/api'
import { ValidateForm } from '@/lib/utils/api/ValidateForm'
import { createAdminSupabase } from '@/lib/utils/supabase/createAdminSupabase'
import { NextApiRequest, NextApiResponse } from 'next/types'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createAdminSupabase({
    req,
    res
  })

  const { method } = req
  try {
    switch (method) {
      case 'POST':
        return await ValidateForm({ req, res, supabase, handler: handlePOST, schema: enterEmailSchema })

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
    const { email } = req.body.formData as { email: string }

    const { data, error } = await supabase
      .from('profiles')
      .select('name, email')
      .eq('email', email.toLowerCase())
      .maybeSingle()

    if (error) {
      const errorData: TApiError = {
        message: error.message,
        status: 400
      }

      throw errorData
    }

    return res.status(200).json({
      email: data?.email ?? '',
      name: data?.name ?? ''
    })
  } catch (error) {
    const errorData = error as TApiError

    return res.status(errorData.status).json({ error: errorData.message })
  }
}
