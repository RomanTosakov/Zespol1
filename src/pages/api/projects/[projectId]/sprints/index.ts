import { SPRINT_QUERY } from '@/lib/schemas/queries'
import { TApiError, TSupabaseClient } from '@/lib/types/api'
import { TSprintForm, TSprint } from '@/lib/types/sprints'
import { createServerSupabase } from '@/lib/utils/supabase/createServerSupabase'
import { NextApiRequest, NextApiResponse } from 'next/types'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerSupabase(req, res)

  const { method } = req
  try {
    switch (method) {
      case 'POST':
        return await handlePOST(req, res, supabase)
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
    const { projectId } = req.query as { projectId: string }
    const formData = req.body.formData as TSprintForm

    // Get current user's ID
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      throw { status: 401, message: 'Unauthorized' } as TApiError
    }

    // Check if current user has permission to create sprints
    const { data: currentMember, error: currentMemberError } = await supabase
      .from('project_members')
      .select('role')
      .eq('project_id', projectId)
      .eq('profile_id', user.id)
      .single()

    if (currentMemberError || !currentMember) {
      throw { status: 403, message: 'Unauthorized' } as TApiError
    }

    if (!['administrator', 'owner'].includes(currentMember.role.toLowerCase())) {
      throw { status: 403, message: 'Insufficient permissions' } as TApiError
    }

    const { data, error } = await supabase
      .from('sprints')
      .insert([
        {
          ...formData,
          project_id: projectId
        }
      ])
      .select(SPRINT_QUERY)
      .maybeSingle()

    if (error) {
      const errorApi = {
        status: 400,
        message: error.message
      } as TApiError
      throw errorApi
    }

    return res.status(200).json(data)
  } catch (error) {
    const errorData = error as TApiError
    return res.status(errorData.status).json({ error: errorData.message })
  }
}

const handleGET = async (req: NextApiRequest, res: NextApiResponse, supabase: TSupabaseClient) => {
  try {
    const { projectId } = req.query as { projectId: string }

    const { data: sprints, error } = await supabase
      .from('sprints')
      .select(SPRINT_QUERY)
      .eq('project_id', projectId)
      .order('start_date', { ascending: true })

    if (error) {
      const errorApi = {
        status: 400,
        message: error.message
      } as TApiError
      throw errorApi
    }

    return res.status(200).json(sprints)
  } catch (error) {
    const errorData = error as TApiError
    return res.status(errorData.status).json({ error: errorData.message })
  }
}
