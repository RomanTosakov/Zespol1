import { useQuery } from '@tanstack/react-query'
import { useProjectsStore } from '../store/projectsStore'
import { axios } from '../utils/api/axios'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

type TResponse = {
  id: string
}

export const useGetProjectId = () => {
  const { query, push } = useRouter()

  const projectSlug = query.projectSlug as string

  const { projectId, setProjectId } = useProjectsStore()

  const { data, failureCount, ...rest } = useQuery<unknown, Error, TResponse>({
    queryKey: ['projects', 'id', projectSlug],
    queryFn: async () => {
      const data = await axios.get<TResponse>(`/slugs/${projectSlug}/exchange`)

      setProjectId((data as unknown as TResponse).id)
      return data
    },

    enabled: !!projectSlug
  })

  useEffect(() => {
    if (failureCount > 0) {
      push('/')
    }
  }, [data, setProjectId, failureCount, projectSlug, push])

  return projectId
}
