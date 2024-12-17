import { ChartNoAxesGantt, ChevronsUpDown, FolderKanban } from 'lucide-react'
import * as React from 'react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar'
import { TProject } from '@/lib/types/projects'
import { useGetUserProjects } from '@/lib/utils/api/hooks/useGetUserProjects'
import { useRouter } from 'next/router'

export const TeamSwitcher = () => {
  const { isMobile } = useSidebar()
  const { data: projects, isLoading } = useGetUserProjects()
  const [activeProject, setActiveProject] = React.useState<TProject | undefined>(undefined)
  const { query, push } = useRouter()

  React.useEffect(() => {
    if (projects && query.projectSlug) {
      setActiveProject(projects.find(project => project.slug === query.projectSlug))
    }

    if (!query.projectSlug) {
      setActiveProject({
        name: 'Dashboard'
      } as TProject)
    }
  }, [projects, query.projectSlug])

  const handleProjectClick = (project: TProject) => {
    setActiveProject(project)
    push(`/projects/${project.slug}`)
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground'>
                <FolderKanban className='size-4' />
              </div>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-semibold'>{activeProject?.name}</span>
              </div>
              <ChevronsUpDown className='ml-auto' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
            align='start'
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className='text-xs text-muted-foreground'>Teams</DropdownMenuLabel>
            {projects?.map((team, index) => (
              <DropdownMenuItem key={team.name} onClick={() => handleProjectClick(team)} className='gap-2 p-2'>
                <div className='flex size-6 items-center justify-center rounded-sm border'>
                  <FolderKanban className='size-4 shrink-0' />
                </div>
                {team.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className='gap-2 p-2' onClick={() => push('/projects/dashboard')}>
              <div className='flex size-6 items-center justify-center rounded-md border bg-background'>
                <ChartNoAxesGantt className='size-4' />
              </div>
              <div className='font-medium text-muted-foreground'>Dashboard</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
