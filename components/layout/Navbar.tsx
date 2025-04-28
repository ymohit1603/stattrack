'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  Menu, 
  X, 
  BarChart2, 
  Clock, 
  Award, 
  User,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth, authService } from '@/lib/auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const { user } = useAuth();

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    authService.logout();
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <BarChart2 className="w-4 h-4 mr-2" /> },
    { name: 'Leaderboard', path: '/leaderboard', icon: <Award className="w-4 h-4 mr-2" /> },
    { name: 'Activity', path: '/activity', icon: <Clock className="w-4 h-4 mr-2" /> },
  ];

  return (
    <nav 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-300",
        scrolled ? "bg-white/80 backdrop-blur-md shadow-sm dark:bg-gray-900/80" : "bg-transparent"
      )}
    >
      <div className="container px-4 mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-bold text-xl tracking-tight gradient-text">CodeTrack</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              href={link.path} 
              className="text-muted-foreground hover:text-foreground flex items-center transition-colors duration-200"
            >
              {link.icon}
              {link.name}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} alt={user.username} />
                    <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="outline" size="sm">
                <Link href="/auth">Log in</Link>
              </Button>
              <Button size="sm" className="bg-gradient-to-r from-code-blue to-code-purple hover:from-code-blue/90 hover:to-code-purple/90 transition-all duration-300">
                <Link href="/auth">Get Started</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="md:hidden text-foreground p-2"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div 
        className={cn(
          "fixed inset-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md z-40 flex flex-col pt-20 px-8 transform transition-transform duration-300 ease-in-out md:hidden",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col space-y-6">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              href={link.path} 
              className="text-foreground text-lg font-medium flex items-center py-2"
              onClick={() => setIsOpen(false)}
            >
              {link.icon}
              <span className="ml-2">{link.name}</span>
            </Link>
          ))}
          <div className="pt-6 mt-6 border-t border-border space-y-4">
            {user ? (
              <>
                <Link 
                  href="/profile" 
                  className="flex items-center text-foreground text-lg font-medium py-2"
                  onClick={() => setIsOpen(false)}
                >
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Link>
                <Button 
                  variant="destructive" 
                  className="w-full justify-center"
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" className="w-full justify-center">
                  <Link href="/auth">Log in</Link>
                </Button>
                <Button className="w-full justify-center bg-gradient-to-r from-code-blue to-code-purple">
                  <Link href="/auth">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;