import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type TProjectStore = {
  projectId: string
  setProjectId: (projectId: string) => void
}

const getProjectSlugFromPath = () => {
  if (typeof window === 'undefined') {
    return 'server'
  }

  const path = window.location.pathname
  const parts = path.split('/')
  const orgKey = parts.indexOf('projects')

  return parts[orgKey + 1] || 'global'
}

export const useProjectsStore = create(
  persist<TProjectStore>(
    (set, get) => ({
      projectId: '',
      setProjectId: projectId => set({ projectId })
    }),
    {
      name: `${getProjectSlugFromPath()}-projects-store`,
      storage: createJSONStorage(() => localStorage)
    }
  )
)
