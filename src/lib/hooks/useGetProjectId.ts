import { useQuery } from '@tanstack/react-query'
import { useProjectsStore } from '../store/projectsStore'
import { axios } from '../utils/api/axios'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

type TResponse = {
  id: string
}

/**
 * @hook useGetProjectId
 * @description Custom hook for managing current project context and ID
 * @features
 * - Extracts project ID from URL slug
 * - Manages project context in global store
 * - Handles project navigation
 * - Provides project ID to child components
 * @returns {string} Current project ID
 * @throws Redirects to home page if project is not found
 */

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
