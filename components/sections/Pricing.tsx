

import { Check, X } from 'lucide-react';
import { Button } from '../ui/button';

interface PlanFeature {
  text: string;
  included: boolean;
}

interface PricingPlanProps {
  name: string;
  price: string;
  description: string;
  features: PlanFeature[];
  popular?: boolean;
  buttonText: string;
}

const PricingPlan: React.FC<PricingPlanProps> = ({
  name,
  price,
  description,
  features,
  popular = false,
  buttonText
}) => {
  return (
    <div className={`relative bg-white dark:bg-gray-800 rounded-lg shadow-sm border ${
      popular 
        ? 'border-indigo-500 dark:border-indigo-500' 
        : 'border-gray-200 dark:border-gray-700'
    } overflow-hidden`}>
      {popular && (
        <div className="absolute top-0 inset-x-0 text-xs text-center text-white bg-indigo-600 py-1 font-medium">
          Most Popular
        </div>
      )}
      
      <div className={`p-6 ${popular ? 'pt-9' : 'pt-6'}`}>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{name}</h3>
        <div className="mb-4">
          <span className="text-4xl font-bold text-gray-900 dark:text-white">{price}</span>
          {price !== 'Free' && <span className="text-gray-600 dark:text-gray-400 ml-1">/month</span>}
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{description}</p>
        
        <Button 
          variant={popular ? 'default' : 'outline'}
          className="w-full mb-6"
        >
          {buttonText}
        </Button>
        
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              {feature.included ? (
                <Check size={20} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              ) : (
                <X size={20} className="text-gray-400 mr-2 flex-shrink-0 mt-0.5" />
              )}
              <span className={`text-sm ${
                feature.included 
                  ? 'text-gray-700 dark:text-gray-300' 
                  : 'text-gray-500 dark:text-gray-500'
              }`}>
                {feature.text}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const Pricing: React.FC = () => {
  const plans = [
    {
      name: "Starter",
      price: "Free",
      description: "Perfect for solo developers getting started with tracking.",
      features: [
        { text: "Track up to 3 projects", included: true },
        { text: "Basic GitHub integration", included: true },
        { text: "Daily coding summaries", included: true },
        { text: "7-day data history", included: true },
        { text: "Public profile", included: true },
        { text: "Team collaboration", included: false },
        { text: "Advanced analytics", included: false },
        { text: "API access", included: false },
      ],
      buttonText: "Get Started",
      popular: false
    },
    {
      name: "Pro",
      price: "$9",
      description: "For serious developers who want to optimize their workflow.",
      features: [
        { text: "Unlimited projects", included: true },
        { text: "Advanced GitHub integration", included: true },
        { text: "Real-time coding analytics", included: true },
        { text: "Unlimited data history", included: true },
        { text: "Enhanced public profile", included: true },
        { text: "Basic team features (up to 3 members)", included: true },
        { text: "Advanced analytics dashboard", included: true },
        { text: "Limited API access", included: true },
      ],
      buttonText: "Upgrade to Pro",
      popular: true
    },
    {
      name: "Team",
      price: "$29",
      description: "Designed for development teams to boost productivity together.",
      features: [
        { text: "Everything in Pro plan", included: true },
        { text: "Team dashboard & reports", included: true },
        { text: "Up to 10 team members", included: true },
        { text: "Team leaderboards", included: true },
        { text: "Code review tracking", included: true },
        { text: "Team productivity insights", included: true },
        { text: "Full API access", included: true },
        { text: "Priority support", included: true },
      ],
      buttonText: "Start Team Trial",
      popular: false
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large organizations with advanced security & scaling needs.",
      features: [
        { text: "Everything in Team plan", included: true },
        { text: "Unlimited team members", included: true },
        { text: "Custom integrations", included: true },
        { text: "Dedicated account manager", included: true },
        { text: "SSO & advanced security", included: true },
        { text: "On-premise deployment option", included: true },
        { text: "Custom reporting", included: true },
        { text: "SLA guarantees", included: true },
      ],
      buttonText: "Contact Sales",
      popular: false
    }
  ];

  return (
    <section id="pricing" className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Choose the plan that's right for you or your team.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {plans.map((plan, index) => (
            <PricingPlan key={index} {...plan} />
          ))}
        </div>
        
        <div className="mt-12 text-center text-gray-600 dark:text-gray-400">
          All plans include basic support and regular updates. 
        </div>
      </div>
    </section>
  );
};

export default Pricing;