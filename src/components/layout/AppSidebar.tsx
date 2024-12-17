import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail
} from '../ui/sidebar'
import Link from 'next/link'
import { TeamSwitcher } from '../TeamSwitcher'
import { UserSidebar } from '../UserSidebar'
import { useSidebarItems } from '@/hooks/useSidebarItems'
import { cn } from '@/lib/utils'

export const AppSidebar: React.FC = () => {
  const { boards, settings } = useSidebarItems()

  return (
    <Sidebar collapsible='icon'>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        {boards.length > 0 && settings.length > 0 ? (
          <>
            <SidebarGroup>
              <SidebarGroupLabel>Platform</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {boards.map(item => (
                    <SidebarMenuItem
                      key={item.key}
                      className={cn('', {
                        'bg-secondary': item.isActive
                      })}
                    >
                      <SidebarMenuButton asChild>
                        <Link href={item.href}>
                          {item.icon}
                          {item.label}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel>Settings</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {settings.map(item => (
                    <SidebarMenuItem
                      key={item.key}
                      className={cn('', {
                        'bg-secondary': item.isActive
                      })}
                    >
                      <SidebarMenuButton asChild>
                        <Link href={item.href}>
                          {item.icon}
                          {item.label}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        ) : null}
      </SidebarContent>
      <SidebarFooter>
        <UserSidebar />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
