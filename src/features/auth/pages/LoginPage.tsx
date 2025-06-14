import LoginForm from "../components/loginForm";
import { Link } from "react-router-dom";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center min-w-full relative">
      {/* Background image gunung */}
      <img
        src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1500&q=80"
        alt="Gunung"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      {/* Overlay gelap agar form tetap kontras */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/50 to-transparent z-10" />
      <div className="relative z-20 w-full max-w-md md:w-6/12 bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/40">
        <h2 className="text-3xl font-bold text-center mb-6 text-[#4158D0] drop-shadow">Welcome Back!</h2>
        <p className="text-center text-gray-700 mb-8">Sign in to your Travel Article App account</p>
        <LoginForm />
        <div className="mt-6 text-center text-sm text-gray-600">
          Belum punya akun?{' '}
          <Link to="/register" className="text-[#C850C0] font-semibold hover:underline">Daftar sekarang</Link>
        </div>
      </div>
    </div>
  );
} 