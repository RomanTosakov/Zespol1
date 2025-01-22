import { signUpSchema } from '@/lib/schemas/signUp'
import { TApiError, TSupabaseClient } from '@/lib/types/api'
import { TSignUpForm } from '@/lib/types/auth'
import { ValidateForm } from '@/lib/utils/api/ValidateForm'
import { createServerSupabase } from '@/lib/utils/supabase/createServerSupabase'
import { NextApiRequest, NextApiResponse } from 'next/types'

/**
 * @api Authentication
 * @endpoint POST /api/auth/signUp
 * @description Handles new user registration
 * @body {TSignUpForm} formData - Registration data
 * @returns {Promise<void>}
 * @throws {TApiError}
 * - 400: Invalid registration data
 * - 409: Email already exists
 * - 500: Server error
 */

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerSupabase(req, res)

  const { method } = req
  try {
    switch (method) {
      case 'POST':
        return await ValidateForm({ req, res, supabase, handler: handlePOST, schema: signUpSchema })

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
    const { email, password, full_name } = req.body.formData as TSignUpForm

    const { data, error } = await supabase.auth.signUp({
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
        message: 'Error signing up',
        status: 400
      }

      throw errorData
    }

    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: data.user.id,
        email,
        name: full_name
      })
      .maybeSingle()

    if (profileError) {
      const errorData: TApiError = {
        message: profileError.message,
        status: 400
      }

      throw errorData
    }

    return res.status(200).json({
      message: 'Registered'
    })
  } catch (error) {
    const errorData = error as TApiError

    return res.status(errorData.status).json({ error: errorData.message })
  }
}
