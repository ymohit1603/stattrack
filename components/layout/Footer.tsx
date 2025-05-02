import React from 'react';
import Link from 'next/link';
import { Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="py-12 border-t border-border mt-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="text-xl font-bold tracking-tight gradient-text">
              CodeTrack
            </Link>
            <p className="mt-4 text-muted-foreground text-sm">
              Track your coding progress, join leaderboards, and showcase your development journey.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="https://github.com/ymohit1603" className="text-muted-foreground hover:text-foreground transition-colors">
                <Github size={20} />
              </a>
              <a href="https://x.com/ymohit1603" className="text-muted-foreground hover:text-foreground transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>                
        </div>
        
        <div className="pt-10 mt-10 border-t border-border flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} CodeTrack. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;