"use client";

import { useUser } from '@clerk/nextjs';
import Image from 'next/image';

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
            <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                <h1 className="text-3xl font-bold text-gray-900">Project Command Center</h1>
                <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto">
                    <div className="relative flex-grow sm:flex-grow-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400">
                            <circle cx="11" cy="11" r="8"/>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                        </svg>
                        <input 
                            type="text" 
                            placeholder="Search..." 
                            className="pl-10 pr-4 py-2 rounded-lg border w-full sm:w-64 focus:ring-2 focus:ring-[#d90077] focus:border-[#d90077] outline-none transition border-gray-300"
                        />
                    </div>
                    <button className="p-2 rounded-lg hover:bg-gray-100 transition relative">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-gray-600">
                            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
                            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
                        </svg>
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse border-2 border-white"></span>
                    </button>
                    <button className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white font-semibold transition bg-[#d90077] hover:bg-[#b80062]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                            <line x1="12" y1="5" x2="12" y2="19"/>
                            <line x1="5" y1="12" x2="19" y2="12"/>
                        </svg>
                        <span className="hidden sm:inline">New Task</span>
                    </button>
                </div>
            </header>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Welcome Section */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h2 className="text-2xl font-bold mb-1 text-gray-900">Welcome, {firstName}!</h2>
                        <p className="mb-4 text-gray-600">Here's a quick overview of your active projects. Let's make some progress today.</p>
                        <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                            <iframe 
                                src="https://player.vimeo.com/video/1068762817?h=1234567890abcdef&title=0&byline=0&portrait=0"
                                className="w-full h-full"
                                frameBorder="0"
                                allow="autoplay; fullscreen; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    </div>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Active Automations */}
                        <div className="bg-white p-4 rounded-xl shadow-sm flex items-center space-x-4 border border-gray-200">
                            <div className="p-3 rounded-full bg-[#d90077]/10">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-[#d90077]">
                                    <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>
                                </svg>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">4</p>
                                <p className="text-sm text-gray-600">Active Automations</p>
                            </div>
                        </div>

                        {/* Tasks Completed */}
                        <div className="bg-white p-4 rounded-xl shadow-sm flex items-center space-x-4 border border-gray-200">
                            <div className="p-3 rounded-full bg-[#d90077]/10">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-[#d90077]">
                                    <polyline points="9 11 12 14 22 4"/>
                                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                                </svg>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">12</p>
                                <p className="text-sm text-gray-600">Tasks Completed</p>
                            </div>
                        </div>

                        {/* Active Integrations */}
                        <div className="bg-white p-4 rounded-xl shadow-sm flex items-center space-x-4 border border-gray-200">
                            <div className="p-3 rounded-full bg-[#d90077]/10">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-[#d90077]">
                                    <path d="M9 3L5 7m4 10l4 4"/>
                                    <path d="M5 17l4-4"/>
                                    <path d="M9 21l4-4"/>
                                    <path d="M15 3l4 4"/>
                                    <path d="M19 7l-4 4"/>
                                    <path d="M15 21l-4-4"/>
                                    <path d="M19 17l-4-4"/>
                                </svg>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">8</p>
                                <p className="text-sm text-gray-600">Active Integrations</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Sidebar Content */}
                <div className="space-y-8">
                    {/* Your Dedicated Project Lead */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h3 className="font-bold text-lg mb-4 text-gray-900">Your Dedicated Project Lead</h3>
                        <div className="flex items-center space-x-4">
                            <div className="relative w-16 h-16">
                                <Image 
                                    src="/Sergio_Bernal.jpg" 
                                    alt="Sergio Bernal" 
                                    fill
                                    className="rounded-full object-cover"
                                />
                            </div>
                            <div>
                                <p className="font-semibold text-base text-gray-900">Sergio Bernal</p>
                                <p className="text-sm text-gray-600">CEO & Lead Strategist</p>
                            </div>
                        </div>
                        <button className="w-full mt-4 py-2 rounded-lg text-white font-semibold transition hover:opacity-90 bg-[#d90077]">
                            Schedule a Call
                        </button>
                    </div>

                    {/* Pending Review Alert */}
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                        <div className="flex">
                            <div className="py-1">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-yellow-500 mr-4">
                                    <path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
                                    <path d="M12 9v4"/>
                                    <path d="M12 17h.01"/>
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-bold text-yellow-800">Pending Your Review</h3>
                                <p className="text-sm text-yellow-700 mt-1">
                                    Feedback is required on the WhatsApp Bot conversation flows before we can proceed to launch.
                                </p>
                                <button className="mt-2 px-3 py-1 text-sm font-semibold bg-yellow-400 text-yellow-900 rounded-md hover:bg-yellow-500">
                                    Provide Feedback
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Upcoming Milestone */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h3 className="font-bold text-lg mb-4 text-gray-900">Upcoming Milestone</h3>
                        <div className="flex items-center space-x-4">
                            <div className="p-3 rounded-full bg-gray-100">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-gray-600">
                                    <circle cx="12" cy="12" r="10"/>
                                    <circle cx="12" cy="12" r="6"/>
                                    <circle cx="12" cy="12" r="2"/>
                                </svg>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">Launch WhatsApp Support Bot</p>
                                <p className="text-sm text-gray-600">Due in 3 days</p>
                            </div>
                        </div>
                        <p className="text-sm mt-3 text-gray-600">
                            Automated customer support with AI-powered responses.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
} 