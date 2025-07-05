"use client";

import { useUser } from '@clerk/nextjs';
import { Bell, Plus, MessageCircle, AlertCircle, Zap, CheckCircle, Clock, Database, Mail } from 'lucide-react';
import Image from 'next/image';

// Check if authentication is enabled (using NEXT_PUBLIC_ prefix)
const isAuthEnabled = process.env.NEXT_PUBLIC_ENABLE_AUTHENTICATION === 'true';

// A component that uses Clerk hooks
const UserSpecificContent = () => {
    // Check if authentication is enabled and Clerk is configured
    const isClerkConfigured = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
    
    // Always call useUser hook to comply with React hooks rules
    let userResult;
    try {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        userResult = useUser();
    } catch (error) {
        // If Clerk hooks fail (e.g., during build), use default values
        console.warn('Clerk hooks not available:', error);
        userResult = { user: null, isLoaded: true };
    }
    
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
    return (
        <>
            {/* Header */}
            <header className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between mb-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Welcome, {userName}</h1>
                    <p className="text-gray-600 mt-1">Here&apos;s your automation empire at a glance.</p>
                </div>
                <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                    <button className="p-2 rounded-lg hover:bg-gray-100 transition">
                        <Bell className="w-5 h-5 text-gray-600" />
                    </button>
                    <button className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white font-semibold bg-[#6A10AD] hover:bg-[#7d1fc4] transition">
                        <Plus className="w-5 h-5" />
                        <span>Create New</span>
                    </button>
                </div>
            </header>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-5 rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-sm text-gray-600">Active Automations</p>
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Zap className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">12</p>
                    <p className="text-sm text-green-600 mt-2">↑ +33.3% from last month</p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-sm text-gray-600">Tasks Completed</p>
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">156</p>
                    <p className="text-sm text-green-600 mt-2">↑ +12% this week</p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-sm text-gray-600">Time Saved</p>
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Clock className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">48h</p>
                    <p className="text-sm text-gray-500 mt-2">This month</p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-sm text-gray-600">Active Integrations</p>
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                            <Database className="w-6 h-6 text-orange-600" />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">8</p>
                    <p className="text-sm text-gray-500 mt-2">All systems operational</p>
                </div>
            </div>

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

                    {/* Action Required */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5">
                        <div className="flex items-start space-x-3">
                            <AlertCircle className="w-6 h-6 text-yellow-600 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                                <h3 className="font-bold text-gray-900">Action Required: WhatsApp Bot Review</h3>
                                <p className="text-sm text-gray-700 mt-1">Your feedback on conversation flows is needed before launch. This will only take 5 minutes.</p>
                                <button className="mt-3 px-4 py-2 bg-yellow-600 text-white text-sm font-semibold rounded-lg hover:bg-yellow-700 transition">
                                    Review Now →
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white rounded-xl border border-gray-100 p-5">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
                        <div className="space-y-3">
                            <div className="flex items-start space-x-3">
                                <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Lead Generation Automation Activated</p>
                                    <p className="text-xs text-gray-500">2 hours ago • LinkedIn Integration</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <div className="w-2 h-2 bg-orange-500 rounded-full mt-1.5 flex-shrink-0"></div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Email Campaign Performance Report Ready</p>
                                    <p className="text-xs text-gray-500">5 hours ago • 34% Open Rate</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5 flex-shrink-0"></div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">New Integration: Slack Connected</p>
                                    <p className="text-xs text-gray-500">Yesterday • Team Notifications Enabled</p>
                                </div>
                            </div>
                        </div>
                    </div>
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
                            className="w-full py-2.5 rounded-lg text-white font-semibold bg-[#6A10AD] hover:bg-[#7d1fc4] transition flex items-center justify-center"
                        >
                            Schedule Strategy Call
                        </a>
                    </div>

                    {/* Next Major Milestone */}
                    <div className="bg-[#6A10AD] text-white rounded-xl p-5">
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