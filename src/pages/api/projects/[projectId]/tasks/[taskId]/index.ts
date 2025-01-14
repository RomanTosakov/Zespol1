import { TASK_QUERY } from '@/lib/schemas/queries'
import { TApiError, TSupabaseClient } from '@/lib/types/api'
import { TTask } from '@/lib/types/tasks'
import { createServerSupabase } from '@/lib/utils/supabase/createServerSupabase'
import { cleanTaskData } from '@/lib/utils/tasks'
import { NextApiRequest, NextApiResponse } from 'next/types'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerSupabase(req, res)

  const { method } = req
  try {
    switch (method) {
      case 'GET':
        return await handleGET(req, res, supabase)
      case 'PATCH':
        return await handlePATCH(req, res, supabase)
      case 'DELETE':
        return await handleDELETE(req, res, supabase)
      default:
        res.setHeader('Allow', ['GET', 'PATCH', 'DELETE'])
        return res.status(405).end(`Method ${method} Not Allowed`)
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error })
  }
}

const handleGET = async (req: NextApiRequest, res: NextApiResponse, supabase: TSupabaseClient) => {
  try {
    const { taskId } = req.query as { taskId: string }

    const { data, error } = await supabase.from('tasks').select(TASK_QUERY).eq('id', taskId).maybeSingle()

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

const handlePATCH = async (req: NextApiRequest, res: NextApiResponse, supabase: TSupabaseClient) => {
  try {
    const { projectId, taskId } = req.query as { projectId: string; taskId: string }
    const formData = req.body.formData as TTask

    const cleanedFormData = cleanTaskData(formData)

    const { data, error } = await supabase
      .from('tasks')
      .update({
        ...cleanedFormData
      })
      .eq('id', taskId)
      .select('*')

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

const handleDELETE = async (req: NextApiRequest, res: NextApiResponse, supabase: TSupabaseClient) => {
  try {
    const { projectId, taskId } = req.query as { projectId: string; taskId: string }

    // Get current user's session
    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user) {
      const errorApi = {
        status: 401,
        message: 'Unauthorized'
      } as TApiError
      throw errorApi
    }

    // Get the member ID for the current user in this project
    const { data: memberData, error: memberError } = await supabase
      .from('project_members')
      .select('id')
      .eq('project_id', projectId)
      .eq('profile_id', user.id)
      .single()

    if (memberError || !memberData) {
      const errorApi = {
        status: 403,
        message: 'Not a project member'
      } as TApiError
      throw errorApi
    }

    // Delete the task
    const { error } = await supabase.from('tasks').delete().eq('id', taskId).eq('project_id', projectId)

    if (error) {
      const errorApi = {
        status: 400,
        message: error.message
      } as TApiError
      throw errorApi
    }

    return res.status(200).json({ message: 'Task deleted successfully' })
  } catch (error) {
    const errorData = error as TApiError
    return res.status(errorData.status).json({ error: errorData.message })
  }
}
