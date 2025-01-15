import { useGetProjectId } from '@/lib/hooks/useGetProjectId'
import { TSprintForm, TSprintWithTasks } from '@/lib/types/sprints'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axios } from '../../axios'
import { toast } from 'sonner'

type TEditSprintParams = {
  formData: TSprintForm
  id: string
}

export const useEditSprint = () => {
  const projectId = useGetProjectId()
  const queryClient = useQueryClient()

  const {
    mutate,
    isPending: isLoading,
    ...rest
  } = useMutation<TSprintWithTasks, Error, TEditSprintParams>({
    mutationFn: async ({ formData, id }: TEditSprintParams) => {
      const { data } = await axios.put(`/projects/${projectId}/sprints/${id}`, {
        formData
      })
      return data
    },
    onSuccess: async (_, { id }) => {
      await queryClient.invalidateQueries({ queryKey: ['sprints', projectId] })

      toast.success('Sprint updated successfully')
    }
  })

  return { editSprint: mutate, isLoading, ...rest }
}
