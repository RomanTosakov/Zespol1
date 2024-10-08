import { TSignUpForm } from '@/lib/types/auth'
import { UseMutationResult, useMutation } from '@tanstack/react-query'
import { axios } from '../../axios'
import { useRouter } from 'next/router'

type TUseSignUp = () => UseMutationResult<any, any, TSignUpForm, unknown>

export const useSignUp: TUseSignUp = () => {
  const router = useRouter()

  return useMutation({
    mutationFn: async form => {
      return await axios.post(`/auth/signUp`, {
        formData: form
      })
    },
    onSuccess: () => {
      router.push('/projects')
    },
    onError: error => {}
  })
}
