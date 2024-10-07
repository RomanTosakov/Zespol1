import * as yup from 'yup'

export const emailSchema = yup.object().shape({
  email: yup.string().required('Required field').email('Invalid email')
})
