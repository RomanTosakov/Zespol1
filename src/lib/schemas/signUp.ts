import * as yup from 'yup'
import { emailSchema, passwordSchema } from './email'

export const signUpSchema = yup.object().shape({
  email: emailSchema,
  full_name: yup.string().required('Required field'),
  password: passwordSchema
})
