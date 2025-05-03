import { ThemeProvider } from '../contexts/ThemeContext';
import Header from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Hero from '../components/sections/Hero';
import Features from '../components/sections/Features';
import Testimonials from '../components/sections/Testimonials';
import Pricing from '../components/sections/Pricing';
import FAQ from '../components/sections/FAQ';
import CTA from '../components/sections/CTA';
import GettingStarted from '../components/sections/GettingStarted';

// Add background pattern style
import './grid.css';

function App() {
  // Smooth scroll to anchor
 


  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <Header />
        <main>
          <Hero />
          <Features />
          <GettingStarted />
          {/* <Testimonials /> */}
          {/* <Pricing /> */}
          <FAQ />
          <CTA />
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;