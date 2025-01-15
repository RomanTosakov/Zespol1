import { TApiError, TSupabaseClient } from '@/lib/types/api'
import { createServerSupabase } from '@/lib/utils/supabase/createServerSupabase'
import { NextApiRequest, NextApiResponse } from 'next/types'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerSupabase(req, res)

  const { method } = req
  try {
    switch (method) {
      case 'PATCH':
        return await handlePATCH(req, res, supabase)
      case 'DELETE':
        return await handleDELETE(req, res, supabase)
      default:
        res.setHeader('Allow', ['PATCH', 'DELETE'])
        return res.status(405).end(`Method ${method} Not Allowed`)
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error })
  }
}

const handlePATCH = async (req: NextApiRequest, res: NextApiResponse, supabase: TSupabaseClient) => {
  try {
    const { projectId, memberId } = req.query as { projectId: string; memberId: string }
    const { role } = req.body

    // Get current user's ID
    const { data: { user } } = await supabase.auth.getUser()
    if (!user?.id) {
      const errorData: TApiError = {
        message: 'Unauthorized',
        status: 401
      }
      throw errorData
    }

    // Check if current user has permission to update roles
    const { data: currentMember, error: currentMemberError } = await supabase
      .from('project_members')
      .select('role')
      .eq('project_id', projectId)
      .eq('profile_id', user.id)
      .single()

    if (currentMemberError || !currentMember) {
      const errorData: TApiError = {
        message: 'Unauthorized',
        status: 403
      }
      throw errorData
    }

    if (!['administrator', 'owner'].includes(currentMember.role.toLowerCase())) {
      const errorData: TApiError = {
        message: 'Insufficient permissions',
        status: 403
      }
      throw errorData
    }

    const { data, error } = await supabase
      .from('project_members')
      .update({ role })
      .eq('id', memberId)
      .eq('project_id', projectId)
      .select()
      .single()

    if (error) {
      const errorData: TApiError = {
        message: error.message,
        status: 400
      }
      throw errorData
    }

    return res.status(200).json(data)
  } catch (error) {
    const errorData = error as TApiError
    return res.status(errorData.status).json({ error: errorData.message })
  }
}

const handleDELETE = async (req: NextApiRequest, res: NextApiResponse, supabase: TSupabaseClient) => {
  try {
    const { projectId, memberId } = req.query as { projectId: string; memberId: string }

    // Get current user's ID
    const { data: { user } } = await supabase.auth.getUser()
    if (!user?.id) {
      const errorData: TApiError = {
        message: 'Unauthorized',
        status: 401
      }
      throw errorData
    }

    // Get target member info
    const { data: targetMember, error: targetMemberError } = await supabase
      .from('project_members')
      .select('role, profile_id')
      .eq('id', memberId)
      .single()

    if (targetMemberError || !targetMember) {
      const errorData: TApiError = {
        message: 'Member not found',
        status: 404
      }
      throw errorData
    }

    // Check if target is owner
    if (targetMember.role.toLowerCase() === 'owner') {
      const errorData: TApiError = {
        message: 'Cannot remove project owner',
        status: 403
      }
      throw errorData
    }

    // Check if this is self-deletion
    const isSelfDeletion = targetMember.profile_id === user.id

    if (!isSelfDeletion) {
      // If not self-deletion, check admin permissions
      const { data: currentMember, error: currentMemberError } = await supabase
        .from('project_members')
        .select('role')
        .eq('project_id', projectId)
        .eq('profile_id', user.id)
        .single()

      if (currentMemberError || !currentMember) {
        const errorData: TApiError = {
          message: 'Unauthorized',
          status: 403
        }
        throw errorData
      }

      if (!['administrator', 'owner'].includes(currentMember.role.toLowerCase())) {
        const errorData: TApiError = {
          message: 'Insufficient permissions',
          status: 403
        }
        throw errorData
      }
    }

    // Delete the member
    const { error: deleteError } = await supabase
      .from('project_members')
      .delete()
      .eq('id', memberId)
      .eq('project_id', projectId)

    if (deleteError) {
      const errorData: TApiError = {
        message: deleteError.message,
        status: 400
      }
      throw errorData
    }

    return res.status(200).json({ success: true })
  } catch (error) {
    const errorData = error as TApiError
    return res.status(errorData.status).json({ error: errorData.message })
  }
}