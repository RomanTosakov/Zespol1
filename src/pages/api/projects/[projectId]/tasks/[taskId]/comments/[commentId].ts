import { TApiError, TSupabaseClient } from '@/lib/types/api'
import { createServerSupabase } from '@/lib/utils/supabase/createServerSupabase'
import { NextApiRequest, NextApiResponse } from 'next/types'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/lib/types/supabase-types'

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
    const { projectId, commentId } = req.query as { projectId: string; commentId: string }

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

    // Check if user is a project member
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

    // Get the comment
    const { data: comment, error: commentError } = await supabase
      .from('tasks_comments')
      .select('*')
      .eq('id', commentId)
      .single()

    if (commentError || !comment) {
      const errorApi = {
        status: 404,
        message: 'Comment not found'
      } as TApiError
      throw errorApi
    }

    return res.status(200).json(comment)
  } catch (error) {
    const errorData = error as TApiError
    return res.status(errorData.status).json({ error: errorData.message })
  }
}

const handlePATCH = async (req: NextApiRequest, res: NextApiResponse, supabase: TSupabaseClient) => {
  try {
    const { projectId, commentId } = req.query as { projectId: string; commentId: string }
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

    // Verify the comment belongs to this user
    const { data: commentData, error: commentError } = await supabase
      .from('tasks_comments')
      .select('member_id')
      .eq('id', commentId)
      .single()

    if (commentError || !commentData) {
      const errorApi = {
        status: 404,
        message: 'Comment not found'
      } as TApiError
      throw errorApi
    }

    if (commentData.member_id !== memberData.id) {
      const errorApi = {
        status: 403,
        message: 'You can only edit your own comments'
      } as TApiError
      throw errorApi
    }

    // Update the comment
    const { data, error } = await supabase
      .from('tasks_comments')
      .update({
        title,
        edited_at: new Date().toISOString()
      })
      .eq('id', commentId)
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

const handleDELETE = async (req: NextApiRequest, res: NextApiResponse, supabase: TSupabaseClient) => {
  const { projectId, taskId, commentId } = req.query as { projectId: string; taskId: string; commentId: string }

  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    // First check if user has permission to delete this comment
    const { data: member } = await supabase
      .from('project_members')
      .select('role')
      .eq('project_id', projectId)
      .eq('profile_id', user.id)
      .single()

    if (!member) {
      return res.status(403).json({ error: 'Not a project member' })
    }

    // Get the comment to check ownership
    const { data: comment } = await supabase
      .from('tasks_comments')
      .select('member_id')
      .eq('id', commentId)
      .single()

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' })
    }

    // Check if user has permission to delete
    const canDelete = member.role === 'owner' || 
                     member.role === 'administrator' || 
                     comment.member_id === user.id

    if (!canDelete) {
      return res.status(403).json({ error: 'No permission to delete this comment' })
    }

    // Delete the comment
    const { error: deleteError } = await supabase
      .from('tasks_comments')
      .delete()
      .eq('id', commentId)
      .eq('task_id', taskId)

    if (deleteError) {
      throw deleteError
    }

    return res.status(200).json({ message: 'Comment deleted successfully' })
  } catch (error) {
    console.error('Error deleting comment:', error)
    return res.status(500).json({ error: 'Failed to delete comment' })
  }
}
