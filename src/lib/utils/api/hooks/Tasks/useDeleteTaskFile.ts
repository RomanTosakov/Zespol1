import { useGetProjectId } from '@/lib/hooks/useGetProjectId'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axios } from '../../axios'

type TDeleteTaskFileParams = {
  taskId: string
  fileId: string
}

export const useDeleteTaskFile = () => {
  const projectId = useGetProjectId()
  const queryClient = useQueryClient()

  const { ...rest } = useMutation<unknown, Error, TDeleteTaskFileParams>({
    mutationFn: async ({ taskId, fileId }) => {
      const { data } = await axios.delete(`/projects/${projectId}/tasks/${taskId}/files/${fileId}`)
      return data
    },
    onSuccess: (_, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: ['task', taskId] })
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] })
    }
  })

  return { ...rest }
}
