'use client';

import { usePathname } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import Sidebar from './Sidebar.jsx';

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  
  // Always call useAuth since ClerkProvider is always available
  const { isSignedIn, isLoaded } = useAuth();
  
  // Check if authentication is enabled (using NEXT_PUBLIC_ prefix)
  const isAuthEnabled = process.env.NEXT_PUBLIC_ENABLE_AUTHENTICATION === 'true';
  
  // Set mounted state after component mounts
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Check if current page is login, signup, or email verification
  const isAuthPage = pathname === '/login' || pathname === '/signup' || pathname.includes('/verify-email');
  
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

  // If authentication is enabled, check auth status
  if (isAuthEnabled) {
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
    
    // If not signed in, the middleware will handle the redirect
    if (!isSignedIn) {
      return null;
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