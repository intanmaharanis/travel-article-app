import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '../../../lib/zodSchemas';
import { useAuth } from '../../../hooks/useAuth';
import { Eye, EyeOff, Loader2Icon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Alert, AlertDescription } from '../../../components/ui/alert';

export type RegisterSchema = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const RegisterForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  });
  const { register: authRegister, loading, error: authError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);

  const onSubmit = async (data: RegisterSchema) => {
    setFormError(null);
    const { username, email, password } = data;
    const success = await authRegister({ username, email, password });
    if (success) {
      reset();
      navigate('/');
    } else {
      setFormError(authError);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md mx-auto p-4 border rounded">
      <h2 className="text-xl font-bold mb-2">Register</h2>
      {formError && (
        <Alert variant="destructive">
          <AlertDescription>{formError}</AlertDescription>
        </Alert>
      )}
      <div>
        <label htmlFor="username">Username</label>
        <Input id="username" type="text" {...register('username')} />
        {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <Input id="email" type="email" {...register('email')} />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
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
      <div>
        <label htmlFor="confirmPassword">Konfirmasi Password</label>
        <div className="relative">
          <Input id="confirmPassword" type={showConfirm ? 'text' : 'password'} {...register('confirmPassword')} />
          <button type="button" tabIndex={-1} className="absolute right-2 top-2 text-gray-500" onClick={() => setShowConfirm(v => !v)}>
            {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
      </div>
      <Button type="submit" disabled={isSubmitting || loading} className="w-full">
        {(isSubmitting || loading) ? <><Loader2Icon className="animate-spin mr-2" /> Please wait</> : 'Register'}
      </Button>
    </form>
  );
};

export default RegisterForm; 