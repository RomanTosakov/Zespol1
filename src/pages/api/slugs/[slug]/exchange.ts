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

    const { data, error } = await supabase.from('projects').select('id').eq('slug', slug).maybeSingle()

    if (error) {
      const errorData: TApiError = {
        message: error.message,
        status: 400
      }

      throw errorData
    }

    if (!data) {
      const errorData: TApiError = {
        message: 'Project not found',
        status: 404
      }

      throw errorData
    }

    return res.status(200).json({
      id: data.id
    })
  } catch (error) {
    const errorData = error as TApiError

    return res.status(errorData.status).json({ error: errorData.message })
  }
}
