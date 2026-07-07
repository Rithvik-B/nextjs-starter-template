'use client';

import React from 'react';
import { useAuth } from '@/hooks/use-auth';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { LogOut, Settings } from 'lucide-react';


export const UserButton = () => {
  const { user, logout, openProfileModal } = useAuth();

  if (!user) return null;

  // Get user initials for avatar fallback
  const getInitials = () => {
    if (user.name) {
      const parts = user.name.split(' ');
      if (parts.length > 1) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
      }
      return user.name.substring(0, 2).toUpperCase();
    }
    return user.email.substring(0, 2).toUpperCase();
  };

  const displayName = user.name || user.email.split('@')[0];
  const avatarUrl = user.avatar_url;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="outline-none focus:outline-none shrink-0 cursor-pointer">
          <div className="h-8 w-8 rounded-full bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/20 dark:text-primary dark:hover:bg-primary/30 flex items-center justify-center font-semibold text-xs border border-primary/20 transition-all">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img 
                src={avatarUrl} 
                alt={displayName} 
                className="h-full w-full rounded-full object-cover" 
              />
            ) : (
              getInitials()
            )}
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-2" sideOffset={10}>
        {/* User Info Label */}
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1 p-2">
            <p className="text-sm font-semibold leading-none text-foreground">{displayName}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        {/* Manage settings or profile placeholder */}
        <DropdownMenuItem 
          onClick={openProfileModal}
          className="cursor-pointer flex items-center gap-x-2 py-2.5 px-3 text-sm rounded-md hover:bg-secondary transition-all"
        >
          <Settings className="h-4 w-4 text-muted-foreground" />
          <span>Manage Account</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Logout button */}
        <DropdownMenuItem 
          onClick={logout}
          className="cursor-pointer flex items-center gap-x-2 py-2.5 px-3 text-sm rounded-md text-destructive focus:text-destructive focus:bg-destructive/10 dark:focus:bg-destructive/20 transition-all"
        >
          <LogOut className="h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
