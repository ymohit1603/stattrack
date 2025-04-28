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
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Github size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          
          <div className="col-span-1">
            <h3 className="font-medium text-sm uppercase tracking-wider text-muted-foreground mb-4">Product</h3>
            <ul className="space-y-3">
              <li><Link href="/features" className="text-foreground hover:text-accent transition-colors">Features</Link></li>
              <li><Link href="/extension" className="text-foreground hover:text-accent transition-colors">VS Code Extension</Link></li>
              <li><Link href="/integrations" className="text-foreground hover:text-accent transition-colors">Integrations</Link></li>
              <li><Link href="/pricing" className="text-foreground hover:text-accent transition-colors">Pricing</Link></li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="font-medium text-sm uppercase tracking-wider text-muted-foreground mb-4">Resources</h3>
            <ul className="space-y-3">
              <li><Link href="/blog" className="text-foreground hover:text-accent transition-colors">Blog</Link></li>
              <li><Link href="/documentation" className="text-foreground hover:text-accent transition-colors">Documentation</Link></li>
              <li><Link href="/community" className="text-foreground hover:text-accent transition-colors">Community</Link></li>
              <li><Link href="/support" className="text-foreground hover:text-accent transition-colors">Support</Link></li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="font-medium text-sm uppercase tracking-wider text-muted-foreground mb-4">Company</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-foreground hover:text-accent transition-colors">About</Link></li>
              <li><Link href="/careers" className="text-foreground hover:text-accent transition-colors">Careers</Link></li>
              <li><Link href="/contact" className="text-foreground hover:text-accent transition-colors">Contact</Link></li>
              <li><Link href="/privacy" className="text-foreground hover:text-accent transition-colors">Privacy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-10 mt-10 border-t border-border flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} CodeTrack. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/cookies" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;