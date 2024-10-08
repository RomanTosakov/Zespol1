import { TEnterEmailForm, TEnterEmailResponse } from '@/lib/types/auth'
import { UseMutationResult, useMutation } from '@tanstack/react-query'
import { axios } from '../../axios'

type TUseCheckEmail = () => UseMutationResult<any, TEnterEmailResponse, any, unknown>

export const useCheckEmail: TUseCheckEmail = () => {
  return useMutation({
    mutationFn: async (form: TEnterEmailForm) => {
      return (await axios.post(`/auth/check`, {
        formData: form
      })) as TEnterEmailResponse
    },

    onSuccess: response => {
      console.log(response)
    },
    onError: error => {}
  })
}
