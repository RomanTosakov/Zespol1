import { cn } from '@/lib/utils'
import { Button } from '../ui/button'
import Link from 'next/link'
import { LogOut } from 'lucide-react'
import { ScrollArea } from '../ui/scroll-area'
import { useGetProjectId } from '@/lib/hooks/useGetProjectId'
import { NavigationBar } from '../NavigationBar'

type TProps = {
  children: React.ReactNode
}

export const PrivateLayout: React.FC<TProps> = ({ children }) => {
  useGetProjectId()

  return (
    <div vaul-drawer-wrapper='' className={cn('grid h-dvh w-full grid-rows-[auto_1fr] overflow-hidden bg-card')}>
      <NavigationBar />

      <ScrollArea className='h-full'>{children}</ScrollArea>
    </div>
  )
}
