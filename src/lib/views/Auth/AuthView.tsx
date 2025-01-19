import { TAuthSteps } from '@typesProj/auth'
import { useState, useEffect } from 'react'
import { EnterEmailForm } from './components/EnterEmailForm'
import { SignUpForm } from './components/SignUpForm'
import { SignInForm } from './components/SignInForm'
import { useRouter } from 'next/router'

export const AuthView = () => {
  const [step, setStep] = useState<TAuthSteps>('enter-email')
  const [email, setEmail] = useState<string | null>(null)
  const router = useRouter()
  const { inviteId, token, email: inviteEmail, redirect, authStep } = router.query

  useEffect(() => {
    if (inviteEmail && typeof inviteEmail === 'string') {
      setEmail(inviteEmail)
      if (authStep === 'sign-in') {
        setStep('login')
      } else if (authStep === 'sign-up') {
        setStep('register')
      }
    }
  }, [inviteEmail, authStep])

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
