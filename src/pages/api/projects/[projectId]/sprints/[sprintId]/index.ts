import { SPRINT_QUERY } from '@/lib/schemas/queries'
import { TApiError, TSupabaseClient } from '@/lib/types/api'
import { createServerSupabase } from '@/lib/utils/supabase/createServerSupabase'
import { NextApiRequest, NextApiResponse } from 'next/types'
import { TSprintForm } from '@/lib/types/sprints'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerSupabase(req, res)

  const { method } = req
  try {
    switch (method) {
      case 'GET':
        return await handleGET(req, res, supabase)
      case 'PUT':
        return await handlePUT(req, res, supabase)
      default:
        res.setHeader('Allow', ['GET', 'PUT'])
        return res.status(405).end(`Method ${method} Not Allowed`)
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error })
  }
}

const handlePUT = async (req: NextApiRequest, res: NextApiResponse, supabase: TSupabaseClient) => {
  try {
    const { projectId, sprintId } = req.query as { projectId: string; sprintId: string }
    const { formData } = req.body as { formData: TSprintForm }

    const { data: sprint, error } = await supabase
      .from('sprints')
      .update({
        name: formData.name,
        description: formData.description,
        start_date: formData.start_date,
        end_date: formData.end_date,
        is_completed: formData.is_completed
      })
      .eq('project_id', projectId)
      .eq('id', sprintId)
      .select(SPRINT_QUERY)
      .single()

    if (error) {
      const errorApi = {
        status: 400,
        message: error.message
      } as TApiError
      throw errorApi
    }

    return res.status(200).json(sprint)
  } catch (error) {
    const errorData = error as TApiError
    return res.status(errorData.status).json({ error: errorData.message })
  }
}

const handleGET = async (req: NextApiRequest, res: NextApiResponse, supabase: TSupabaseClient) => {
  try {
    const { projectId, sprintId } = req.query as { projectId: string; sprintId: string }

    const { data: sprint, error } = await supabase
      .from('sprints')
      .select(SPRINT_QUERY)
      .eq('project_id', projectId)
      .eq('id', sprintId)
      .maybeSingle()

    if (error) {
      const errorApi = {
        status: 400,
        message: error.message
      } as TApiError
      throw errorApi
    }

    if (!sprint) {
      const errorApi = {
        status: 404,
        message: 'Sprint not found'
      } as TApiError
      throw errorApi
    }

    return res.status(200).json(sprint)
  } catch (error) {
    const errorData = error as TApiError
    return res.status(errorData.status).json({ error: errorData.message })
  }
}
