'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  Menu, 
  X, 
  BarChart2, 
  Clock, 
  Award, 
  User,
  LogOut,
  ChevronDown,
  ArrowRight,
  Mail,
  Key
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { generateSessionKey } from '@/lib/session';
import { useToast } from '@/components/ui/use-toast';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const handleCopySessionKey = () => {
    if (!user?.id) return;
    
    const sessionKey = generateSessionKey(user.id.toString());
    navigator.clipboard.writeText(sessionKey);
    
    toast({
      title: "Session Key Copied! 🔑",
      description: (
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <p className="text-sm font-medium">Your session key has been copied</p>
            <p className="text-xs text-muted-foreground mt-1">Click to dismiss</p>
          </div>
          <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <Key className="h-4 w-4 text-green-600 dark:text-green-400" />
          </div>
        </div>
      ),
      duration: 3000, // Auto dismiss after 3 seconds
      className: "bg-white dark:bg-gray-800 border border-green-200 dark:border-green-800 shadow-lg",
    });
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const scrollToGettingStarted = (e: React.MouseEvent) => {
    e.preventDefault();
    const gettingStartedSection = document.getElementById('getting-started');
    gettingStartedSection?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/leaderboard', label: 'Leaderboard' },
    { href: '/profile', label: 'Profile' },
    // { href: '#getting-started', label: 'Get Started', onClick: scrollToGettingStarted }
  ];

  // Get user initials for avatar fallback
  const getUserInitials = (email: string) => {
    return email.split('@')[0].slice(0, 2).toUpperCase();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2 cursor-pointer">
            <span className="text-xl font-bold">StatTrack</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                // onClick={link.onClick}
                className="text-foreground/80 hover:text-foreground transition-colors cursor-pointer"
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full cursor-pointer">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.profile_url || ''} alt={user.email || 'User'} />
                      <AvatarFallback className="bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
                        {getUserInitials(user.email || '')}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.username || 'User'}</p>
                      <p className="text-xs leading-none text-muted-foreground flex items-center">
                        <Mail className="mr-1 h-3 w-3" />
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleCopySessionKey}
                    className="cursor-pointer"
                  >
                    <Key className="mr-2 h-4 w-4" />
                    <span>Copy Session Key</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={logout}
                    className="cursor-pointer text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login">
                  <Button className="cursor-pointer">Login</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-accent cursor-pointer"
            onClick={toggleMenu}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden transition-all duration-200 ease-in-out ${
            isMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
          } overflow-hidden`}
        >
          <div className="py-4 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-4 py-2 text-foreground/80 hover:text-foreground hover:bg-accent rounded-md transition-colors cursor-pointer"
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <div className="px-4 py-2">
                <div className="flex items-center space-x-3 mb-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.profile_url || ''} alt={user.email || 'User'} />
                    <AvatarFallback className="bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
                      {getUserInitials(user.email || '')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{user.username || 'User'}</p>
                    <p className="text-xs text-muted-foreground truncate flex items-center">
                      <Mail className="mr-1 h-3 w-3" />
                      {user.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left text-red-600 dark:text-red-400 hover:bg-accent rounded-md transition-colors cursor-pointer flex items-center"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2 px-4">
                <Link
                  href="/login"
                  className="block"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Button className="w-full cursor-pointer">Login</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;