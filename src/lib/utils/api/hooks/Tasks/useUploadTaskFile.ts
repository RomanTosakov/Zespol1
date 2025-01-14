import { useGetProjectId } from '@/lib/hooks/useGetProjectId'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axios } from '../../axios'

type TUploadTaskFileParams = {
  file: File
  taskId: string
}

export const useUploadTaskFile = () => {
  const projectId = useGetProjectId()
  const queryClient = useQueryClient()

  const {
    mutate,

    ...rest
  } = useMutation<unknown, Error, TUploadTaskFileParams>({
    mutationFn: async ({ file, taskId }) => {
      const formData = new FormData()
      formData.append('file', file)

      const { data } = await axios.post(`/projects/${projectId}/files`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        params: {
          taskId
        }
      })
      return data
    },
    onSuccess: (_, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: ['task', taskId] })
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] })
    }
  })

  return { mutate, ...rest }
}
