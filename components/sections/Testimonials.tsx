

import { Star } from 'lucide-react';

interface TestimonialProps {
  quote: string;
  author: string;
  role: string;
  company: string;
  avatar: string;
  rating?: number;
}

const Testimonial: React.FC<TestimonialProps> = ({ 
  quote, 
  author, 
  role, 
  company, 
  avatar,
  rating = 5
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex space-x-1 mb-4">
        {Array.from({ length: rating }).map((_, i) => (
          <Star key={i} size={18} className="fill-yellow-400 text-yellow-400" />
        ))}
      </div>
      
      <blockquote className="text-gray-700 dark:text-gray-300 mb-6">
        "{quote}"
      </blockquote>
      
      <div className="flex items-center">
        <img 
          src={avatar} 
          alt={author} 
          className="h-10 w-10 rounded-full mr-3 object-cover"
        />
        <div>
          <div className="font-medium text-gray-900 dark:text-white">{author}</div>
          <div className="text-gray-600 dark:text-gray-400 text-sm">{role}, {company}</div>
        </div>
      </div>
    </div>
  );
};

const Testimonials: React.FC = () => {
  const testimonials = [
    {
      quote: "StatTrack has transformed how I code. I've increased my productivity by 35% in just two months by identifying my peak coding hours.",
      author: "Sarah Chen",
      role: "Senior Developer",
      company: "TechFusion",
      avatar: "https://images.pexels.com/photos/3776700/pexels-photo-3776700.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
      rating: 5
    },
    {
      quote: "The GitHub integration is seamless. I can track my team's productivity across projects and identify bottlenecks before they become issues.",
      author: "Michael Rodriguez",
      role: "Engineering Manager",
      company: "DataFlow",
      avatar: "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
      rating: 5
    },
    {
      quote: "The leaderboard feature created a friendly competition in our team. We've seen a 28% increase in commits since we started using StatTrack.",
      author: "James Wilson",
      role: "Full Stack Developer",
      company: "Codecrafters",
      avatar: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
      rating: 4
    },
    {
      quote: "As an indie developer, StatTrack helps me stay accountable and track my progress across multiple client projects without any overhead.",
      author: "Emily Zhang",
      role: "Freelance Developer",
      company: "Self-employed",
      avatar: "https://images.pexels.com/photos/773371/pexels-photo-773371.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
      rating: 5
    }
  ];

  return (
    <section id="testimonials" className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Loved by developers
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Join thousands of developers who have improved their productivity with StatTrack.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <Testimonial key={index} {...testimonial} />
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <div className="inline-flex items-center px-6 py-3 rounded-full text-lg font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300">
            <span className="font-bold mr-2">4.9/5</span> from over 1,200+ reviews
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;