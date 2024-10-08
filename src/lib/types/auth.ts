import { Database } from './supabase-types'

export type TAuthSteps = 'login' | 'register' | 'enter-email'

export type TProfile = Database['public']['Tables']['profiles']['Row']

export type TEnterEmailForm = {
  email: string
}

export type TEnterEmailResponse = {
  email: string
  name: string
}

export type TSignUpForm = {
  full_name: string
  password: string
  email: string
}

export type TSignInForm = {
  email: string
  password: string
}
