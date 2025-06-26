import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../schemas/loginSchema';
import type { LoginFormInputs } from '../schemas/loginSchema';
import { checkAuth, signIn } from '../api/Api';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import toast from 'react-hot-toast';

const Login: React.FC = () => {
  const setUser = useAuthStore.getState().setUser;

  const [error, setError] = useState('');
   const {
    register,
    handleSubmit, 
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });
  const navigate = useNavigate();

   useEffect(() => {
    const verifyUser = async () => {
      const user = await checkAuth();
      if (user) {
        navigate('/'); 
      }
    };
    verifyUser();
  }, [navigate]);

   const onSubmit = async(data: LoginFormInputs) => {
    setError('');
     try {
      const result = await signIn(data)
      if (result?.user) {
        setUser(result.user);
        toast.success('Login successful!');
        console.log('User:', result.user);
        navigate('/');
      }
     } catch (err) {
      console.log("Login error response:", err);
      const errorMsg = err instanceof Error ? err.message : 'Login failed';
      setError(errorMsg);
     }
   };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 px-4">
      <div className="w-full max-w-md p-8 rounded-2xl bg-white/10 backdrop-blur-md shadow-2xl border border-white/20">
        <h2 className="text-3xl font-semibold text-white text-center mb-6 tracking-wide">Sign In</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email */}
          <div className="relative">
            <input
              type="email"
              id="email"
              {...register('email')}
              className={`peer w-full px-4 pt-6 pb-2 text-white bg-transparent border ${
                errors.email ? 'border-red-500' : 'border-white/30'
              } rounded-xl placeholder-transparent focus:outline-none focus:ring-2 ${
                errors.email ? 'focus:ring-red-500' : 'focus:ring-cyan-500'
              }`}
              placeholder="Email"
            />
            <label
                htmlFor="email"
              className={`absolute left-4 top-2 text-sm transition-all ${
                errors.email ? 'text-red-400' : 'text-white/70'
              } peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-white/50 peer-focus:top-2 peer-focus:text-sm peer-focus:text-cyan-400`}
            >
              Email
            </label>
             {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type="password"
              id="password"
               {...register('password')}
              className={`peer w-full px-4 pt-6 pb-2 text-white bg-transparent border ${
                errors.password ? 'border-red-500' : 'border-white/30'
              } rounded-xl placeholder-transparent focus:outline-none focus:ring-2 ${
                errors.password ? 'focus:ring-red-500' : 'focus:ring-cyan-500'
              }`}
              placeholder="Password"
            />
            <label
              htmlFor="password"
               className={`absolute left-4 top-2 text-sm transition-all ${
                errors.password ? 'text-red-400' : 'text-white/70'
              } peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-white/50 peer-focus:top-2 peer-focus:text-sm peer-focus:text-cyan-400`}
            >
              Password
            </label>
             {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>}
          </div>
         {error && <p className="mt-4 text-sm text-red-400 text-center">{error}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-cyan-500 hover:bg-cyan-600 transition duration-300 rounded-xl text-white font-semibold text-lg shadow-lg shadow-cyan-500/30"
          >
            Log In
          </button>
        </form>
        {/* Optional links */}
        <div className="mt-6 text-sm text-center text-white/70">
          Don't have an account?{' '}
          <a href="/signup" className="text-cyan-400 hover:underline">
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
