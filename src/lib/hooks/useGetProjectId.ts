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
    queryFn: () => {
      const data = axios.get<TResponse>(`/slugs/${projectSlug}/exchange`)

      return data
    },
    initialData: {
      id: projectId
    },
    enabled: !!projectSlug,
    staleTime: projectId ? 1000 * 60 * 60 : 0
  })

  useEffect(() => {
    if (failureCount) {
      push('/')
    } else {
      if (data) {
        setProjectId(data.id)
      }
    }
  }, [data, setProjectId, failureCount])

  return projectId
}
