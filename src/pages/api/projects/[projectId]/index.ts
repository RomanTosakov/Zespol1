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

    // Get current user's session
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser()

    if (userError || !user) {
      throw { status: 401, message: 'Unauthorized' } as TApiError
    }

    // Check if user has permission
    const { data: memberData, error: memberError } = await supabase
      .from('project_members')
      .select('role')
      .eq('project_id', projectId)
      .eq('profile_id', user.id)
      .single()

    if (memberError || !memberData) {
      throw { status: 403, message: 'Unauthorized' } as TApiError
    }

    if (!['administrator', 'owner'].includes(memberData.role)) {
      throw { status: 403, message: 'Insufficient permissions' } as TApiError
    }

    // Get the current project to check if slug is being changed
    const { data: currentProject, error: currentProjectError } = await supabase
      .from('projects')
      .select('slug')
      .eq('id', projectId)
      .single()

    if (currentProjectError) {
      throw { status: 400, message: currentProjectError.message } as TApiError
    }

    // Check if slug is unique if it's being changed
    if (formData.slug && formData.slug !== currentProject.slug) {
      const { data: existingProject, error: slugError } = await supabase
        .from('projects')
        .select('id')
        .eq('slug', formData.slug)
        .neq('id', projectId)
        .single()

      if (existingProject) {
        throw { status: 400, message: 'Project key already exists' } as TApiError
      }

      // If slug is changing, update all task slugs
      const { data: tasks, error: tasksError } = await supabase
        .from('tasks')
        .select('id, slug')
        .eq('project_id', projectId)

      if (tasksError) {
        throw { status: 400, message: tasksError.message } as TApiError
      }

      // Update each task's slug
      for (const task of tasks) {
        const { error: updateTaskError } = await supabase
          .from('tasks')
          .update({ slug: task.slug.replace(currentProject.slug, formData.slug) })
          .eq('id', task.id)

        if (updateTaskError) {
          throw { status: 400, message: updateTaskError.message } as TApiError
        }
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

const handleDELETE = async (req: NextApiRequest, res: NextApiResponse, supabase: TSupabaseClient) => {
  try {
    const { projectId } = req.query as { projectId: string }

    // Get current user's session
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser()

    if (userError || !user) {
      throw { status: 401, message: 'Unauthorized' } as TApiError
    }

    // Check if user has permission
    const { data: memberData, error: memberError } = await supabase
      .from('project_members')
      .select('role')
      .eq('project_id', projectId)
      .eq('profile_id', user.id)
      .single()

    if (memberError || !memberData) {
      throw { status: 403, message: 'Unauthorized' } as TApiError
    }

    if (!['administrator', 'owner'].includes(memberData.role)) {
      throw { status: 403, message: 'Insufficient permissions' } as TApiError
    }

    // Delete all related data in the correct order
    // 1. Delete all task files
    await supabase
      .from('task_files')
      .delete()
      .eq('project_id', projectId)

    // 2. Delete all tasks
    await supabase
      .from('tasks')
      .delete()
      .eq('project_id', projectId)

    // 3. Delete all sprints
    await supabase
      .from('sprints')
      .delete()
      .eq('project_id', projectId)

    // 4. Delete all invitations
    await supabase
      .from('invitations')
      .delete()
      .eq('project_id', projectId)

    // 5. Delete all project members
    await supabase
      .from('project_members')
      .delete()
      .eq('project_id', projectId)

    // 6. Finally delete the project
    const { error: deleteError } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId)

    if (deleteError) {
      throw { status: 400, message: deleteError.message } as TApiError
    }

    return res.status(200).json({ message: 'Project deleted successfully' })
  } catch (error) {
    const errorData = error as TApiError
    return res.status(errorData.status).json({ error: errorData.message })
  }
} 