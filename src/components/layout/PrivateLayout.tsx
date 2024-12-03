import { useGetProjectId } from '@/lib/hooks/useGetProjectId'
import { cn } from '@/lib/utils'
import { LogOut, PanelsTopLeft, Presentation, Settings, User, User2, Users } from 'lucide-react'
import Link from 'next/link'
import { Button } from '../ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../ui/dropdown-menu'
import { ScrollArea } from '../ui/scroll-area'
import { useRouter } from 'next/router'
import { useNavItems } from '@/lib/hooks/useNavItems'

type TProps = {
  children: React.ReactNode
}

export const PrivateLayout: React.FC<TProps> = ({ children }) => {
  useGetProjectId()

  const router = useRouter()

  const navItems = useNavItems({
    projectSlug: router.query.projectSlug as string
  })

  return (
    <div vaul-drawer-wrapper='' className={cn('grid h-dvh w-full grid-rows-[auto_1fr] overflow-hidden bg-card')}>
      <div className='flex h-fit justify-between border-b p-3'>
        <div className='flex items-center gap-4'>
          {router.query.projectSlug && (
            <>
              {navItems.map((item, index) => (
                <Link key={index} href={item.href} passHref>
                  <Button variant='ghost' className='flex items-center gap-2'>
                    {index === 0 && <Users />}
                    {index === 1 && <Presentation />}
                    {index === 2 && <Settings />}
                    {item.label}
                  </Button>
                </Link>
              ))}
            </>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={'ghost'} className='rounded-full px-2'>
              <User2 />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Profile menu</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={'/profile'} className='cursor-pointer'>
                <User className='mr-2' />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <Link href={'/projects/dashboard'} className='cursor-pointer'>
                <PanelsTopLeft className='mr-2' />
                Dashboard
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={'/logout'} className='cursor-pointer'>
                <LogOut className='mr-2' />
                Logout
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ScrollArea className='h-full'>{children}</ScrollArea>
    </div>
  )
}
