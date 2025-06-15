import HeroSection from "../components/HeroSection";
import CategorySection from "../components/CategorySection";
import DestinationSection from "../components/DestinationSection";


export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <HeroSection/>

      <CategorySection/>  

      <DestinationSection />
    
    </div>
  );
} 