'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@nextui-org/input';
import Link from 'next/link';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'sonner';
import React from 'react';
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5';
import GoogleButton from '../registerForm/googleButton';
import LoginRightContent from './loginRightContent';
import { loginSchema } from '@/src/schema/auth';
import CButton from '@/src/components/ui/CButton/CButton';
import { secondaryColor } from '@/src/styles/button';
import { useLoginMutation } from '@/src/redux/features/auth/authApi';
import { useAppDispatch } from '@/src/redux/hook';
import { setCredentials } from '@/src/redux/features/auth/authSlice';
import GlassLoader from '@/src/components/shared/glassLoader';
import Cookies from 'js-cookie';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';
import { useRouter, useSearchParams } from 'next/navigation';

type LoginFormInputs = z.infer<typeof loginSchema>;
interface TDecodedData {
  id: string;
  email: string;
  role: string;
}

export default function LoginForm() {
  const [isVisible, setIsVisible] = React.useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);
  const [loginUser, { isLoading: LoginIsLoading, isSuccess }] =
    useLoginMutation();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const res = await loginUser(data);

      if (res?.data?.success && res?.data?.data?.accessToken) {
        const decodedUser = jwtDecode(
          res.data.data.accessToken
        ) as TDecodedData;

        const userData = {
          id: decodedUser.id,
          email: decodedUser.email,
          role: decodedUser.role,
        };

        // Dispatch credentials to Redux
        dispatch(
          setCredentials({ user: userData, token: res.data.data.accessToken })
        );
        // Set token in cookies
        Cookies.set('accessToken', res?.data?.data?.accessToken);

        router.push(redirect ? redirect : '/news-feed/posts');
        // Show success toast
        toast.success('Login successful');

        reset();
      }
      const error = res?.error;

      if (error) {
        if ('data' in (error as FetchBaseQueryError)) {
          const fetchError = error as FetchBaseQueryError;
          const errorMessage = (fetchError.data as { message?: string })
            ?.message;

          toast.error(errorMessage || 'An unknown error occurred');
        } else if ((error as SerializedError).message) {
          toast.error((error as SerializedError).message!);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full md:min-h-screen flex items-center justify-center max-w-7xl">
      {LoginIsLoading && !isSuccess && <GlassLoader />}
      <div className="flex flex-col-reverse md:flex-row bg-default-100 rounded-lg w-full overflow-hidden my-5">
        {/* Left side - Form Section */}
        <div className="w-full md:w-[500px] xl:w-[530px] flex flex-col justify-center">
          <div className="flex flex-col gap-6 p-2 md:p-16">
            <h2 className="text-2xl font-bold text-center">
              Log in to your account
            </h2>
            <p className="text-center text-default-500">
              Welcome back! Please login to continue.
            </p>
            {/* <div className="flex items-center justify-center flex-col md:flex-row gap-5">
              <GoogleButton />
            </div> */}

            {/* Login Form */}
            <form
              className="w-full flex flex-col gap-4"
              onSubmit={handleSubmit(onSubmit)}
            >
              {/* Email Input */}
              <div className="h-16">
                <Input
                  {...register('email')}
                  className="font-semibold"
                  isInvalid={!!errors.email}
                  label="Email address"
                  placeholder="you@domain.com"
                  type="email"
                  validationState={errors.email ? 'invalid' : undefined}
                  variant="underlined"
                />
                {errors.email && (
                  <p className="text-danger-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Input */}
              <div className="h-16">
                <Input
                  {...register('password')}
                  className="font-semibold"
                  endContent={
                    <button
                      aria-label="toggle password visibility"
                      className="focus:outline-none"
                      type="button"
                      onClick={toggleVisibility}
                    >
                      {isVisible ? (
                        <IoEyeOffOutline className="text-2xl text-default-400 pointer-events-none" />
                      ) : (
                        <IoEyeOutline className="text-2xl text-default-400 pointer-events-none" />
                      )}
                    </button>
                  }
                  isInvalid={!!errors.password}
                  label="Password"
                  placeholder="Must be at least 6 characters"
                  type={isVisible ? 'text' : 'password'}
                  validationState={errors.password ? 'invalid' : undefined}
                  variant="underlined"
                />
                {errors.password && (
                  <p className="text-danger-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <div className="flex my-1 items-center justify-end text-xs relative">
                <Link
                  className="text-blue-500 hover:underline"
                  href={'/forgot-password'}
                >
                  Forgot password
                </Link>
              </div>
              <div className="w-full mt-5">
                <CButton bgColor={secondaryColor} text="Login" type="submit" />
              </div>
            </form>

            <p className="text-center text-default-500 text-xs relative">
              New here?{' '}
              <Link className="text-blue-500 text-xs" href="/register">
                Create an account
              </Link>
            </p>
          </div>
        </div>

        {/* Right side - Info Section */}
        <LoginRightContent />
      </div>
    </div>
  );
}
