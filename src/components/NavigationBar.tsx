import { LogOut, User, Settings, Home } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel
} from './ui/dropdown-menu'
import { NavigationMenu, NavigationMenuList } from './ui/navigation-menu'
import { NavigationMenuItem, NavigationMenuLink } from '@radix-ui/react-navigation-menu'
import '@/styles/globals.css'
import { Button } from './ui/button'
import Link from 'next/link'

export const NavigationBar = () => {
  return (
    <nav className='bg-inherit p-4'>
      <div className='flex items-center justify-between'>
        {/* Other Navigation Items can be added here */}

        <NavigationMenu>
          <NavigationMenuList className='flex h-fit justify-between border-b p-3'>
            <NavigationMenuItem>
              <NavigationMenuLink href={'/'}>
                <Button>
                  <Home />
                </Button>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* Add ml-auto to push items to the right */}
            <NavigationMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className='flex items-center text-white transition-colors hover:text-gray-300'>
                    <User />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='rounded-md bg-inherit p-2 shadow-lg'>
                  {' '}
                  {/* Add right-0 to align dropdown to the right */}
                  <DropdownMenuLabel className='font-semibold text-gray-700'>Profile</DropdownMenuLabel>
                  <DropdownMenuItem asChild>
                    <Link passHref href={'/profile'}>
                      <Button title='Profile' variant='ghost' className='' size={'sm'}>
                        Profile
                      </Button>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link passHref href={'/logout'}>
                      <Button title='Logout' variant='ghost' className='' size={'sm'}>
                        Logout
                      </Button>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </nav>
  )
}
