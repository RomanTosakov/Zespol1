import { TApiError, TSupabaseClient } from '@/lib/types/api'
import { TInsertTask, TTaskForm } from '@/lib/types/tasks'
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
    const formData = req.body.formData as TTaskForm

    const {
      data: tasksCount,
      count,
      error: countError
    } = await supabase.from('tasks').select('id', { count: 'exact' }).eq('project_id', projectId)

    if (countError) {
      const errorApi = {
        status: 400,
        message: countError.message
      } as TApiError

      throw errorApi
    }

    const { data, error } = await supabase
      .from('tasks')
      .insert([
        {
          ...formData,
          project_id: projectId,
          sort_id: (count ?? 0) + 1,
          status: 'todo',
          slug: `KAN-${(count ?? 0) + 1}`
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

    const { data: tasks, error } = await supabase.from('tasks').select('*').eq('project_id', projectId).order('sort_id')

    return res.status(200).json(tasks)
  } catch (error) {
    const errorData = error as TApiError

    return res.status(errorData.status).json({ error: errorData.message })
  }
}
