import { Clock, Columns, List, Settings, User, Wrench } from 'lucide-react'
import { useRouter } from 'next/router'

export type TBoardsSidebarItem = {
  label: string
  href: string
  key: string
  icon: React.ReactNode
  isActive?: boolean
}

export const useSidebarItems = () => {
  const { query, pathname } = useRouter()
  const projectSlug = query.projectSlug as string
  const lastPathname = pathname.split('/').pop()

  if (!projectSlug) {
    return {
      boards: [],
      settings: []
    }
  }

  const boardsItems: TBoardsSidebarItem[] = [
    {
      label: 'Backlog',
      href: `/projects/${projectSlug}/boards/backlog`,
      key: 'backlog',
      icon: <List />,
      isActive: lastPathname === 'backlog'
    },
    {
      label: 'Sprints',
      href: `/projects/${projectSlug}/boards/sprints`,
      key: 'sprints',
      icon: <Clock />,
      isActive: lastPathname === 'sprints'
    },
    {
      label: 'Kanban [WIP]',
      href: `/projects/${projectSlug}/boards/kanban`,
      key: 'kanban',
      icon: <Columns />,
      isActive: lastPathname === 'kanban'
    }
  ]

  const settingsItems: TBoardsSidebarItem[] = [
    {
      label: 'Details',
      href: `/projects/${projectSlug}/settings/details`,
      key: 'details',
      icon: <Settings />,
      isActive: lastPathname === 'details'
    },
    {
      label: 'Access',
      href: `/projects/${projectSlug}/settings/access`,
      key: 'access',
      icon: <Settings />,
      isActive: lastPathname === 'access'
    },
    {
      label: 'Team',
      href: `/projects/${projectSlug}/team`,
      key: 'members',
      icon: <User />,
      isActive: lastPathname === 'team'
    }
  ]

  return {
    boards: boardsItems,
    settings: settingsItems
  }
}
