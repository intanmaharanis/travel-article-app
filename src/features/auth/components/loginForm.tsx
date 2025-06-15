import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../../../lib/zodSchemas';
import { useAuth } from '../../../hooks/useAuth';
import { Eye, EyeOff, Loader2Icon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Alert, AlertDescription } from '../../../components/ui/alert';

export type LoginSchema = {
  identifier: string;
  password: string;
};

const LoginForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });
  const { login, loading, error: authError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);

  const onSubmit = async (data: LoginSchema) => {
    setFormError(null);
    const success = await login(data);
    if (success) {
      reset();
      navigate('/');
    } else {
      setFormError(authError);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md mx-auto p-4  rounded">
      <h2 className="text-xl font-bold mb-2">Login</h2>
      {formError && (
        <Alert variant="destructive">
          <AlertDescription>{formError}</AlertDescription>
        </Alert>
      )}
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
      <Button type="submit" disabled={isSubmitting || loading} className="w-full">
        {(isSubmitting || loading) ? <><Loader2Icon className="animate-spin mr-2" /> Please wait</> : 'Login'}
      </Button>
    </form>
  );
};

export default LoginForm;