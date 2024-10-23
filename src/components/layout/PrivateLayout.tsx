import { cn } from '@/lib/utils'
import { ScrollArea } from '../ui/scroll-area'
import { useGetProjectId } from '@/lib/hooks/useGetProjectId'
import { Navbar } from '../ui/navbar'

type TProps = {
  children: React.ReactNode
}

export const PrivateLayout: React.FC<TProps> = ({ children }) => {
  useGetProjectId()

  return (
    <div vaul-drawer-wrapper='' className={cn('grid h-dvh w-full grid-rows-[auto_1fr] overflow-hidden bg-card')}>
      <Navbar />

      <ScrollArea className='h-full'>{children}</ScrollArea>
    </div>
  )
}
