"use client";

import Image from 'next/image';

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4 animate-slide-up">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Welcome back, Sergio</h1>
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Welcome Video Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                        <div className="p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Automation Journey</h2>
                            <p className="text-gray-600 mb-4">Watch how we&apos;re transforming your business processes with AI-powered automation</p>
                            
                            <div className="relative w-full bg-gradient-to-br from-gray-900 to-gray-700 rounded-lg overflow-hidden" style={{paddingBottom: '56.25%'}}>
                                <iframe 
                                    src="https://player.vimeo.com/video/1068762817?h=1234567890abcdef&title=0&byline=0&portrait=0" 
                                    frameBorder="0" 
                                    allow="autoplay; fullscreen; picture-in-picture" 
                                    allowFullScreen
                                    className="absolute top-0 left-0 w-full h-full rounded-lg"
                                ></iframe>
                            </div>
                        </div>
                    </div>

                    {/* Action Required Card */}
                    <div className="bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-xl p-6 border-l-4 border-yellow-500 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-yellow-700">
                                    <path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
                                    <path d="M12 9v4"/>
                                    <path d="M12 17h.01"/>
                                </svg>
                            </div>
                            <div className="ml-3 flex-1">
                                <h3 className="text-lg font-bold text-yellow-900">Action Required: WhatsApp Bot Review</h3>
                                <p className="text-sm text-yellow-800 mt-1">Your feedback on conversation flows is needed before launch. This will only take 5 minutes.</p>
                                <button className="mt-3 px-4 py-2 text-sm font-semibold bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition">
                                    Review Now →
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
                        <div className="space-y-4">
                            <div className="flex items-start space-x-3">
                                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">Lead Generation Automation Activated</p>
                                    <p className="text-xs text-gray-500">2 hours ago • LinkedIn Integration</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">Email Campaign Performance Report Ready</p>
                                    <p className="text-xs text-gray-500">5 hours ago • 34% Open Rate</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">New Integration: Slack Connected</p>
                                    <p className="text-xs text-gray-500">Yesterday • Team Notifications Enabled</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Content */}
                <div className="space-y-6">
                    {/* Project Manager Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                        <h3 className="font-bold text-lg mb-4 text-gray-900">Your Strategic Partner</h3>
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="relative">
                                <Image 
                                    src="/Sergio_Bernal.jpg" 
                                    alt="Sergio Bernal" 
                                    width={64} 
                                    height={64} 
                                    className="w-16 h-16 rounded-full object-cover"
                                />
                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">Sergio Bernal</p>
                                <p className="text-sm text-gray-600">CEO & Lead Strategist</p>
                            </div>
                        </div>
                        <div className="space-y-2 mb-4">
                            <div className="flex items-center text-sm text-gray-600">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                                </svg>
                                sergio@mondabot.com
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                                </svg>
                                Available Mon-Fri, 9am-6pm CET
                            </div>
                        </div>
                        <a href="https://calendly.com/mondabot/30min?month=2025-06" target="_blank" rel="noopener noreferrer" 
                           className="w-full py-2.5 rounded-lg text-white font-semibold transition bg-purple-700 hover:bg-purple-800 block text-center">
                            Schedule Strategy Call
                        </a>
                    </div>

                    {/* Next Milestone */}
                    <div className="bg-gradient-to-br from-purple-700 to-purple-900 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                        <h3 className="font-bold text-lg mb-4">Next Major Milestone</h3>
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="p-3 bg-white/20 rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                                </svg>
                            </div>
                            <div className="flex-1">
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
                                <div className="h-2 rounded-full bg-white relative overflow-hidden" style={{width: '85%'}}>
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm opacity-90">Launches in 3 days</span>
                            <span className="text-xs bg-white/20 px-2 py-1 rounded">High Priority</span>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-slide-up {
                    animation: slideUp 0.6s ease-out forwards;
                }
            `}</style>
        </div>
    );
} 