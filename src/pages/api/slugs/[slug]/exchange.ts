import { TApiError, TSupabaseClient } from '@/lib/types/api'
import { createServerSupabase } from '@/lib/utils/supabase/createServerSupabase'
import { NextApiRequest, NextApiResponse } from 'next/types'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerSupabase(req, res)

  const { method } = req
  try {
    switch (method) {
      case 'GET':
        return await handleGET(req, res, supabase)

      default:
        res.setHeader('Allow', ['GET'])

        return res.status(405).end(`Method ${method} Not Allowed`)
    }
  } catch (error) {
    console.error(error)

    return res.status(500).json({ error })
  }
}

const handleGET = async (req: NextApiRequest, res: NextApiResponse, supabase: TSupabaseClient) => {
  try {
    const { slug } = req.query as { slug: string }

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      const errorData: TApiError = {
        message: 'Unauthorized',
        status: 401
      }
      throw errorData
    }

    // Get project ID
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id')
      .eq('slug', slug)
      .maybeSingle()

    if (projectError) {
      const errorData: TApiError = {
        message: projectError.message,
        status: 400
      }
      throw errorData
    }

    if (!project) {
      const errorData: TApiError = {
        message: 'Project not found',
        status: 404
      }
      throw errorData
    }

    // Check if user is a member of the project
    const { data: member, error: memberError } = await supabase
      .from('project_members')
      .select('id')
      .eq('project_id', project.id)
      .eq('profile_id', user.id)
      .is('deleted_at', null)
      .maybeSingle()

    if (memberError || !member) {
      const errorData: TApiError = {
        message: 'Access denied',
        status: 403
      }
      throw errorData
    }

    return res.status(200).json({
      id: project.id
    })
  } catch (error) {
    const errorData = error as TApiError
    return res.status(errorData.status).json({ error: errorData.message })
  }
}
