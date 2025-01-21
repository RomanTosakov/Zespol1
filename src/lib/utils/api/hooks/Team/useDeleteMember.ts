import { useGetProjectId } from '@/lib/hooks/useGetProjectId'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { axios } from '../../axios'

export const useDeleteMember = () => {
  const projectId = useGetProjectId()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (memberId: string) => {
      const { data } = await axios.delete(`/projects/${projectId}/members/${memberId}`)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-team', projectId] })
      queryClient.invalidateQueries({ queryKey: ['team', projectId] })
      queryClient.invalidateQueries({ queryKey: ['members', projectId] })
      toast.success('Member removed from project successfully')
    },
    onError: () => {
      toast.error('Failed to remove member from project')
    }
  })
} 