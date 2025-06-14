import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../../../lib/zodSchemas';
import { useAuth } from '../../../hooks/useAuth';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Komponen UI dasar, ganti dengan komponen UI project jika ada
const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => <input {...props} className="border border-gray-500 rounded px-2 py-1 w-full mt-1" />;
const Button = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => <button {...props} className="bg-blue-600 text-white px-4 py-2 rounded w-full disabled:opacity-50" />;
const Spinner = () => <div className="flex justify-center"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div></div>;

export type LoginSchema = {
  identifier: string;
  password: string;
};

const LoginForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });
  const { login, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data: LoginSchema) => {
    await login(data);
    reset();
    navigate('/');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md mx-auto p-4  rounded">
      <h2 className="text-xl font-bold mb-2">Login</h2>
      <div>
        <label htmlFor="identifier">Email</label>
        <Input id="identifier" type="email" {...register('identifier')} />
        {errors.identifier && <p className="text-red-500 text-sm">{errors.identifier.message}</p>}
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <div className="relative">
          <Input id="password" type={showPassword ? 'text' : 'password'} {...register('password')} />
          <button type="button" tabIndex={-1} className="absolute right-2 top-2 text-gray-500" onClick={() => setShowPassword(v => !v)}>
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
      </div>
      <Button type="submit" disabled={isSubmitting || loading}>
        {(isSubmitting || loading) ? <Spinner /> : 'Login'}
      </Button>
    </form>
  );
};

export default LoginForm;