import { TOrgForm } from '@/lib/types/org'
import { UseMutationResult, useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { axios } from '../axios'

type TUseCreateProject = () => UseMutationResult<any, any, TOrgForm, unknown>

/**
 * Custom hook to create a new project
 * 
 * @remarks
 * This hook:
 * - Creates a new project using the provided form data
 * - Automatically redirects to the new project page on success
 * 
 * @returns {UseMutationResult} Mutation object containing:
 *   - mutate: Function to trigger project creation with {@link TOrgForm} data
 *   - isLoading: Boolean indicating if the mutation is in progress
 *   - error: Error object if the mutation failed
 *   - Other standard react-query mutation properties
 */
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
