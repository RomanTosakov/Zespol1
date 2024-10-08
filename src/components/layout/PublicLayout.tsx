import { cn } from '@/lib/utils'

type TProps = {
  children: React.ReactNode
}

export const PublicLayout: React.FC<TProps> = ({ children }) => {
  return (
    <div vaul-drawer-wrapper='' className={cn('h-dvh w-dvw bg-card')}>
      {children}
    </div>
  )
}
