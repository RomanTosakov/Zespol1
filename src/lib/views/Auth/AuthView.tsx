import { TAuthSteps } from '@typesProj/auth'

import { useState } from 'react'
import { EnterEmailForm } from './components/EnterEmailForm'
import { SignUpForm } from './components/SignUpForm'

export const AuthView = () => {
  const [step, setStep] = useState<TAuthSteps>('enter-email')
  const [email, setEmail] = useState<string | null>(null)

  return (
    <div className='flex h-full items-center justify-center'>
      {step === 'enter-email' && <EnterEmailForm setAuthStep={setStep} setEmail={setEmail} />}
      {step === 'register' && <SignUpForm setAuthStep={setStep} email={email!} />}
    </div>
  )
}
