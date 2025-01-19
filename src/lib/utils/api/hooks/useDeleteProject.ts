import { useGetProjectId } from '@/lib/hooks/useGetProjectId'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { toast } from 'sonner'
import { axios } from '../axios'

export const useDeleteProject = () => {
  const projectId = useGetProjectId()
  const router = useRouter()

  return useMutation({
    mutationFn: async () => {
      return await axios.delete(`/projects/${projectId}`)
    },
    onSuccess: () => {
      toast.success('Project deleted successfully')
      router.push('/')
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || 'Failed to delete project')
    }
  })
} 