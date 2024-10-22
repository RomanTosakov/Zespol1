import { TOrgForm } from '@/lib/types/org'
import { UseMutationResult, useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { axios } from '../axios'

type TUseCreateProject = () => UseMutationResult<any, any, TOrgForm, unknown>

export const useCreateProject: TUseCreateProject = () => {
  const router = useRouter()

  return useMutation({
    mutationFn: async form => {
      return await axios.post(`/projects`, {
        formData: form
      })
    },
    onSuccess: (data: {
      data: {
        slug: string
      }
    }) => {
      router.push(`/projects/${data.data.slug}`)
    },
    onError: error => {}
  })
}
