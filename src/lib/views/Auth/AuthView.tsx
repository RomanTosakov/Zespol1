import { TAuthSteps } from '@typesProj/auth'

import { useState } from 'react'
import { EnterEmailForm } from './components/EnterEmailForm'

export const AuthView = () => {
  const [step, setStep] = useState<TAuthSteps>('enter-email')

  return (
    <div className='flex h-full items-center justify-center'>
      {step === 'enter-email' && <EnterEmailForm setAuthStep={setStep} />}
    </div>
  )
}
