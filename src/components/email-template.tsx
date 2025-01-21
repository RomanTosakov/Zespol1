import * as React from 'react';

interface EmailTemplateProps {
  firstName: string; // Invited user's first name
  inviterName: string; // Inviter's name
  projectName: string; // Project name
  role: string; // User's role in the project
  inviteDate: string; // Invitation date
  token: string; // Invitation token
  inviteId: string; // Invitation ID
}

const styles = {
  container: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    padding: '40px 20px',
    background: '#f9fafb',
    borderRadius: '8px',
    maxWidth: '600px',
    margin: '0 auto',
  },
  heading: {
    fontSize: '24px',
    color: '#111827',
    marginBottom: '24px',
    textAlign: 'center' as const,
  },
  projectName: {
    color: '#2563eb',
    fontWeight: 'bold' as const,
  },
  paragraph: {
    fontSize: '16px',
    color: '#374151',
    lineHeight: '24px',
    marginBottom: '16px',
  },
  highlight: {
    fontWeight: 'bold' as const,
    color: '#111827',
  },
  role: {
    color: '#2563eb',
    fontWeight: 'bold' as const,
    textTransform: 'capitalize' as const,
  },
  date: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '24px',
  },
  buttonContainer: {
    textAlign: 'center' as const,
    marginTop: '32px',
    marginBottom: '32px',
  },
  button: {
    backgroundColor: '#2563eb',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '6px',
    textDecoration: 'none',
    fontWeight: 'bold' as const,
    display: 'inline-block',
  },
  footer: {
    fontSize: '14px',
    color: '#6b7280',
    textAlign: 'center' as const,
    marginTop: '32px',
  },
};

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName,
  inviterName,
  projectName,
  role,
  inviteDate,
  token,
  inviteId
}) => {
  // Format the date nicely
  const formattedDate = new Date(inviteDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  // TODO: change to production url when deploying
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://tosakov.com'
    : 'http://localhost:3000';
    
  const acceptLink = `${baseUrl}/api/invites/${inviteId}/accept?token=${token}`;

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>
        You've been invited to join <span style={styles.projectName}>{projectName}</span>!
      </h1>

      <p style={styles.paragraph}>
        Hi <span style={styles.highlight}>{firstName}</span>,
      </p>

      <p style={styles.paragraph}>
        <span style={styles.highlight}>{inviterName}</span> has invited you to join the project{' '}
        <span style={styles.highlight}>{projectName}</span> as a{' '}
        <span style={styles.role}>{role}</span>.
      </p>

      <p style={styles.date}>Invitation Date: {formattedDate}</p>

      <div style={styles.buttonContainer}>
        <a href={acceptLink} style={styles.button}>
          Accept Invitation
        </a>
      </div>

      <p style={styles.footer}>
        If you did not expect this invitation, you can safely ignore this email.
      </p>
    </div>
  );
};
