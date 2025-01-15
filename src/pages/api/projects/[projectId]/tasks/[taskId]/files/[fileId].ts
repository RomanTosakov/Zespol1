import { TApiError, TSupabaseClient } from '@/lib/types/api'
import { createServerSupabase } from '@/lib/utils/supabase/createServerSupabase'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerSupabase(req, res)

  const { method } = req
  try {
    switch (method) {
      case 'DELETE':
        return await handleDELETE(req, res, supabase)
      default:
        res.setHeader('Allow', ['DELETE'])
        return res.status(405).end(`Method ${method} Not Allowed`)
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error })
  }
}

const handleDELETE = async (req: NextApiRequest, res: NextApiResponse, supabase: TSupabaseClient) => {
  try {
    const { projectId, taskId, fileId } = req.query as {
      projectId: string
      taskId: string
      fileId: string
    }

    // First get the file info to get the storage path
    const { data: fileData, error: fileError } = await supabase
      .from('task_files')
      .select('*')
      .eq('id', fileId)
      .eq('project_id', projectId)
      .eq('task_id', taskId)
      .single()

    if (fileError || !fileData) {
      const errorApi = {
        status: 404,
        message: 'File not found'
      } as TApiError
      throw errorApi
    }

    // Delete from storage
    const { error: storageError } = await supabase.storage.from('files').remove([fileData.file_url])

    if (storageError) {
      const errorApi = {
        status: 400,
        message: storageError.message
      } as TApiError
      throw errorApi
    }

    // Delete from database
    const { error: deleteError } = await supabase
      .from('task_files')
      .delete()
      .eq('id', fileId)
      .eq('project_id', projectId)
      .eq('task_id', taskId)

    if (deleteError) {
      const errorApi = {
        status: 400,
        message: deleteError.message
      } as TApiError
      throw errorApi
    }

    return res.status(200).json({ message: 'File deleted successfully' })
  } catch (error) {
    const errorData = error as TApiError
    return res.status(errorData.status).json({ error: errorData.message })
  }
}
