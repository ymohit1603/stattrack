
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 pt-24">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
