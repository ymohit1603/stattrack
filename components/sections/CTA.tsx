
import { Button } from "../ui/button";
import { Zap } from 'lucide-react';

const CTA: React.FC = () => {
  return (
    <section id="start" className="py-16 md:py-24 bg-gray-600 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute -left-1/4 -top-1/4 w-1/2 h-1/2 bg-white rounded-full blur-3xl"></div>
        <div className="absolute -right-1/4 -bottom-1/4 w-1/2 h-1/2 bg-white rounded-full blur-3xl"></div>
      </div>
      
      {/* Code pattern background */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full" style={{ fontFamily: 'monospace', fontSize: '10px', color: 'white', lineHeight: '12px', overflow: 'hidden' }}>
          {"console.log('tracking');".repeat(1000)}
        </div>
      </div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to boost your productivity?
          </h2>
          
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Join thousands of developers who use StatTrack to measure and improve their coding efficiency every day.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
            <Button 
              variant="default" 
              size="lg"
              className="bg-white text-indigo-600 hover:bg-indigo-50"
            >
              <Zap size={20} className="mr-2" />
              Start Tracking Now
            </Button>
            
            <Button 
              variant="default" 
              size="lg"
              className="bg-white text-indigo-600 hover:bg-indigo-50"
            >
              Schedule a Demo
            </Button>
          </div>
          
          <p className="text-indigo-200 text-sm">
            No credit card required. Free plan available forever.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTA;