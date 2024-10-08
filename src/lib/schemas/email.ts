import * as yup from 'yup'

export const emailSchema = yup.string().required('Required field').email('Invalid email')

export const passwordSchema = yup.string().required('Required field').min(8, 'Password must be at least 8 characters')
