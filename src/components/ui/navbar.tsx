import { Button } from '../ui/button';
import Link from 'next/link';
import { useState } from 'react';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex h-fit justify-between border-b p-3 relative">
      <div></div>
      <div className="relative">
        <Button
          type="button"
          className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-gray-800 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          id="menu-button"
          aria-expanded={isOpen}
          aria-haspopup="true"
          onClick={toggleDropdown}
        >
          <span className="inline-flex items-center">
            <img
              className="w-8 h-8 rounded-full"
              src="url_to_image"
              alt="User Avatar"
            />
          </span>
        </Button>

        {isOpen && (
          <div
            className="absolute right-0 mt-2 w-56 origin-top-right rounded-md shadow-lg bg-gray-900 ring-1 ring-white ring-opacity-5 focus:outline-none z-50"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="menu-button"
          >
            <div className="py-1" role="none">
              <span className="block px-4 py-4 text-xs text-white transition-colors duration-200">Account</span>
              <Link href="/profile" passHref legacyBehavior>
                <a className="block px-4 py-3 text-sm text-white hover:bg-gray-700 transition-colors duration-200">
                  Profile
                </a>
              </Link>

              <Link href="/settings" passHref legacyBehavior>
                <a className="block px-4 py-3 text-sm text-white hover:bg-gray-700 transition-colors duration-200">
                  Theme
                </a>
              </Link>

              <div className="border-t border-gray-700 my-1"></div>

              <Link passHref href={'/logout'}>
                <Button
                  title='Logout'
                  variant='ghost'
                  className="w-full block px-4 py-3 text-sm text-white hover:bg-gray-700 transition-colors duration-200 text-left"
                  size={'sm'}
                >
                  <span>Log out</span>
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
