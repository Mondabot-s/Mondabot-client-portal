'use client';

import { SignIn } from '@clerk/nextjs';
import Image from 'next/image';

export default function LoginPage() {
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
            Automate, optimize, and scale your business with AI-powered intelligence. 
            Welcome back to your command center.
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
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
              Welcome Back
            </h2>
            <p className="text-gray-600">
              Please sign in to your account to continue
            </p>
          </div>

          {/* Clerk SignIn Component with Custom Styling */}
          <div className="clerk-signin-container">
            <SignIn 
              appearance={{
                elements: {
                  formButtonPrimary: 
                    'w-full group relative flex items-center justify-center py-3 px-4 border border-transparent rounded-xl text-white font-medium bg-gradient-to-r from-[#d90077] to-[#ff1493] hover:from-[#b80062] hover:to-[#e91e63] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#d90077] transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl',
                  formFieldInput: 
                    'w-full pl-4 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d90077] focus:border-transparent transition-all duration-200 hover:border-gray-400 bg-white',
                  formFieldLabel: 
                    'block text-sm font-medium text-gray-700 mb-2',
                  card: 
                    'w-full bg-transparent shadow-none border-none',
                  headerTitle: 
                    'hidden',
                  headerSubtitle: 
                    'hidden',
                  socialButtonsBlockButton: 
                    'w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-xl text-gray-700 font-medium bg-white hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md',
                  dividerLine: 
                    'bg-gray-300',
                  dividerText: 
                    'text-gray-500 text-sm',
                  footerActionLink: 
                    'text-[#d90077] hover:text-[#b80062] font-medium transition-colors hover:underline',
                  identityPreviewEditButton: 
                    'text-[#d90077] hover:text-[#b80062]',
                  formFieldAction: 
                    'text-[#d90077] hover:text-[#b80062] font-medium transition-colors hover:underline',
                  formFieldHintText: 
                    'text-gray-500 text-sm',
                  alertText: 
                    'text-red-600 text-sm',
                  formFieldSuccessText: 
                    'text-green-600 text-sm',
                  formFieldWarningText: 
                    'text-yellow-600 text-sm',
                  formFieldInputShowPasswordButton: 
                    'text-gray-400 hover:text-gray-600 transition-colors',
                  otpCodeFieldInput: 
                    'w-12 h-12 text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d90077] focus:border-transparent transition-all duration-200',
                  formButtonReset: 
                    'w-full py-3 px-4 border border-gray-300 rounded-xl text-gray-700 font-medium bg-white hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md',
                }
              }}
              signUpUrl="/signup"
              afterSignInUrl="/"
              afterSignUpUrl="/"
              redirectUrl="/"
              path="/login"
              routing="path"
            />
          </div>

          {/* Contact Support */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Need assistance?{' '}
              <a
                href="#"
                className="text-[#d90077] hover:text-[#b80062] font-medium transition-colors hover:underline"
              >
                Contact Support
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 