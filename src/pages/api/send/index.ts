import type { NextApiRequest, NextApiResponse } from 'next';
import { EmailTemplate } from '@/components/email-template';
import { Resend } from 'resend';
import { createServerSupabase } from '@/lib/utils/supabase/createServerSupabase';
import { TApiError } from '@/lib/types/api';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const supabase = createServerSupabase(req, res);
  const { email, projectId, inviter } = req.body;

  try {

    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('name')
      .eq('id', projectId)
      .single();

    if (projectError || !project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('name')
      .eq('email', email)
      .single();

    if (profileError || !profile) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    
    const { data: invitation, error: invitationError } = await supabase
      .from('invitations')
      .select('*')
      .eq('email', email)
      .eq('project_id', projectId)
      .single();

    if (invitationError || !invitation) {
      return res.status(404).json({ error: 'Invitation not found' });
    }

    const { data, error: emailError } = await resend.emails.send({
      from: 'Jira like team <noreply@tosakov.com>',
      to: [email],
      subject: `${inviter.name} invited you to ${project.name}`,
      react: EmailTemplate({
        firstName: profile.name ?? 'Guest',
        inviterName: inviter.name,
        projectName: project.name,
        role: invitation.role,
        inviteDate: invitation.created_at,
        token: invitation.token,
        inviteId: invitation.id,
       
      }),
    });
    console.log('Invitation Data:', invitation);
    console.log('Profile Data:', profile);
    if (emailError) {
      throw new Error(`Failed to send email: ${emailError.message}`);
    }

    // Успешный ответ
    return res.status(200).json({ message: 'Email sent successfully', data });
  } catch (error) {
    console.error('Error processing request:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
