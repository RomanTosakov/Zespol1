import { TApiError, TSupabaseClient } from '@/lib/types/api'
import { createServerSupabase } from '@/lib/utils/supabase/createServerSupabase'
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
    const { inviteId } = req.query as { inviteId: string }
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

    const { data, error } = await supabase
      .from('invitations')
      .select('*, project:projects(*)')
      .eq('email', user.user.email)
      .eq('id', inviteId)
      .maybeSingle()

    if (error) {
      const errorData: TApiError = {
        message: error.message,
        status: 400
      }

      throw errorData
    }

    if (!data) {
      const errorData: TApiError = {
        message: 'Invite not found',
        status: 404
      }

      throw errorData
    }

    const { data: userProfile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.user.id)
      .single()

    if (profileError) {
      const errorData: TApiError = {
        message: profileError.message,
        status: 400
      }

      throw errorData
    }

    if (!userProfile) {
      const errorData: TApiError = {
        message: 'Profile not found',
        status: 400
      }

      throw errorData
    }

    const { data: insertMember, error: insertMemberError } = await supabase.from('project_members').insert({
      project_id: data.project_id,
      profile_id: user.user.id,
      name: userProfile.name ?? '',
      role: data.role,
      email: user.user.email
    })

    if (insertMemberError) {
      const errorData: TApiError = {
        message: insertMemberError.message,
        status: 400
      }

      throw errorData
    }

    const { error: deleteError } = await supabase.from('invitations').delete().eq('id', inviteId)

    if (deleteError) {
      const errorData: TApiError = {
        message: deleteError.message,
        status: 400
      }

      throw errorData
    }

    return res.status(200).json({ data })
  } catch (error) {
    const errorData = error as TApiError

    return res.status(errorData.status).json({ error: errorData.message })
  }
}
