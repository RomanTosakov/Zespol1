import { cn } from '@/lib/utils'
import { Button } from '../ui/button'
import Link from 'next/link'
import { LogOut } from 'lucide-react'
import { ScrollArea } from '../ui/scroll-area'

type TProps = {
  children: React.ReactNode
}

export const PrivateLayout: React.FC<TProps> = ({ children }) => {
  return (
    <div vaul-drawer-wrapper='' className={cn('grid h-dvh w-full grid-rows-[auto_1fr] overflow-hidden bg-card')}>
      <div className='flex h-fit justify-between border-b p-3'>
        <div></div>
        <div className=''>
          <Link passHref href={'/logout'}>
            <Button title='Logout' variant='ghost' className='' size={'sm'}>
              <LogOut />
            </Button>
          </Link>
        </div>
      </div>

      <ScrollArea className='h-full'>{children}</ScrollArea>
    </div>
  )
}
