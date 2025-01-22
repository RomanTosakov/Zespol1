import { TApiError, TSupabaseClient } from '@/lib/types/api'
import { createServerSupabase } from '@/lib/utils/supabase/createServerSupabase'
import { NextApiRequest, NextApiResponse } from 'next/types'

/**
 * @api Team
 * @description API endpoints for managing project team members
 * 
 * @endpoint GET /api/projects/[projectId]/team
 * @description Get all team members for a project
 * @param {string} projectId - Project identifier
 * @returns {Promise<TProjectMember[]>} Array of team members
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

const handleGET = async (req: NextApiRequest, res: NextApiResponse, supabase: TSupabaseClient) => {
  try {
    const { projectId } = req.query as { projectId: string }

    const { data: members, error } = await supabase.from('project_members').select('*').eq('project_id', projectId)

    if (error) {
      const errorData: TApiError = {
        message: error.message,
        status: 400
      }

      throw errorData
    }

    return res.status(200).json(members)
  } catch (error) {
    const errorData = error as TApiError

    return res.status(errorData.status).json({ error: errorData.message })
  }
}
