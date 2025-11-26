import React, { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import ThemeToggle from '../theme/ThemeToggle';
import authUser from "@/hooks/authUser";
import { FaUserCircle } from 'react-icons/fa';

export default function Navbar() {
  const user = authUser();
  const { basePath } = usePage().props;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    router.post(`${basePath}/logout`);
  };

  const handleProfileClick = () => {
    location.href = `${basePath}/profile`;
    setIsDropdownOpen(false);
  };

  return (
    <>
      <nav className="relative top-0 w-full p-4 flex justify-end bg-background">
        <div className="flex items-center gap-4">
          {user && (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="p-2 rounded-full border border-border
                  text-foreground
                  hover:bg-accent bg-accent hover:text-accent-foreground transition shadow-md"
                title="Meu Perfil"
              >
                <FaUserCircle size={24} />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-popover text-popover-foreground rounded-md shadow-lg py-1 z-20">
                  <div className="px-4 py-2 text-sm text-muted-foreground border-b border-border">
                    Olá, {user.name}!
                  </div>
                  <button
                    onClick={handleProfileClick}
                    className="block w-full text-left text-primary px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground"
                  >
                    Meu Perfil
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left text-primary px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground"
                  >
                    Sair
                  </button>
                </div>
              )}
            </div>
          )}
          <ThemeToggle />
        </div>
      </nav>
    </>
  );
}