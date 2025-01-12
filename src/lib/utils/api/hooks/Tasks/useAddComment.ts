import { useGetProjectId } from '@/lib/hooks/useGetProjectId'
import { TTaskComment } from '@/lib/types/tasks'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { axios } from '../../axios'

type AddCommentParams = {
  taskId: string
  title: string
}

export const useAddComment = () => {
  const queryClient = useQueryClient()
  const projectId = useGetProjectId()

  return useMutation({
    mutationFn: async ({ taskId, title }: AddCommentParams) => {
      const { data } = await axios.post<TTaskComment>(`/projects/${projectId}/tasks/${taskId}/comments`, { title })
      return data
    },
    onSuccess: async (_, { taskId }) => {
      await queryClient.invalidateQueries({ queryKey: ['tasks', projectId] })
      await queryClient.invalidateQueries({ queryKey: ['task', taskId] })
      toast.success('Comment added')
    }
  })
}
