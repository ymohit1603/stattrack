import { Clock, GitBranch, Github, Trophy, Users, BarChart3, Code, Zap } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="group bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="w-12 h-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-800/50">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300 group-hover:text-gray-900 dark:group-hover:text-gray-300">{description}</p>
    </div>
  );
};

const Features: React.FC = () => {
  const features = [
    {
      icon: <Clock size={24} />,
      title: "Track Coding Time",
      description: "Automatically track your coding activity across all your projects and editors."
    },
    {
      icon: <GitBranch size={24} />,
      title: "Monitor Commits",
      description: "Track your commit history, frequency, and productivity streaks to optimize your workflow."
    },
    {
      icon: <Github size={24} />,
      title: "GitHub Integration",
      description: "Seamless integration with GitHub to track pull requests, code reviews, and collaboration metrics."
    },
    {
      icon: <Trophy size={24} />,
      title: "Public Leaderboard",
      description: "Compare your productivity with other developers and compete for the top spots on the leaderboard."
    },
    {
      icon: <Users size={24} />,
      title: "Team Analytics",
      description: "Track team productivity, identify bottlenecks, and improve collaboration across projects."
    },
    {
      icon: <BarChart3 size={24} />,
      title: "Detailed Dashboards",
      description: "Visualize your coding patterns with beautiful charts and actionable insights to improve productivity."
    },
    {
      icon: <Code size={24} />,
      title: "Language Breakdown",
      description: "See which programming languages you use most often and track your proficiency over time."
    },
    {
      icon: <Zap size={24} />,
      title: "Private Leaderboards",
      description: "Create private leaderboards for your team,friends or organization to track progress and competition."
    }
  ];

  return (
    <section id="features" className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Everything you need to boost productivity
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Powerful tools designed specifically for developers to track and improve coding efficiency.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;