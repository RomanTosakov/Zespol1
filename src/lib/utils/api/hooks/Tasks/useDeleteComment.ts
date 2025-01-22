import { useGetProjectId } from '@/lib/hooks/useGetProjectId'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { axios } from '../../axios'

type TDeleteCommentParams = {
  taskId: string
  commentId: string
}

export const useDeleteComment = () => {
  const projectId = useGetProjectId()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ taskId, commentId }: TDeleteCommentParams) => {
      return await axios.delete(`/projects/${projectId}/tasks/${taskId}/comments/${commentId}`)
    },
    onSuccess: async (_, { taskId }) => {
      await queryClient.invalidateQueries({ queryKey: ['tasks', projectId] })
      await queryClient.invalidateQueries({ queryKey: ['task', taskId] })
      toast.success('Comment deleted successfully')
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || 'Failed to delete comment')
    }
  })
} 