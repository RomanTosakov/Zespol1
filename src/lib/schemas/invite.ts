import * as yup from 'yup'
import { emailSchema } from './email'

export const inviteSchema = yup.object().shape({
  email: emailSchema
})
