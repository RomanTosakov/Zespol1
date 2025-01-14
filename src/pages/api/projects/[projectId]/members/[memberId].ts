import { TApiError, TSupabaseClient } from '@/lib/types/api'
import { createServerSupabase } from '@/lib/utils/supabase/createServerSupabase'
import { NextApiRequest, NextApiResponse } from 'next'

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

const handlePATCH = async (
  req: NextApiRequest,
  res: NextApiResponse,
  supabase: TSupabaseClient
) => {
  try {
    const { projectId, memberId } = req.query as { projectId: string; memberId: string }
    const { role } = req.body

    if (!role) {
      throw { status: 400, message: 'Role is required' } as TApiError
    }

    // Get current user's session
    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user) {
      throw { status: 401, message: 'Unauthorized' } as TApiError
    }

    // Check if current user is admin or owner
    const { data: currentMember, error: currentMemberError } = await supabase
      .from('project_members')
      .select('role')
      .eq('project_id', projectId)
      .eq('profile_id', user.id)
      .single()

    if (currentMemberError || !currentMember) {
      throw { status: 403, message: 'Not a project member' } as TApiError
    }

    // Проверяем права доступа
    const isAdmin = currentMember.role === 'administrator'
    const isOwner = currentMember.role === 'owner'

    if (!isAdmin && !isOwner) {
      throw { status: 403, message: 'Insufficient permissions' } as TApiError
    }

    // Получаем информацию о целевом пользователе
    const { data: targetMember, error: targetMemberError } = await supabase
      .from('project_members')
      .select('role')
      .eq('id', memberId)
      .single()

    if (targetMemberError || !targetMember) {
      throw { status: 404, message: 'Member not found' } as TApiError
    }

    // Нельзя изменить роль владельца
    if (targetMember.role === 'owner') {
      throw { status: 403, message: "Cannot modify owner's role" } as TApiError
    }

    // Выполняем обновление
    const { data, error } = await supabase
      .from('project_members')
      .update({ role })
      .eq('id', memberId)
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