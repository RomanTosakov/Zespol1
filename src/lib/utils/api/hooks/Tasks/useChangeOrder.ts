import { TTask, TTaskOrderChange } from '@/lib/types/tasks'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useGetProjectId } from '@/lib/hooks/useGetProjectId'
import { toast } from 'sonner'
import { axios } from '../../axios'

export const useChangeOrder = () => {
  const queryClient = useQueryClient()
  const projectId = useGetProjectId()

  return useMutation({
    mutationFn: async (orderChanges: TTaskOrderChange[]) => {
      const { data } = await axios.put(`/projects/${projectId}/tasks`, orderChanges)
      return data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['tasks', projectId] })
      toast.success('Tasks updated')
    }
  })
}
