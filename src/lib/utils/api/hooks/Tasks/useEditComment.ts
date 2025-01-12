import { useGetProjectId } from '@/lib/hooks/useGetProjectId'
import { TTaskComment } from '@/lib/types/tasks'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { axios } from '../../axios'

type EditCommentParams = {
  taskId: string
  commentId: string
  title: string
}

export const useEditComment = () => {
  const queryClient = useQueryClient()
  const projectId = useGetProjectId()

  return useMutation({
    mutationFn: async ({ taskId, commentId, title }: EditCommentParams) => {
      const { data } = await axios.patch<TTaskComment>(`/projects/${projectId}/tasks/${taskId}/comments/${commentId}`, {
        title
      })
      return data
    },
    onSuccess: async (_, { taskId }) => {
      await queryClient.invalidateQueries({ queryKey: ['tasks', projectId] })
      await queryClient.invalidateQueries({ queryKey: ['task', taskId] })
      toast.success('Comment updated')
    }
  })
}
