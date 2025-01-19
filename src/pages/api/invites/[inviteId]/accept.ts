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

    console.log('Processing invite acceptance. Request query:', req.query)

    if (!inviteId || !token) {
      console.error('Missing required parameters:', { inviteId, token })
      return res.status(400).json({ error: 'Missing required parameters' })
    }

    // First, validate the invitation and token
    console.log('Fetching invitation from database:', { inviteId, token })
    const { data: invitation, error: inviteError } = await supabase
      .from('invitations')
      .select('*, project:projects(*)')
      .eq('id', inviteId)
      .eq('token', token)
      .maybeSingle()

    console.log('Database response:', { invitation, error: inviteError })

    if (inviteError) {
      console.error('Error fetching invitation:', inviteError)
      return res.status(400).json({ error: 'Invalid invite' })
    }

    if (!invitation) {
      console.error('Invitation not found for:', { inviteId, token })
      return res.status(404).json({ error: 'Invite not found' })
    }

    // Check user authentication
    const { data: user, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user || !user.user?.email) {
      console.error('Auth error:', userError || 'No user found')
      return res.status(401).json({ error: 'Authentication required' })
    }

    // Verify email match
    if (user.user.email.toLowerCase() !== invitation.email.toLowerCase()) {
      console.error('Email mismatch:', { userEmail: user.user.email, inviteEmail: invitation.email })
      return res.status(403).json({ error: 'Email mismatch' })
    }

    // Get user profile
    const { data: userProfile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.user.id)
      .single()

    if (profileError || !userProfile) {
      console.error('Error fetching user profile:', profileError || 'Profile not found')
      return res.status(404).json({ error: 'User profile not found' })
    }

    // Check if already a member
    const { data: existingMember, error: existingMemberError } = await supabase
      .from('project_members')
      .select('*')
      .eq('project_id', invitation.project_id)
      .eq('profile_id', user.user.id)
      .maybeSingle()

    if (existingMemberError) {
      console.error('Error checking existing membership:', existingMemberError)
      return res.status(500).json({ error: 'Error checking membership' })
    }

    if (existingMember) {
      console.log('User is already a member')
      return res.status(200).json({ 
        message: 'Already a member',
        project: invitation.project
      })
    }

    // Add member
    const { data: insertMember, error: insertMemberError } = await supabase
      .from('project_members')
      .insert({
        project_id: invitation.project_id,
        profile_id: user.user.id,
        name: userProfile.name ?? '',
        role: invitation.role,
        email: user.user.email
      })
      .select()
      .single()

    if (insertMemberError || !insertMember) {
      console.error('Error inserting member:', insertMemberError || 'No data returned')
      return res.status(500).json({ error: 'Failed to add member' })
    }

    console.log('Successfully added member:', insertMember)

    // Delete invitation
    const { error: deleteError } = await supabase
      .from('invitations')
      .delete()
      .eq('id', inviteId)

    if (deleteError) {
      console.error('Error deleting invitation:', deleteError)
      // Log but don't fail the request
      console.warn('Invitation deletion failed but member was added successfully')
    }
    
    // Return success with project data
    return res.status(200).json({
      message: 'Successfully joined project',
      project: invitation.project,
      member: insertMember
    })
  } catch (error) {
    console.error('Error processing invite acceptance:', error)
    return res.status(500).json({ error: 'Server error' })
  }
}
