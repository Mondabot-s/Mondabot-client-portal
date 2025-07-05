'use client';

import { usePathname } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import Sidebar from './Sidebar.jsx';

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Check if Clerk is available
  const isClerkAvailable = typeof window !== 'undefined' && 
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  
  // Only use Clerk hook if available
  const clerkAuth = isClerkAvailable ? useAuth() : { isSignedIn: true, isLoaded: true };
  const { isSignedIn, isLoaded } = clerkAuth;
  
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

  // Wait for auth to load
  if (!isLoaded) {
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

  // If not signed in and Clerk is available, the middleware will handle the redirect
  // This component only renders for authenticated users on protected routes
  if (isClerkAvailable && !isSignedIn) {
    return null;
  }
  
  // Default layout with sidebar for authenticated users
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