import { TApiError, TSupabaseClient } from '@/lib/types/api'
import { TInsertTask, TTask, TTaskForm } from '@/lib/types/tasks'
import { createServerSupabase } from '@/lib/utils/supabase/createServerSupabase'
import { NextApiRequest, NextApiResponse } from 'next/types'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerSupabase(req, res)

  const { method } = req
  try {
    switch (method) {
      case 'PATCH':
        return await handlePATCH(req, res, supabase)

      default:
        res.setHeader('Allow', ['PATCH'])

        return res.status(405).end(`Method ${method} Not Allowed`)
    }
  } catch (error) {
    console.error(error)

    return res.status(500).json({ error })
  }
}

const handlePATCH = async (req: NextApiRequest, res: NextApiResponse, supabase: TSupabaseClient) => {
  try {
    const { projectId, taskId } = req.query as { projectId: string; taskId: string }
    const formData = req.body.formData as TTask

    const { data, error } = await supabase
      .from('tasks')
      .update({
        ...formData
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
