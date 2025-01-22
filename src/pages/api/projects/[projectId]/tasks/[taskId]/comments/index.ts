import { TApiError, TSupabaseClient } from '@/lib/types/api'
import { createServerSupabase } from '@/lib/utils/supabase/createServerSupabase'
import { NextApiRequest, NextApiResponse } from 'next/types'

/**
 * @api Task Comments
 * @description API endpoints for managing task comments
 * 
 * @endpoint GET /api/projects/[projectId]/tasks/[taskId]/comments
 * @description Get all comments for a task
 * @param {string} projectId - Project identifier
 * @param {string} taskId - Task identifier
 * @returns {Promise<TTaskComment[]>} Array of task comments
 * 
 * @endpoint POST /api/projects/[projectId]/tasks/[taskId]/comments
 * @description Create a new comment
 * @param {string} projectId - Project identifier
 * @param {string} taskId - Task identifier
 * @body {string} title - Comment content
 * @returns {Promise<TTaskComment>} Created comment
 * 
 * @throws {TApiError}
 * - 401: Unauthorized
 * - 403: Forbidden
 * - 404: Task not found
 * - 500: Server error
 */

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerSupabase(req, res)

  const { method } = req
  try {
    switch (method) {
      case 'GET':
        return await handleGET(req, res, supabase)
      case 'POST':
        return await handlePOST(req, res, supabase)
      default:
        res.setHeader('Allow', ['GET', 'POST'])
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

    const { data, error } = await supabase
      .from('tasks_comments')
      .select('*, project_members(*)')
      .eq('task_id', taskId)
      .order('created_at', { ascending: false })

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

const handlePOST = async (req: NextApiRequest, res: NextApiResponse, supabase: TSupabaseClient) => {
  try {
    const { projectId, taskId } = req.query as { projectId: string; taskId: string }
    const { title } = req.body

    if (!title) {
      const errorApi = {
        status: 400,
        message: 'Title is required'
      } as TApiError
      throw errorApi
    }

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

    // Create the comment
    const { data, error } = await supabase
      .from('tasks_comments')
      .insert({
        title,
        task_id: taskId,
        member_id: memberData.id
      })
      .select('*, project_members(*)')
      .single()

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
