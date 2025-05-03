'use client'
import { Github, Twitter, Linkedin, ChevronRight, Code, Clock, GitCommit, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';
import { useRef } from 'react';

const Hero: React.FC = () => {
  const scrollToGettingStarted = () => {
    const gettingStartedSection = document.getElementById('getting-started');
    gettingStartedSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="pt-4 pb-16 md:pt-6 md:pb-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-12 md:mb-16">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300 mb-6">
            <span className="flex h-2 w-2 rounded-full bg-indigo-500 mr-2"></span>
            Unlock GOT characters with your coding time
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
            Track your coding activity.
            <span className="text-indigo-600 dark:text-indigo-400 block">
              Boost your productivity.
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 md:mb-10 max-w-2xl mx-auto">
            The developer-focused productivity platform that helps you track coding time, 
            commits, and activity across all your projects with real-time analytics.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="group cursor-pointer" onClick={scrollToGettingStarted}>
              Get Started
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            
            <Button size="lg" variant="outline" className="cursor-pointer">
              Learn More
            </Button>
          </div>
        </div>
        
        {/* Bento Grid */}
        <div className="grid grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto mt-16">
          {[
            { src: "/Image1.png", alt: "StatTrack Feature 1" },
            { src: "/Image2.png", alt: "StatTrack Feature 2" },
            { src: "/Image3.png", alt: "StatTrack Feature 3" },
            { src: "/Image4.png", alt: "StatTrack Feature 4" },
          ].map(({ src, alt }) => (
            <div
              key={src}
              className="relative overflow-hidden rounded-2xl cursor-pointer"
            >
              <img
                src={src}
                alt={alt}
                className="w-full h-full object-contain rounded-2xl transform transition-all duration-300 hover:scale-105 hover:rotate-1 hover:shadow-2xl"
              />
            </div>
          ))}
          {/* Full width image */}
          <div className="col-span-2 relative overflow-hidden rounded-2xl cursor-pointer">
            <img
              src="/Image5.png"
              alt="StatTrack Feature 5"
              className="w-full h-full object-contain rounded-2xl transform transition-all duration-300 hover:scale-105 hover:rotate-1 hover:shadow-2xl"
            />
          </div>
        </div>
        
        <div className="flex justify-center mt-8 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center space-x-2 mr-6 cursor-pointer">
            <Clock size={16} className="text-indigo-500" />
            <span>Track time</span>
          </div>
          <div className="flex items-center space-x-2 mr-6 cursor-pointer">
            <GitCommit size={16} className="text-indigo-500" />
            <span>Monitor commits</span>
          </div>
          <div className="flex items-center space-x-2 cursor-pointer">
            <Code size={16} className="text-indigo-500" />
            <span>Real-time analytics</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;