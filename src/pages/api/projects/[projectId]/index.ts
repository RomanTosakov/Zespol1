import { TApiError, TSupabaseClient } from '@/lib/types/api'
import { TProject } from '@/lib/types/org'
import { createServerSupabase } from '@/lib/utils/supabase/createServerSupabase'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerSupabase(req, res)

  const { method } = req
  try {
    switch (method) {
      case 'GET':
        return await handleGET(req, res, supabase)
      case 'PATCH':
        return await handlePATCH(req, res, supabase)
      default:
        res.setHeader('Allow', ['GET', 'PATCH'])
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

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single()

    if (error) {
      throw { status: 400, message: error.message } as TApiError
    }

    return res.status(200).json(data)
  } catch (error) {
    const errorData = error as TApiError
    return res.status(errorData.status).json({ error: errorData.message })
  }
}

const handlePATCH = async (req: NextApiRequest, res: NextApiResponse, supabase: TSupabaseClient) => {
  try {
    const { projectId } = req.query as { projectId: string }
    const formData = req.body.formData as TProject

    // Check if user has permission
    const { data: memberData, error: memberError } = await supabase
      .from('project_members')
      .select('role')
      .eq('project_id', projectId)
      .single()

    if (memberError || !memberData) {
      throw { status: 403, message: 'Unauthorized' } as TApiError
    }

    if (!['administrator', 'owner'].includes(memberData.role)) {
      throw { status: 403, message: 'Insufficient permissions' } as TApiError
    }

    // Check if slug is unique if it's being changed
    if (formData.slug) {
      const { data: existingProject, error: slugError } = await supabase
        .from('projects')
        .select('id')
        .eq('slug', formData.slug)
        .neq('id', projectId)
        .single()

      if (existingProject) {
        throw { status: 400, message: 'Project key already exists' } as TApiError
      }
    }

    const { data, error } = await supabase
      .from('projects')
      .update({
        name: formData.name,
        slug: formData.slug,
        primary_owner: formData.primary_owner
      })
      .eq('id', projectId)
      .select()
      .single()

    if (error) {
      throw { status: 400, message: error.message } as TApiError
    }

    return res.status(200).json(data)
  } catch (error) {
    const errorData = error as TApiError
    return res.status(errorData.status).json({ error: errorData.message })
  }
} 