import { useGetProjectId } from '@/lib/hooks/useGetProjectId'
import { TTask } from '@/lib/types/tasks'
import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { axios } from '../../axios'

type TUseEditTask = () => UseMutationResult<
  any,
  any,
  {
    formData: TTask
    id: string
  },
  unknown
>

export const useEditTask: TUseEditTask = () => {
  const projectId = useGetProjectId()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ formData: form, id }) => {
      return (await axios.patch(`/projects/${projectId}/tasks/${id}`, {
        formData: form
      })) as TTask
    },
    onSuccess: async data => {
      await queryClient.invalidateQueries({
        queryKey: ['tasks', projectId]
      })

      await queryClient.invalidateQueries({
        queryKey: ['task']
      })

      toast.success('Task edited')
    },

    onError: error => {
      toast.error('Error while editing task')
    }
  })
}
