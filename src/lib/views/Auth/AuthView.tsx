import { TAuthSteps } from '@typesProj/auth'
import { useState, useEffect } from 'react'
import { EnterEmailForm } from './components/EnterEmailForm'
import { SignUpForm } from './components/SignUpForm'
import { SignInForm } from './components/SignInForm'
import { useRouter } from 'next/router'
import { axios } from '@/lib/utils/api/axios'
import { TEnterEmailResponse } from '@/lib/types/auth'

export const AuthView = () => {
  const [step, setStep] = useState<TAuthSteps>('enter-email')
  const [email, setEmail] = useState<string | null>(null)
  const router = useRouter()
  const { inviteId, token, email: inviteEmail, redirect } = router.query

  useEffect(() => {
    const checkExistingUser = async () => {
      if (inviteEmail && typeof inviteEmail === 'string') {
        try {
          const response = await axios.post<TEnterEmailResponse>('/auth/check', {
            formData: { email: inviteEmail }
          });
          
          console.log('Check response:', response.data); // Debug log
          
          setEmail(inviteEmail);
          // If the response contains any data for the email, it means the user exists
          if (response.data && response.data.email !== '') {
            console.log('User exists, redirecting to login');
            setStep('login');
          } else {
            console.log('User does not exist, redirecting to register');
            setStep('register');
          }
        } catch (error) {
          console.error('Error checking user:', error);
          setEmail(inviteEmail);
          setStep('register'); // Default to register if check fails
        }
      }
    };

    checkExistingUser();
  }, [inviteEmail]);

  return (
    <div className='flex h-full items-center justify-center'>
      {step === 'enter-email' && <EnterEmailForm setAuthStep={setStep} setEmail={setEmail} />}
      {step === 'register' && (
        <SignUpForm 
          setAuthStep={setStep} 
          email={email!} 
          inviteParams={inviteId && token ? { inviteId: inviteId as string, token: token as string } : undefined} 
        />
      )}
      {step === 'login' && (
        <SignInForm 
          setAuthStep={setStep} 
          email={email!} 
          inviteParams={inviteId && token ? { inviteId: inviteId as string, token: token as string } : undefined} 
        />
      )}
    </div>
  )
}
