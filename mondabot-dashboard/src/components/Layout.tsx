'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import Sidebar from './Sidebar.jsx';

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  
  // Check if authentication is enabled and Clerk is configured
  const isAuthEnabled = process.env.NEXT_PUBLIC_ENABLE_AUTHENTICATION === 'true';
  const isClerkConfigured = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  
  // Always call useAuth hook to comply with React hooks rules
  let authResult;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    authResult = useAuth();
  } catch (error) {
    // If Clerk hooks fail (e.g., during build), use default values
    console.warn('Clerk hooks not available:', error);
    authResult = { isSignedIn: false, isLoaded: true };
  }
  
  // Only use auth results if authentication is enabled and Clerk is configured
  const isSignedIn = (isAuthEnabled && isClerkConfigured) ? (authResult.isSignedIn ?? false) : false;
  const isLoaded = (isAuthEnabled && isClerkConfigured) ? (authResult.isLoaded ?? true) : true;
  
  // Set mounted state after component mounts
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Handle authentication redirect - moved outside conditional to comply with hooks rules
  useEffect(() => {
    if (mounted && isAuthEnabled && isClerkConfigured && isLoaded && !isSignedIn) {
      // Check if current page is login, signup, or email verification
      const isAuthPage = pathname === '/login' || pathname === '/signup' || pathname.includes('/verify-email') || pathname.includes('/factor-one');
      if (!isAuthPage) {
        router.push('/login');
      }
    }
  }, [mounted, isAuthEnabled, isClerkConfigured, isLoaded, isSignedIn, pathname, router]);
  
  // Check if current page is login, signup, or email verification
  const isAuthPage = pathname === '/login' || pathname === '/signup' || pathname.includes('/verify-email') || pathname.includes('/factor-one');
  
  // If auth page, render without sidebar
  if (isAuthPage) {
    return (
      <div className="h-screen">
        {children}
      </div>
    );
  }

  // Show loading until component is mounted
  if (!mounted) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl mb-4 shadow-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#d90077]"></div>
          </div>
          <p className="text-gray-600 font-medium">Loading Mondabot...</p>
        </div>
      </div>
    );
  }

  // If authentication is enabled and Clerk is configured, check auth status
  if (isAuthEnabled && isClerkConfigured) {
    // Show loading while auth is being checked
    if (!isLoaded) {
      return (
        <div className="h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl mb-4 shadow-lg">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#d90077]"></div>
            </div>
            <p className="text-gray-600 font-medium">Checking authentication...</p>
          </div>
        </div>
      );
    }
    
    // If not signed in, show loading while redirect happens
    if (!isSignedIn) {
      return (
        <div className="h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl mb-4 shadow-lg">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#d90077]"></div>
            </div>
            <p className="text-gray-600 font-medium">Redirecting to login...</p>
          </div>
        </div>
      );
    }
  }
  
  // Default layout with sidebar (works with or without authentication)
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar Component */}
      <Sidebar />
      
      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="mx-auto max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
} 