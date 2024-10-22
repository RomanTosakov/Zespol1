import * as yup from 'yup'

export const orgSchema = yup.object().shape({
  name: yup
    .string()
    .required('Name is required')
    .min(3, 'Name must be at least 3 characters')
    .max(255, 'Name must be at most 255 characters')
})
