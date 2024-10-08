import { TEnterEmailForm, TEnterEmailResponse } from '@/lib/types/auth'
import { UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query'
import { axios } from '../../axios'

type TUseCheckEmail = () => UseMutationResult<any, any, any, unknown>

export const useCheckEmail: TUseCheckEmail = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (form: TEnterEmailForm) => {
      return (await axios.post(`/auth/check`, {
        formData: form
      })) as TEnterEmailResponse
    },

    onSuccess: (response: TEnterEmailResponse) => {
      console.log(response)
    },
    onError: error => {}
  })
}
