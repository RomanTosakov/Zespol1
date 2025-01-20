import * as yup from 'yup'
import { emailSchema } from './email'
import { TProjectRole } from '../types/org'

type TInviteRole = Exclude<TProjectRole, 'owner'>

export const inviteSchema = yup.object().shape({
  email: emailSchema,
  role: yup.string().oneOf(['member', 'administrator', 'manager'] as TInviteRole[]).default('member')
})
