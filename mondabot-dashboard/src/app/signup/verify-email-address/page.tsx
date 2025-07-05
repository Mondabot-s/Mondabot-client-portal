'use client';

import { useSignUp } from '@clerk/nextjs';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface ClerkError {
  message: string;
  longMessage?: string;
  code?: string;
}

interface ErrorWithClerkErrors {
  errors?: ClerkError[];
}

export default function VerifyEmailPage() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [code, setCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    setIsVerifying(true);
    setError('');

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId });
        router.push('/');
      } else {
        console.error('Sign up not complete:', completeSignUp);
        setError('Verification failed. Please try again.');
      }
    } catch (err: unknown) {
      console.error('Error:', err);
      const clerkError = err as ErrorWithClerkErrors;
      setError(clerkError.errors?.[0]?.message || 'Invalid verification code. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    if (!isLoaded) return;

    try {
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setError('');
      // You could add a success message here
    } catch (err: unknown) {
      console.error('Error resending code:', err);
      setError('Failed to resend code. Please try again.');
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#d90077] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#170F3A] via-[#170E3B] to-[#170F3A] flex-col justify-center items-center p-12 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-32 right-16 w-48 h-48 bg-[#d90077] rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>
        
        {/* Main content */}
        <div className="relative z-10 text-center max-w-md">
          <div className="inline-flex items-center justify-center w-30 h-30 bg-white rounded-3xl mb-8 shadow-2xl overflow-hidden">
            <Image
              src="/icon-light.svg"
              alt="Mondabot Logo"
              width={120}
              height={120}
              className="w-30 h-30"
            />
          </div>
          
          <h1 className="text-5xl font-bold text-white mb-6 tracking-tight">
            Mondabot<span className="text-[#d90077]">.</span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-12 leading-relaxed">
            We&apos;ve sent a verification code to your email address. 
            Please check your inbox and enter the code below.
          </p>
        </div>
      </div>

      {/* Right Side - Verification Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-white">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl mb-6 shadow-lg lg:hidden overflow-hidden">
              <Image
                src="/icon-light.svg"
                alt="Mondabot Logo"
                width={80}
                height={80}
                className="w-20 h-20"
              />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Verify Your Email
            </h2>
            <p className="text-gray-600">
              Enter the 6-digit code we sent to your email address
            </p>
          </div>

          {/* Verification Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                Verification Code
              </label>
              <input
                type="text"
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter 6-digit code"
                className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d90077] focus:border-transparent transition-all duration-200 hover:border-gray-400 bg-white text-center text-lg font-mono tracking-widest"
                maxLength={6}
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isVerifying || code.length !== 6}
              className="w-full group relative flex items-center justify-center py-3 px-4 border border-transparent rounded-xl text-white font-medium bg-gradient-to-r from-[#d90077] to-[#ff1493] hover:from-[#b80062] hover:to-[#e91e63] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#d90077] transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isVerifying ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Verifying...
                </>
              ) : (
                'Verify Email'
              )}
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Didn&apos;t receive the code?{' '}
                <button
                  type="button"
                  onClick={handleResendCode}
                  className="text-[#d90077] hover:text-[#b80062] font-medium transition-colors hover:underline"
                >
                  Resend Code
                </button>
              </p>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <div className="flex items-center justify-center text-gray-500 text-sm mb-4">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Your data is protected with enterprise-grade security
            </div>
            <p className="text-gray-500 text-sm">
              Need assistance?{' '}
              <a href="#" className="text-[#d90077] hover:text-[#b80062] font-medium transition-colors hover:underline">
                Contact Support
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 