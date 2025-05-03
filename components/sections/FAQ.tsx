'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean; 
  toggle: () => void;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer, isOpen, toggle }) => {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700 py-4">
      <button
        className="flex justify-between items-center w-full text-left focus:outline-none"
        onClick={toggle}
      >
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">{question}</h3>
        <div className="ml-2 flex-shrink-0 text-gray-500 dark:text-gray-400">
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </button>
      
      {isOpen && (
        <div className="mt-3 text-gray-600 dark:text-gray-400">
          {answer}
        </div>
      )}
    </div>
  );
};

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number>(0);
  
  const faqs = [
    {
      question: "How does StatTrack track my coding time?",
      answer: "StatTrack offers IDE extensions for VS Code, IntelliJ, and other popular editors that automatically track your active coding time. Additionally, our GitHub integration tracks commits, pull requests, and code reviews to provide a comprehensive view of your development activity."
    },
    {
      question: "Is my coding data private?",
      answer: "Yes, your coding data is private by default. You have complete control over what information is shared on your public profile. Team administrators can see team members' data, but individual activity details remain private unless you choose to share them."
    },
    {
      question: "Can I use StatTrack with private repositories?",
      answer: "Absolutely! StatTrack works with both public and private repositories. Our GitHub integration requires permission to access your repositories, but we never store your actual code, only metadata about your coding activity."
    },
    {
      question: "Can I track time across multiple computers?",
      answer: "Yes, StatTrack will sync your coding activity across all your devices where you have our extensions installed. Your dashboard will show aggregated data from all sources."
    },
    {
      question: "Does StatTrack work with GitLab or Bitbucket?",
      answer: "Currently, StatTrack has native integration with GitHub. GitLab and Bitbucket integrations are on our roadmap and will be available in the coming months. You can still track your coding time with our editor extensions while using these platforms."
    },
    {
      question: "How accurate is the time tracking?",
      answer: "StatTrack uses intelligent activity detection to ensure accuracy. It tracks active coding time and automatically pauses when you're inactive for more than 2 minutes. Our algorithms also filter out time spent browsing documentation or other non-coding activities."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section id="faq" className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Frequently asked questions
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Everything you need to know about StatTrack.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              toggle={() => toggleFAQ(index)}
            />
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-gray-600 dark:text-gray-400">
            Didn't find what you're looking for?{' '}
            <a href="#" className="text-indigo-600 dark:text-indigo-400 hover:underline">
              Contact our support team
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default FAQ;