import * as yup from 'yup'
import { emailSchema } from './email'

export const enterEmailSchema = yup.object().shape({
  email: emailSchema
})
