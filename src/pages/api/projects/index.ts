import { orgSchema } from '@/lib/schemas/orgSchema'
import { TApiError, TSupabaseClient } from '@/lib/types/api'
import { TOrgForm } from '@/lib/types/org'
import { generateSlug } from '@/lib/utils/api/generateSlug'
import { ValidateForm } from '@/lib/utils/api/ValidateForm'
import { createServerSupabase } from '@/lib/utils/supabase/createServerSupabase'
import { randomBytes, randomInt } from 'crypto'
import { NextApiRequest, NextApiResponse } from 'next/types'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerSupabase(req, res)

  const { method } = req
  try {
    switch (method) {
      case 'POST':
        return await ValidateForm({ req, res, supabase, handler: handlePOST, schema: orgSchema })
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

const checkSlug = async (slug: string, supabase: TSupabaseClient) => {
  const { data, error } = await supabase.from('projects').select('slug').eq('slug', slug).maybeSingle()

  if (error) {
    const errorData: TApiError = {
      message: error.message,
      status: 400
    }

    throw errorData
  }

  return !!data?.slug.length
}

const generateProjectSlug = async (name: string, supabase: TSupabaseClient): Promise<string> => {
  const slug = generateSlug(name)

  return (await checkSlug(slug, supabase)) ? generateProjectSlug(name + randomInt(100), supabase) : slug
}

const handlePOST = async (req: NextApiRequest, res: NextApiResponse, supabase: TSupabaseClient) => {
  try {
    const { name } = req.body.formData as TOrgForm

    const { data: user, error: userError } = await supabase.auth.getUser()

    if (userError) {
      const errorData: TApiError = {
        message: userError.message,
        status: 400
      }

      throw errorData
    }

    if (!user) {
      const errorData: TApiError = {
        message: 'User not found',
        status: 400
      }

      throw errorData
    }

    const { data: userProfile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.user.id)
      .maybeSingle()

    if (profileError) {
      const errorData: TApiError = {
        message: profileError.message,
        status: 400
      }

      throw errorData
    }

    if (!userProfile) {
      const errorData: TApiError = {
        message: 'Profile not found',
        status: 400
      }

      throw errorData
    }

    const slug = await generateProjectSlug(name, supabase)

    const { data, error } = await supabase
      .from('projects')
      .insert({
        name,
        primary_owner: user.user.id,
        slug
      })
      .select('*')
      .maybeSingle()

    if (error) {
      const errorData: TApiError = {
        message: error.message,
        status: 400
      }

      throw errorData
    }

    if (!data) {
      const errorData: TApiError = {
        message: 'Error creating project',
        status: 400
      }

      throw errorData
    }

    const { data: insertProjectMembersData, error: insertProjectMembersError } = await supabase
      .from('project_members')
      .insert({
        profile_id: user.user.id,
        project_id: data?.id,
        name: userProfile.name ?? '',
        role: 'owner',
        email: userProfile.email
      })
      .select('*')
      .maybeSingle()

    if (insertProjectMembersError) {
      const errorData: TApiError = {
        message: insertProjectMembersError.message,
        status: 400
      }

      throw errorData
    }

    if (!insertProjectMembersData) {
      const errorData: TApiError = {
        message: 'Error creating project',
        status: 400
      }

      throw errorData
    }

    return res.status(200).json({
      data
    })
  } catch (error) {
    const errorData = error as TApiError

    return res.status(errorData.status).json({ error: errorData.message })
  }
}

const handleGET = async (req: NextApiRequest, res: NextApiResponse, supabase: TSupabaseClient) => {
  try {
    const { data: user, error: userError } = await supabase.auth.getUser()

    if (userError) {
      const errorData: TApiError = {
        message: userError.message,
        status: 400
      }

      throw errorData
    }

    if (!user || !user.user.email) {
      const errorData: TApiError = {
        message: 'User not found',
        status: 404
      }

      throw errorData
    }

    const { data: projects, error: projectsErrors } = await supabase
      .from('projects')
      .select('*, project_members!inner(*)')
      .eq('project_members.profile_id', user.user.id)

    if (projectsErrors) {
      const errorData: TApiError = {
        message: projectsErrors.message,
        status: 400
      }

      throw errorData
    }

    return res.status(200).json(projects)
  } catch (error) {
    const errorData = error as TApiError

    return res.status(errorData.status).json({ error: errorData.message })
  }
}
