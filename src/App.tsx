import AppRoutes from "./routes";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Toaster } from 'sonner';
import { useLocation } from 'react-router-dom';
import { useEffect } from "react";
import { useAuth } from "./hooks/useAuth";

function App() {
  const location = useLocation();
  const { initializeAuth } = useAuth();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const hideNavbar = location.pathname === '/login' || location.pathname === '/register';

  return (
    <>
      {!hideNavbar && <Navbar />}
      <AppRoutes />
      {!hideNavbar && <Footer />}
      <Toaster richColors position="top-center" />
    </>
  );
}

export default App;
