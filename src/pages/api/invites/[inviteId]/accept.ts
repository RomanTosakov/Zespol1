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
    const { inviteId } = req.query as { inviteId: string }
    const { token } = req.query as { token: string }

    // First, validate the invitation and token before checking user auth
    const { data: invitation, error: inviteError } = await supabase
      .from('invitations')
      .select('*, project:projects(*)')
      .eq('id', inviteId)
      .eq('token', token)
      .maybeSingle()

    if (inviteError || !invitation) {
      return res.redirect(302, '/auth?error=invalid_invite')
    }

    // Now check user authentication
    const { data: user, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user || !user.user?.email) {
      // Check if the invited email already has an account
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', invitation.email.toLowerCase())
        .maybeSingle()

      // Store invite data in query params
      const queryParams = new URLSearchParams({
        inviteId,
        token,
        email: invitation.email,
        redirect: 'true'
      })

      // Redirect to sign in if account exists, sign up if it doesn't
      if (existingProfile) {
        return res.redirect(302, `/auth?${queryParams.toString()}&authStep=sign-in`)
      } else {
        return res.redirect(302, `/auth?${queryParams.toString()}&authStep=sign-up`)
      }
    }

    // Verify the invite is for this user
    if (user.user.email.toLowerCase() !== invitation.email.toLowerCase()) {
      return res.redirect(302, '/auth?error=email_mismatch')
    }

    const { data: userProfile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.user.id)
      .single()

    if (profileError || !userProfile) {
      return res.redirect(302, '/auth?error=profile_not_found')
    }

    const { data: insertMember, error: insertMemberError } = await supabase.from('project_members').insert({
      project_id: invitation.project_id,
      profile_id: user.user.id,
      name: userProfile.name ?? '',
      role: invitation.role,
      email: user.user.email
    })

    if (insertMemberError) {
      return res.redirect(302, `/auth?error=member_insert_failed`)
    }

    const { error: deleteError } = await supabase.from('invitations').delete().eq('id', inviteId)

    if (deleteError) {
      return res.redirect(302, `/auth?error=invite_delete_failed`)
    }
    
    res.redirect(302, `/projects/${invitation.project_id}`)
  } catch (error) {
    console.error('Error processing invite acceptance:', error)
    return res.redirect(302, '/auth?error=server_error')
  }
}
