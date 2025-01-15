import { useGetProjectId } from '@/lib/hooks/useGetProjectId'
import { TProject } from '@/lib/types/org'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { axios } from '../axios'

export const useUpdateProject = () => {
  const projectId = useGetProjectId()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (formData: TProject) => {
      return await axios.patch(`/projects/${projectId}`, {
        formData
      })
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['project', projectId]
      })
      toast.success('Project updated successfully')
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || 'Failed to update project')
    }
  })
} 