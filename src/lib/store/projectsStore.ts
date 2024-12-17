import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type TProjectStore = {
  projectId: string;
  projectName: string;
  setProjectId: (projectId: string) => void;
  setProjectName: (projectName: string) => void;
};

const getProjectSlugFromPath = () => {
  if (typeof window === 'undefined') {
    return 'server';
  }

  const path = window.location.pathname;
  const parts = path.split('/');
  const orgKey = parts.indexOf('projects');

  return parts[orgKey + 1] || 'global';
};

export const useProjectsStore = create(
  persist<TProjectStore>(
    (set, get) => ({
      projectId: '',
      projectName: '',
      setProjectId: (projectId) => set({ projectId }),
      setProjectName: (projectName) => set({ projectName }),
    }),
    {
      name: `${getProjectSlugFromPath()}-projects-store`,
      storage: createJSONStorage(() => localStorage),
    }
  )
);
