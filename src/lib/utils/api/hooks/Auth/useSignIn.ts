import { TSignInForm } from '@/lib/types/auth'
import { UseMutationResult, useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { axios } from '../../axios'

type TUseSignIn = () => UseMutationResult<any, any, TSignInForm, unknown>

export const useSignIn: TUseSignIn = () => {
  const router = useRouter()

  return useMutation({
    mutationFn: async form => {
      return await axios.post(`/auth/signIn`, {
        formData: form
      })
    },
    onSuccess: () => {
      router.push('/projects')
    },
    onError: error => {}
  })
}
