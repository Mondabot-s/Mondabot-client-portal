"use client";

import { useUser } from '@clerk/nextjs';

export default function HomePage() {
    // Always call the hook - React hooks must be called unconditionally
    const { user, isLoaded } = useUser();
    
    // Check if Clerk is available
    const isClerkAvailable = typeof window !== 'undefined' && 
        process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

    // Show loading state while user data is being fetched (only if Clerk is available)
    if (!isLoaded && isClerkAvailable) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl mb-4 shadow-lg">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#d90077]"></div>
                    </div>
                    <p className="text-gray-600 font-medium">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    // Get the user's first name, or default to 'there'
    const firstName = (isClerkAvailable && user?.firstName) || 'there';

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4 animate-slide-up">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Welcome back, {firstName}</h1>
                    <p className="text-gray-600 mt-1">Here&apos;s your automation empire at a glance</p>
                </div>
                <div className="flex items-center space-x-3 w-full sm:w-auto">
                    <button className="p-2.5 rounded-lg hover:bg-gray-100 transition relative">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-gray-600">
                            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
                            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
                        </svg>
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse border-2 border-white"></span>
                    </button>
                    <button className="flex items-center space-x-2 px-4 py-2.5 rounded-lg text-white font-semibold transition bg-purple-700 hover:bg-purple-800 shadow-md hover:shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                            <line x1="12" y1="5" x2="12" y2="19"/>
                            <line x1="5" y1="12" x2="19" y2="12"/>
                        </svg>
                        <span>Create New</span>
                    </button>
                </div>
            </header>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Active Automations */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Active Automations</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">12</p>
                            <div className="flex items-center mt-2">
                                <svg className="w-4 h-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
                                </svg>
                                <span className="text-sm font-medium text-green-600">+33.3%</span>
                                <span className="text-sm text-gray-500 ml-1">from last month</span>
                            </div>
                        </div>
                        <div className="p-3 bg-purple-100 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-purple-600">
                                <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Tasks Completed */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Tasks Completed</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">156</p>
                            <div className="flex items-center mt-2">
                                <svg className="w-4 h-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
                                </svg>
                                <span className="text-sm font-medium text-green-600">+12%</span>
                                <span className="text-sm text-gray-500 ml-1">this week</span>
                            </div>
                        </div>
                        <div className="p-3 bg-green-100 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-green-600">
                                <polyline points="9 11 12 14 22 4"/>
                                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Time Saved */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Time Saved</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">48h</p>
                            <div className="flex items-center mt-2">
                                <span className="text-sm text-gray-500">This month</span>
                            </div>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-blue-600">
                                <circle cx="12" cy="12" r="10"/>
                                <polyline points="12 6 12 12 16 14"/>
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Active Integrations */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Active Integrations</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">8</p>
                            <div className="flex items-center mt-2">
                                <span className="text-sm text-gray-500">All systems operational</span>
                            </div>
                        </div>
                        <div className="p-3 bg-orange-100 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-orange-600">
                                <path d="M9 3L5 7m4 10l4 4"/>
                                <path d="M5 17l4-4"/>
                                <path d="M9 21l4-4"/>
                                <path d="M15 3l4 4"/>
                                <path d="M19 7l-4 4"/>
                                <path d="M15 21l-4-4"/>
                                <path d="M19 17l-4-4"/>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Dashboard Content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Dashboard Overview</h2>
                <p className="text-gray-600">Welcome to your Mondabot Dashboard. Your automation empire is running smoothly!</p>
            </div>
        </div>
    );
} 