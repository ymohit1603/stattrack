'use client'
import {  Terminal, Download, KeyRound, Rocket } from 'lucide-react';
import { Button } from '../ui/button';
import { useRef } from 'react';

const StepCard = ({ 
  number, 
  title, 
  description, 
  image, 
  icon: Icon 
}: { 
  number: number; 
  title: string; 
  description: string; 
  image?: string;
  icon: any;
}) => {
  return (
    <div className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
          <Icon size={24} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">Step {number}</span>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{description}</p>
          <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            {image && <img 
              src={image} 
              alt={title} 
              className="w-full h-auto object-cover"
            />}
          </div>
        </div>
      </div>
    </div>
  );
};

const GettingStarted = () => {
  const gettingStartedRef = useRef<HTMLElement>(null);

  const steps = [
    {
      number: 1,
      title: "Login & Get Your Session ID",
      description: "Sign in to StatTrack and copy your unique session ID from your profile settings.",
      image: "/image.png", // Replace with actual login screenshot
      icon: Terminal
    },
    {
      number: 2,
      title: "Install VS Code Extension",
      description: "Download and install the StatTrack extension from the VS Code marketplace.",
      image: "/ext1.png", // Replace with actual extension screenshot
      icon: Download
    },
    {
      number: 3,
      title: "Configure Your API Key",
      description: "Press Ctrl+Shift+P, search for 'StatTrack API Key', and paste your session key.",
      image: "/ext2.png", // Replace with actual command palette screenshot
      icon: KeyRound
    },
    {
      number: 4,
      title: "Start Your Coding Journey",
      description: "Press Enter and watch as your coding stats come to life! 🚀 Time to make your keyboard proud!",
      
      icon: Rocket
    }
  ]; 

  

  return (
    <section ref={gettingStartedRef} id="getting-started" className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Get Started in Seconds
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Follow these simple steps to start tracking your coding journey
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto space-y-6">
          {steps.map((step, index) => (
            <StepCard key={index} {...step} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default GettingStarted; 