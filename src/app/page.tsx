"use client";

import React from 'react';
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

    // Get the user's first name, or default to 'Sergio'
    const firstName = (isClerkAvailable && user?.firstName) || 'Sergio';

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Welcome Message at Top */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {firstName}</h1>
                <p className="text-gray-600">Here's your automation empire at a glance</p>
            </div>

            {/* Header with Search and Actions */}
            <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto ml-auto">
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
                    <button className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white font-semibold transition bg-[#8b5cf6] hover:bg-[#7c3aed]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                            <line x1="12" y1="5" x2="12" y2="19"/>
                            <line x1="5" y1="12" x2="19" y2="12"/>
                        </svg>
                        <span className="hidden sm:inline">Create New</span>
                    </button>
                </div>
            </header>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {/* Active Automations */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-3xl font-bold text-gray-900">12</p>
                            <p className="text-sm text-gray-600">Active Automations</p>
                            <p className="text-xs text-green-600 mt-1">↗ +33.3% from last month</p>
                        </div>
                        <div className="p-3 rounded-full bg-purple-100">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-purple-600">
                                <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Tasks Completed */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-3xl font-bold text-gray-900">156</p>
                            <p className="text-sm text-gray-600">Tasks Completed</p>
                            <p className="text-xs text-green-600 mt-1">↗ +12% this week</p>
                        </div>
                        <div className="p-3 rounded-full bg-green-100">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-green-600">
                                <polyline points="9 11 12 14 22 4"/>
                                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Time Saved */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-3xl font-bold text-gray-900">48h</p>
                            <p className="text-sm text-gray-600">Time Saved</p>
                            <p className="text-xs text-gray-500 mt-1">This month</p>
                        </div>
                        <div className="p-3 rounded-full bg-blue-100">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-blue-600">
                                <circle cx="12" cy="12" r="10"/>
                                <polyline points="12 6 12 12 16 14"/>
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Active Integrations */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-3xl font-bold text-gray-900">8</p>
                            <p className="text-sm text-gray-600">Active Integrations</p>
                            <p className="text-xs text-gray-500 mt-1">All systems operational</p>
                        </div>
                        <div className="p-3 rounded-full bg-orange-100">
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

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Video */}
                <div className="lg:col-span-2">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h2 className="text-xl font-bold mb-1 text-gray-900">Your Automation Journey</h2>
                        <p className="mb-4 text-gray-600">Watch how we're transforming your business processes with AI-powered automation</p>
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
                </div>

                {/* Right Column - Sidebar Content */}
                <div className="space-y-6">
                    {/* Your Strategic Partner */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h3 className="font-bold text-lg mb-4 text-gray-900">Your Strategic Partner</h3>
                        <div className="flex items-center space-x-4">
                            <div className="relative w-16 h-16">
                                <Image 
                                    src="/Sergio_Bernal.jpg" 
                                    alt="Sergio Bernal" 
                                    fill
                                    className="rounded-full object-cover"
                                />
                                {/* Green Online Indicator */}
                                <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                            </div>
                            <div>
                                <p className="font-semibold text-base text-gray-900">Sergio Bernal</p>
                                <p className="text-sm text-gray-600">CEO & Lead Strategist</p>
                                <div className="flex items-center text-xs text-gray-500 mt-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 mr-1">
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                                    </svg>
                                    sergio@mondabot.com
                                </div>
                                <div className="flex items-center text-xs text-gray-500 mt-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 mr-1">
                                        <circle cx="12" cy="12" r="10"/>
                                        <polyline points="12 6 12 12 16 14"/>
                                    </svg>
                                    Available Mon-Fri, 9am-6pm CET
                                </div>
                            </div>
                        </div>
                        <button className="w-full mt-4 py-2 rounded-lg text-white font-semibold transition hover:opacity-90 bg-[#8b5cf6]">
                            Schedule Strategy Call
                        </button>
                    </div>

                    {/* Next Major Milestone - Violet Section */}
                    <div className="bg-[#8b5cf6] p-6 rounded-xl shadow-sm text-white">
                        <h3 className="font-bold text-lg mb-4 flex items-center">
                            <span>Next Major Milestone</span>
                            <div className="ml-auto flex items-center space-x-2">
                                <span className="text-xs bg-green-500 px-2 py-1 rounded-full">Backend ✓</span>
                                <span className="text-xs bg-green-500 px-2 py-1 rounded-full">Port ✓ 3000</span>
                            </div>
                        </h3>
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="p-3 rounded-full bg-white/20">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-white">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                                </svg>
                            </div>
                            <div>
                                <p className="font-semibold text-lg">WhatsApp Bot Launch</p>
                                <p className="text-sm opacity-90">Automated Customer Support</p>
                            </div>
                        </div>
                        <div className="mb-4">
                            <div className="flex justify-between text-sm mb-2">
                                <span>Progress</span>
                                <span>85%</span>
                            </div>
                            <div className="w-full bg-white/20 rounded-full h-2">
                                <div className="bg-white h-2 rounded-full transition-all duration-300" style={{ width: '85%' }}></div>
                            </div>
                        </div>
                        <p className="text-sm opacity-90 mb-4">Launches in 3 days</p>
                        <p className="text-xs opacity-75">High Priority</p>
                    </div>
                </div>
            </div>
        </div>
    );
} 