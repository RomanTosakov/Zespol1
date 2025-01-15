import { useGetProjectId } from '@/lib/hooks/useGetProjectId'
import { TTaskForm } from '@/lib/types/tasks'
import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { axios } from '../../axios'

type TUseCreateTask = () => UseMutationResult<any, any, TTaskForm, unknown>

export const useCreateTask: TUseCreateTask = () => {
  const projectId = useGetProjectId()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async form => {
      return await axios.post(`/projects/${projectId}/tasks`, {
        formData: form
      })
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['tasks', projectId]
      })

      await queryClient.invalidateQueries({
        queryKey: ['sprints', projectId]
      })

      toast.success('Task created')
    },

    onError: error => {
      toast.error('Error while creating task')
    }
  })
}
