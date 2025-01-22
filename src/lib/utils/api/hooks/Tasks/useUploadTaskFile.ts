import { useGetProjectId } from '@/lib/hooks/useGetProjectId'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axios } from '../../axios'

type TUploadTaskFileParams = {
  file: File
  taskId: string
}

/**
 * Custom hook to upload a file attachment to a task
 * 
 * @remarks
 * This hook:
 * - Uploads a file using FormData and multipart/form-data
 * - Associates the uploaded file with a specific task
 * - Uses project ID from context
 * - Invalidates both task list and specific task cache
 * - Handles file upload with proper content type headers
 * 
 * @returns {UseMutationResult} Mutation object containing:
 *   - mutate: Function to upload file with {@link TUploadTaskFileParams}
 *   - isLoading: Boolean indicating if the upload is in progress
 *   - error: Error object if the upload failed
 *   - data: Upload response data
 *   - Other standard react-query mutation properties
 */
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
