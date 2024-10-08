import * as yup from 'yup'
import { emailSchema, passwordSchema } from './email'

export const signInSchema = yup.object().shape({
  email: emailSchema,
  password: passwordSchema
})
