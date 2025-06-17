import AppRoutes from "./routes";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Toaster } from 'sonner';
import { useLocation } from 'react-router-dom';
import { useAuth } from "./hooks/useAuth";
import { useEffect, Suspense } from "react";
import LoadingSpinner from "./components/LoadingSpinner";

function App() {
  const location = useLocation();

  const { initializeAuth } = useAuth();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);
  
  
  const hideNavbar = location.pathname === '/login' || location.pathname === '/register';

  return (
    <Suspense fallback={<LoadingSpinner />}>
      {!hideNavbar && <Navbar />}
      <AppRoutes />
      {!hideNavbar && <Footer />}
      <Toaster richColors position="top-center" />
    </Suspense>
  );
}

export default App;
