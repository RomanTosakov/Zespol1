import { useGetProjectId } from '@/lib/hooks/useGetProjectId'
import { TSprintForm, TSprintWithTasks } from '@/lib/types/sprints'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axios } from '../../axios'

export const useAddSprint = () => {
  const projectId = useGetProjectId()
  const queryClient = useQueryClient()

  const {
    mutate,
    isPending: isLoading,
    ...rest
  } = useMutation<TSprintWithTasks, Error, TSprintForm>({
    mutationFn: async (formData: TSprintForm) => {
      const { data } = await axios.post(`/projects/${projectId}/sprints`, {
        formData
      })
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sprints', projectId] })
    }
  })

  return { addSprint: mutate, isLoading, ...rest }
}
