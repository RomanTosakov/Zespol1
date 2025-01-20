import { inviteSchema } from '@/lib/schemas/invite'
import { TApiError, TSupabaseClient } from '@/lib/types/api'
import { ValidateForm } from '@/lib/utils/api/ValidateForm'
import { createServerSupabase } from '@/lib/utils/supabase/createServerSupabase'
import { randomBytes } from 'crypto'
import { NextApiRequest, NextApiResponse } from 'next/types'
import { TProjectRole } from '@/lib/types/org'

type TInviteRole = Exclude<TProjectRole, 'owner'>

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerSupabase(req, res)

  const { method } = req
  try {
    switch (method) {
      case 'POST':
        return await ValidateForm({ req, res, supabase, handler: handlePOST, schema: inviteSchema })
      case 'GET':
        return await handleGET(req, res, supabase)

      default:
        res.setHeader('Allow', ['POST', 'GET'])

        return res.status(405).end(`Method ${method} Not Allowed`)
    }
  } catch (error) {
    console.error(error)

    return res.status(500).json({ error })
  }
}

const handlePOST = async (req: NextApiRequest, res: NextApiResponse, supabase: TSupabaseClient) => {
  try {
    const { email, role } = req.body.formData as { email: string; role: TInviteRole }
    const { projectId } = req.query as { projectId: string }

    const { data: user, error: userError } = await supabase.auth.getUser()

    if (userError) {
      const errorData: TApiError = {
        message: userError.message,
        status: 400
      }

      throw errorData
    }

    if (!user) {
      const errorData: TApiError = {
        message: 'User not found',
        status: 400
      }

      throw errorData
    }

    const { data: invitedByUser, error: invitedByUserError } = await supabase
      .from('project_members')
      .select('*')
      .eq('project_id', projectId)
      .eq('profile_id', user?.user.id)
      .maybeSingle()

    if (invitedByUserError) {
      const errorData: TApiError = {
        message: invitedByUserError.message,
        status: 400
      }

      throw errorData
    }

    if (!invitedByUser) {
      const errorData: TApiError = {
        message: 'User not found in project',
        status: 400
      }

      throw errorData
    }

    // Check if the inviter has sufficient permissions
    if (invitedByUser.role !== 'owner' && invitedByUser.role !== 'administrator') {
      const errorData: TApiError = {
        message: 'Insufficient permissions to invite with this role',
        status: 403
      }
      throw errorData
    }

    // Only owners can invite administrators
    if (role === 'administrator' && invitedByUser.role !== 'owner') {
      const errorData: TApiError = {
        message: 'Only project owners can invite administrators',
        status: 403
      }
      throw errorData
    }

    const { data: alreadyExists, error: existsError } = await supabase
      .from('invitations')
      .select('*')
      .eq('email', email)
      .eq('project_id', projectId)
      .maybeSingle()

    if (existsError) {
      const errorData: TApiError = {
        message: existsError.message,
        status: 400
      }

      throw errorData
    }

    if (alreadyExists) {
      const errorData: TApiError = {
        message: 'User already invited',
        status: 408
      }

      throw errorData
    }

    const { data: userWithEmailAlreadyExists, error: userWithEmailError } = await supabase
      .from('project_members')
      .select('*')
      .eq('email', email)
      .eq('project_id', projectId)
      .maybeSingle()

    if (userWithEmailError) {
      const errorData: TApiError = {
        message: userWithEmailError.message,
        status: 400
      }

      throw errorData
    }

    if (userWithEmailAlreadyExists) {
      const errorData: TApiError = {
        message: 'User already in project',
        status: 409
      }

      throw errorData
    }

    const { data: insertedInvite, error: insertError } = await supabase.from('invitations').insert({
      email,
      project_id: projectId,
      invited_by: invitedByUser.id,
      token: randomBytes(32).toString('hex'),
      role: role || 'member'
    })

    if (insertError) {
      const errorData: TApiError = {
        message: insertError.message,
        status: 400
      }

      throw errorData
    }

    return res.status(200).json({
      insertedInvite
    })
  } catch (error) {
    const errorData = error as TApiError

    return res.status(errorData.status).json({ error: errorData.message })
  }
}

const handleGET = async (req: NextApiRequest, res: NextApiResponse, supabase: TSupabaseClient) => {
  try {
    const { projectId } = req.query as { projectId: string }

    const { data: projectsInvites, error } = await supabase.from('invitations').select('*').eq('project_id', projectId)

    return res.status(200).json(projectsInvites)
  } catch (error) {
    const errorData = error as TApiError

    return res.status(errorData.status).json({ error: errorData.message })
  }
}
