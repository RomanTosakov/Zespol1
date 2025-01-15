import { TApiError, TSupabaseClient } from '@/lib/types/api'
import { createServerSupabase } from '@/lib/utils/supabase/createServerSupabase'
import { NextApiRequest, NextApiResponse } from 'next'

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

const handleGET = async (
  req: NextApiRequest,
  res: NextApiResponse,
  supabase: TSupabaseClient
) => {
  try {
    const { projectId } = req.query as { projectId: string }

    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user) {
      throw { status: 401, message: 'Unauthorized' } as TApiError
    }

    console.log('API Request:', {
      projectId,
      userId: user.id
    })

    const { data, error } = await supabase
      .from('project_members')
      .select('*')
      .eq('project_id', projectId)
      .eq('profile_id', user.id)
      .single()

    console.log('Raw Supabase Response:', {
      data,
      error,
      dataType: data ? typeof data : 'null',
      dataKeys: data ? Object.keys(data) : []
    })

    if (error) {
      console.error('Supabase error:', error)
      return res.status(400).json({ error: error.message })
    }

    if (!data) {
      return res.status(404).json({ error: 'Member not found' })
    }

    if (!data.role) {
      console.error('Missing role in data:', data)
      return res.status(500).json({ error: 'Invalid data structure' })
    }

    const response = {
      id: data.id,
      role: data.role,
      profile_id: data.profile_id,
      project_id: data.project_id
    }

    console.log('Sending response:', JSON.stringify(response, null, 2))
    return res.status(200).json(response)
  } catch (error) {
    console.error('Error in /members/me:', error)
    const errorData = error as TApiError
    return res.status(errorData.status || 500).json({ 
      error: errorData.message || 'Internal server error' 
    })
  }
} 