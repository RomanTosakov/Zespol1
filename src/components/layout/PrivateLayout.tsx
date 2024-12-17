import { useGetProjectId } from '@/lib/hooks/useGetProjectId'
import { Breadcrumbs } from '../Breadcrumbs'
import { Separator } from '../ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '../ui/sidebar'
import { AppSidebar } from './AppSidebar'

type TProps = {
  children: React.ReactNode
}

export const PrivateLayout: React.FC<TProps> = ({ children }) => {
  useGetProjectId()

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className='flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12'>
          <div className='flex items-center gap-2 px-4'>
            <SidebarTrigger className='-ml-1' />
            <Separator orientation='vertical' className='mr-2 h-4' />
            <Breadcrumbs />
          </div>
        </header>
        <div className='flex w-full flex-1'>{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
