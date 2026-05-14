import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CategoriesSection from "@/components/CategoriesSection";
import FeaturedBusinesses from "@/components/FeaturedBusinesses";
import HowItWorks from "@/components/HowItWorks";
import PackagesSection from "@/components/PackagesSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    // Handle both initial load and navigation with hash
    const scrollToHash = () => {
      if (location.hash) {
        const element = document.getElementById(location.hash.substring(1));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    };

    // Small delay to ensure the page has rendered
    const timer = setTimeout(scrollToHash, 100);
    return () => clearTimeout(timer);
  }, [location]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <CategoriesSection />
      <FeaturedBusinesses />
      <HowItWorks />
      <PackagesSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
