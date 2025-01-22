import { TASK_QUERY } from '@/lib/schemas/queries'
import { TApiError, TSupabaseClient } from '@/lib/types/api'
import { TInsertTask, TTask, TTaskForm, TTaskOrderChange } from '@/lib/types/tasks'
import { createServerSupabase } from '@/lib/utils/supabase/createServerSupabase'
import { NextApiRequest, NextApiResponse } from 'next/types'

/**
 * @api Tasks
 * @description API endpoints for managing project tasks
 * 
 * @endpoint GET /api/projects/[projectId]/tasks
 * @description Get all tasks for a project
 * @param {string} projectId - Project identifier
 * @returns {Promise<TTask[]>} Array of project tasks
 * 
 * @endpoint POST /api/projects/[projectId]/tasks
 * @description Create a new task
 * @param {string} projectId - Project identifier
 * @body {TTaskForm} formData - Task creation data
 * @returns {Promise<TTask>} Created task
 * 
 * @endpoint PUT /api/projects/[projectId]/tasks
 * @description Update task order
 * @param {string} projectId - Project identifier
 * @body {TTaskOrderChange[]} changes - Task order changes
 * @returns {Promise<void>}
 * 
 * @throws {TApiError}
 * - 401: Unauthorized
 * - 403: Forbidden
 * - 404: Project not found
 * - 500: Server error
 */

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerSupabase(req, res)

  const { method } = req
  try {
    switch (method) {
      case 'POST':
        return await handlePOST(req, res, supabase)
      case 'GET':
        return await handleGET(req, res, supabase)
      case 'PUT':
        return await handlePUT(req, res, supabase)
      default:
        res.setHeader('Allow', ['POST', 'GET', 'PUT'])

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
    const formData = req.body.formData as TTaskForm

    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('slug')
      .eq('id', projectId)
      .single()

    if (projectError) {
      const errorApi = {
        status: 400,
        message: projectError.message
      } as TApiError
      throw errorApi
    }

    // Get the highest task number for this project
    const { data: maxTask } = await supabase
      .from('tasks')
      .select('slug')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    let nextTaskNumber = 1
    if (maxTask) {
      const lastNumber = parseInt(maxTask.slug.split('-')[1])
      nextTaskNumber = lastNumber + 1
    }

    const { data, error } = await supabase
      .from('tasks')
      .insert([
        {
          ...formData,
          project_id: projectId,
          sort_id: nextTaskNumber,
          slug: `${project.slug}-${nextTaskNumber}`
        }
      ])
      .select('*')
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

    const { data: tasks, error } = await supabase
      .from('tasks')
      .select(TASK_QUERY)
      .eq('project_id', projectId)
      .order('sort_id')

    if (error) {
      const errorApi = {
        status: 400,
        message: error.message
      } as TApiError

      throw errorApi
    }

    return res.status(200).json(tasks)
  } catch (error) {
    const errorData = error as TApiError

    return res.status(errorData.status).json({ error: errorData.message })
  }
}

const handlePUT = async (req: NextApiRequest, res: NextApiResponse, supabase: TSupabaseClient) => {
  try {
    const { projectId } = req.query as { projectId: string }
    const orderChanges = req.body as TTaskOrderChange[]

    const { data: tasks, error: tasksError } = await supabase.from('tasks').select('*').eq('project_id', projectId)

    if (tasksError) {
      const errorApi = {
        status: 400,
        message: tasksError.message
      } as TApiError

      throw errorApi
    }

    const updatedCharts = tasks.map(task => ({
      ...task,
      sort_id: orderChanges.find(change => change.id === task.id)?.sort_id ?? task.sort_id
    }))

    const { data, error } = await supabase.from('tasks').upsert(updatedCharts, {})

    if (error) {
      const errorApi = {
        status: 400,
        message: error.message
      } as TApiError

      throw errorApi
    }

    return res.status(200).json({ message: 'Tasks updated' })
  } catch (error) {
    const errorData = error as TApiError

    return res.status(errorData.status).json({ error: errorData.message })
  }
}
