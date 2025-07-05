'use client';

import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar.jsx';

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Check if current page is login
  const isLoginPage = pathname === '/login';
  
  // If login page, render without sidebar
  if (isLoginPage) {
    return (
      <div className="h-screen">
        {children}
      </div>
    );
  }
  
  // Default layout with sidebar for all other pages
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