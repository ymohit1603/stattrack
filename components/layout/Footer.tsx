import Link from 'next/link';
import { Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="py-12 border-t border-border mt-24">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <Link href="/" className="text-xl font-bold tracking-tight gradient-text inline-block">
            StatTrack
          </Link>
          <p className="mt-4 text-muted-foreground text-sm">
            Level up your coding journey with real-time stats, epic achievements, and a thriving developer community.
          </p>
          <div className="flex justify-center space-x-4 mt-6">
            <a href="https://github.com/ymohit1603" className="text-muted-foreground hover:text-foreground transition-colors">
              <Github size={20} />
            </a>
            <a href="https://x.com/ymohit1603" className="text-muted-foreground hover:text-foreground transition-colors">
              <Twitter size={20} />
            </a>
          </div>
        </div>
        
        <div className="pt-10 mt-10 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} CodeTrack. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;