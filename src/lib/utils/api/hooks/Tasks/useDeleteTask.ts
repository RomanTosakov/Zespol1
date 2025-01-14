import { useGetProjectId } from '@/lib/hooks/useGetProjectId'
import { TTask } from '@/lib/types/tasks'
import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { axios } from '../../axios'

type TUseDeleteTask = () => UseMutationResult<
  any,
  any,
  {
    taskId: string
  },
  unknown
>

export const useDeleteTask: TUseDeleteTask = () => {
  const projectId = useGetProjectId()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ taskId }) => {
      return await axios.delete(`/projects/${projectId}/tasks/${taskId}`)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['tasks', projectId]
      })

      toast.success('Task deleted')
    },
    onError: error => {
      toast.error('Error while deleting task')
    }
  })
}
