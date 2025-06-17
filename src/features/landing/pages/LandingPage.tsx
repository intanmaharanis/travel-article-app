import HeroSection from "../components/HeroSection";
import CategorySection from "../components/CategorySection";
import DestinationSection from "../components/DestinationSection";
import { useAuth } from "../../../hooks/useAuth";


export default function LandingPage() {
  const {isAuthenticated} = useAuth();
  return (
    <div className="min-h-screen">
      <HeroSection/>

      <CategorySection isAuthenticated={isAuthenticated}/>  

      <DestinationSection isAuthenticated={isAuthenticated}/>
    
    </div>
  );
} 