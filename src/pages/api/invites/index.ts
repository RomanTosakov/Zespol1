import { orgSchema } from '@/lib/schemas/orgSchema'
import { TApiError, TSupabaseClient } from '@/lib/types/api'
import { TOrgForm } from '@/lib/types/org'
import { generateSlug } from '@/lib/utils/api/generateSlug'
import { ValidateForm } from '@/lib/utils/api/ValidateForm'
import { createServerSupabase } from '@/lib/utils/supabase/createServerSupabase'
import { randomBytes, randomInt } from 'crypto'
import { NextApiRequest, NextApiResponse } from 'next/types'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerSupabase(req, res)

  const { method } = req
  try {
    switch (method) {
      case 'GET':
        return await handleGET(req, res, supabase)

      default:
        res.setHeader('Allow', ['GET'])

        return res.status(405).end(`Method ${method} Not Allowed`)
    }
  } catch (error) {
    console.error(error)

    return res.status(500).json({ error })
  }
}

const handleGET = async (req: NextApiRequest, res: NextApiResponse, supabase: TSupabaseClient) => {
  try {
    const { data: user, error: userError } = await supabase.auth.getUser()

    if (userError) {
      const errorData: TApiError = {
        message: userError.message,
        status: 400
      }

      throw errorData
    }

    if (!user || !user.user.email) {
      const errorData: TApiError = {
        message: 'User not found',
        status: 404
      }

      throw errorData
    }

    const { data: invites, error: invitesError } = await supabase
      .from('invitations')
      .select('*')
      .eq('email', user.user.email)

    if (invitesError) {
      const errorData: TApiError = {
        message: invitesError.message,
        status: 400
      }

      throw errorData
    }

    return res.status(200).json({ invites })
  } catch (error) {
    const errorData = error as TApiError

    return res.status(errorData.status).json({ error: errorData.message })
  }
}
