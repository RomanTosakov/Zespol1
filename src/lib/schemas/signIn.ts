import * as yup from 'yup'
import { emailSchema, passwordSchema } from './email'

export const signIn = yup.object().shape({
  email: emailSchema,
  password: passwordSchema
})
