"use client";

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
// import { useProjects } from '../hooks/useProjects';
import { Bell, MessageCircle, Clock, Mail } from 'lucide-react';
import Image from 'next/image';

// Check if authentication is enabled (using NEXT_PUBLIC_ prefix)
const isAuthEnabled = process.env.NEXT_PUBLIC_ENABLE_AUTHENTICATION === 'true';

// A component that uses Clerk hooks
const UserSpecificContent = () => {
    // Check if authentication is enabled and Clerk is configured
    const isClerkConfigured = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
    
    // Always call useUser hook at the top level to comply with React hooks rules
    const userResult = useUser();
    
    // Only use results if authentication is enabled and Clerk is configured
    const user = (isAuthEnabled && isClerkConfigured) ? userResult.user : null;
    const isLoaded = (isAuthEnabled && isClerkConfigured) ? userResult.isLoaded : true;

    // Get user's first name with fallback
    const getUserFirstName = () => {
        if (user?.firstName) {
            return user.firstName;
        }
        return 'Demo User'; // Default fallback name
    };

    if (!isLoaded) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl mb-4 shadow-lg">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6A10AD]"></div>
                    </div>
                    <p className="text-gray-600 font-medium">Loading your dashboard...</p>
                </div>
            </div>
        );
    }
    
    return <HomePageContent userName={getUserFirstName()} />;
}

// The main page content, now receiving user name as a prop
const HomePageContent = ({ userName }: { userName: string }) => {
    const [showNotifications, setShowNotifications] = useState(false);
    
    // Use the projects hook with client filtering (data not used in this component)
    // const { projects, loading: projectsLoading } = useProjects(userName);

    return (
        <>
            {/* Header */}
            <header className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between mb-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Welcome, {userName}</h1>
                </div>
                <div className="flex items-center justify-end mt-4 sm:mt-0">
                    <div className="relative">
                        <button 
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="p-3 rounded-xl hover:bg-gray-100 transition-all duration-200 relative shadow-sm border border-gray-200 bg-white"
                        >
                            <Bell className="w-6 h-6 text-gray-600" />
                            <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                                <span className="text-xs text-white font-bold">3</span>
                            </span>
                        </button>
                        
                        {/* Notification Dropdown */}
                        {showNotifications && (
                            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                                <div className="p-4 border-b border-gray-100">
                                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                                </div>
                                <div className="max-h-96 overflow-y-auto">
                                    <div className="p-3 hover:bg-gray-50 border-b border-gray-100">
                                        <div className="flex items-start space-x-3">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-gray-900">WhatsApp Bot Review Required</p>
                                                <p className="text-xs text-gray-500 mt-1">Your approval is needed for the conversation flow updates</p>
                                                <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-3 hover:bg-gray-50 border-b border-gray-100">
                                        <div className="flex items-start space-x-3">
                                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-gray-900">LinkedIn Campaign Completed</p>
                                                <p className="text-xs text-gray-500 mt-1">Generated 23 new leads this week</p>
                                                <p className="text-xs text-gray-400 mt-1">5 hours ago</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-3 hover:bg-gray-50">
                                        <div className="flex items-start space-x-3">
                                            <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-gray-900">System Maintenance Scheduled</p>
                                                <p className="text-xs text-gray-500 mt-1">Brief maintenance window planned for tomorrow 2-3 AM</p>
                                                <p className="text-xs text-gray-400 mt-1">1 day ago</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-3 border-t border-gray-100">
                                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                                        View all notifications
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Metrics Grid removed */}

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-5">
                    {/* Video Section */}
                    <div className="bg-white rounded-xl overflow-hidden border border-gray-100">
                        <div className="p-5">
                            <h2 className="text-xl font-bold text-gray-900 mb-2">Your Automation Journey</h2>
                            <p className="text-gray-600 mb-4">Watch how we&apos;re transforming your business processes with AI-powered automation.</p>
                        </div>
                        <div className="aspect-video bg-black rounded-b-xl">
                            <iframe 
                                src="https://player.vimeo.com/video/1068762817?h=1234567890abcdef&title=0&byline=0&portrait=0&autoplay=0" 
                                className="w-full h-full" 
                                frameBorder="0" 
                                allow="autoplay; fullscreen; picture-in-picture" 
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>

                    {/* Action Required section removed */}

                    {/* Your Projects section removed */}

                    {/* Recent Activity section removed */}
                </div>

                {/* Right Column */}
                <div className="lg:col-span-1 space-y-5">
                    {/* Strategic Partner */}
                    <div className="bg-white rounded-xl border border-gray-100 p-5">
                        <h3 className="font-bold text-lg mb-4 text-gray-900">Your Strategic Partner</h3>
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="relative flex-shrink-0">
                                <Image
                                    src="/Sergio_Bernal.jpg"
                                    alt="Sergio Bernal"
                                    width={64}
                                    height={64}
                                    className="w-16 h-16 rounded-full object-cover"
                                />
                                <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">Sergio Bernal</p>
                                <p className="text-sm text-gray-600">CEO & Lead Strategist</p>
                            </div>
                        </div>
                        <div className="space-y-2 mb-4 text-sm">
                            <div className="flex items-center text-gray-600">
                                <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                                sergio@mondabot.com
                            </div>
                            <div className="flex items-center text-gray-600">
                                <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                                Available Mon-Fri, 9am-6pm CET
                            </div>
                        </div>
                        <a
                            href="https://calendly.com/mondabot/30min?month=2025-07"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-2.5 rounded-lg text-white font-semibold bg-[#CC1175] hover:bg-[#d92085] transition flex items-center justify-center"
                        >
                            Schedule Strategy Call
                        </a>
                    </div>

                    {/* Next Major Milestone */}
                    <div className="bg-[#CC1175] text-white rounded-xl p-5">
                        <h3 className="font-bold text-lg mb-4">Next Major Milestone</h3>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-white/20 rounded-lg">
                                    <MessageCircle className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="font-semibold">WhatsApp Bot Launch</p>
                                    <p className="text-sm opacity-90">Automated Customer Support</p>
                                </div>
                            </div>
                        </div>
                        <div className="mb-4">
                            <div className="flex justify-between text-sm mb-2">
                                <span>Progress</span>
                                <span>85%</span>
                            </div>
                            <div className="w-full bg-white/20 rounded-full h-2">
                                <div className="h-2 rounded-full bg-white" style={{ width: '85%' }}></div>
                            </div>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>Launches in 3 days</span>
                            <span className="font-medium">High Priority</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

// The main export determines whether to use Clerk or not
export default function HomePage() {
    // Check if Clerk is properly configured
    const isClerkConfigured = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
    
    if (isAuthEnabled && isClerkConfigured) {
        return <UserSpecificContent />;
    }
    // Render a default state if auth is disabled
    return <HomePageContent userName="Demo User" />;
} 