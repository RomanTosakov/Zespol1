import * as React from 'react';

interface EmailTemplateProps {
  firstName: string; // Имя приглашённого пользователя
  inviterName: string; // Имя пригласившего пользователя
  projectName: string; // Название проекта
  role: string; // Роль пользователя в проекте
  inviteDate: string; // Дата приглашения
  token: string; // Токен приглашения
  inviteId: string; // ID приглашения
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName,
  inviterName,
  projectName,
  role,
  inviteDate,
  token,
  inviteId
}) => {
  const acceptLink = `http://localhost:3000/api/invites/${inviteId}/accept?token=${token}`;

  return  (
  <div style={styles.container}>
    {/* Заголовок */}
    <h1 style={styles.heading}>
      You’ve been invited to join <span style={styles.projectName}>{projectName}</span>!
    </h1>

    {/* Основной текст */}
    <p style={styles.paragraph}>
      Hi <span style={styles.highlight}>{firstName}</span>,
    </p>

    <p style={styles.paragraph}>
      <span style={styles.highlight}>{inviterName}</span> has invited you to join the project{' '}
      <span style={styles.highlight}>{projectName}</span> as a{' '}
      <span style={styles.role}>{role}</span>.
    </p>

    {/* Дата приглашения */}
    <p style={styles.date}>Invitation Date: {inviteDate}</p>

    {/* Кнопка */}
    <div style={styles.buttonContainer}>
      <a href={acceptLink} style={styles.button}>
        Accept Invitation
      </a>
    </div>

    {/* Footer */}
    <p style={styles.footer}>
      If you did not expect this invitation, you can safely ignore this email.
    </p>
  </div>
)};

// Стили с использованием JavaScript объекта
const styles = {
  container: {
    fontFamily: '"Arial", sans-serif',
    color: '#333',
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
  },
  heading: {
    color: '#0073e6',
    fontSize: '24px',
    marginBottom: '16px',
  },
  projectName: {
    color: '#333',
    fontWeight: 'bold',
  },
  paragraph: {
    fontSize: '16px',
    margin: '10px 0',
  },
  highlight: {
    fontWeight: 'bold',
    color: '#0073e6',
  },
  role: {
    fontWeight: 'bold',
    color: '#28a745',
  },
  date: {
    fontSize: '14px',
    color: '#666',
    margin: '20px 0',
  },
  buttonContainer: {
    textAlign: 'center' as const,
    marginTop: '20px',
  },
  button: {
    display: 'inline-block',
    padding: '10px 20px',
    fontSize: '16px',
    color: '#fff',
    backgroundColor: '#0073e6',
    textDecoration: 'none',
    borderRadius: '5px',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease',
  },
  footer: {
    fontSize: '12px',
    color: '#777',
    textAlign: 'center' as const,
    marginTop: '20px',
  },
};