import RegisterForm from "../components/registerForm";
import { Link } from "react-router-dom";

export default function RegisterPage() {
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
      <div className="relative z-20 w-full mx-4 md:max-w-md md:w-6/12 bg-white/80 backdrop-blur-md px-4 py-8 lg:p-8 rounded-2xl shadow-2xl">
        <h2 className="text-3xl font-bold text-center mb-6 text-[#4158D0] drop-shadow">Buat Akun Baru</h2>
        <p className="text-center text-gray-700 mb-8">Daftar untuk mulai menjelajah artikel travel!</p>
        <RegisterForm />
        <div className="mt-6 text-center text-sm text-gray-600">
          Sudah punya akun?{' '}
          <Link to="/login" className="text-[#C850C0] font-semibold hover:underline">Login di sini</Link>
        </div>
      </div>
    </div>
  );
} 