"use client";

export default function UpdatesPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                <h1 className="text-3xl font-bold text-gray-900">Project Timeline</h1>
            </header>

            {/* Timeline Content */}
            <div className="relative pl-8">
                {/* Vertical Timeline Line */}
                <div className="absolute left-0 top-0 h-full w-0.5 bg-gray-200" style={{ marginLeft: '11px' }}></div>
                
                {/* Timeline Item 1 */}
                <div className="relative mb-8">
                    <div className="absolute -left-8 top-0 flex items-center justify-center w-6 h-6 bg-green-500 rounded-full ring-8 ring-white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                            <path d="M20 6 9 17l-5-5"/>
                        </svg>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 ml-4">
                        <p className="text-sm text-gray-500 mb-1">July 5, 2025</p>
                        <h3 className="font-semibold text-lg text-gray-800">Lead Qualification Bot Performance Report</h3>
                        <p className="mt-2 text-gray-600">Monthly performance report shows a 34% increase in qualified leads and a 28% reduction in response time. The automation is performing above expectations.</p>
                        <div className="mt-4">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">Approved</span>
                        </div>
                    </div>
                </div>

                {/* Timeline Item 2 */}
                <div className="relative mb-8">
                    <div className="absolute -left-8 top-0 flex items-center justify-center w-6 h-6 bg-yellow-500 rounded-full ring-8 ring-white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                            <path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
                            <path d="M12 9v4"/>
                            <path d="M12 17h.01"/>
                        </svg>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 ml-4">
                        <p className="text-sm text-gray-500 mb-1">July 3, 2025</p>
                        <h3 className="font-semibold text-lg text-gray-800">WhatsApp Bot Testing Phase Complete</h3>
                        <p className="mt-2 text-gray-600">Successfully completed initial testing of the WhatsApp support bot. The system is now ready for your feedback and review before the final launch.</p>
                        <div className="mt-4">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 mr-2">Needs Review</span>
                            <a href="#" className="text-sm font-semibold text-[#d90077] hover:underline">Provide Feedback &rarr;</a>
                        </div>
                    </div>
                </div>

                {/* Timeline Item 3 */}
                <div className="relative mb-8">
                    <div className="absolute -left-8 top-0 flex items-center justify-center w-6 h-6 bg-blue-500 rounded-full ring-8 ring-white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                            <path d="M12 20v-6M6 20v-2M18 20v-4"/>
                            <path d="M12 14V4"/>
                            <path d="M6 18v-7"/>
                            <path d="M18 16V4"/>
                        </svg>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 ml-4">
                        <p className="text-sm text-gray-500 mb-1">June 28, 2025</p>
                        <h3 className="font-semibold text-lg text-gray-800">Project Kick-off: Asana Notetaker</h3>
                        <p className="mt-2 text-gray-600">Work has officially begun on the Asana Notetaker automation. Our team is currently mapping out the primary workflow and integration points.</p>
                        <div className="mt-4">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">In Progress</span>
                        </div>
                    </div>
                </div>

                {/* Timeline Item 4 */}
                <div className="relative mb-8">
                    <div className="absolute -left-8 top-0 flex items-center justify-center w-6 h-6 bg-purple-500 rounded-full ring-8 ring-white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                            <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>
                        </svg>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 ml-4">
                        <p className="text-sm text-gray-500 mb-1">June 25, 2025</p>
                        <h3 className="font-semibold text-lg text-gray-800">Automation Framework Deployed</h3>
                        <p className="mt-2 text-gray-600">The foundational automation framework has been successfully deployed to your environment. This enables all future automations to be built and deployed efficiently.</p>
                        <div className="mt-4">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">Completed</span>
                        </div>
                    </div>
                </div>

                {/* Timeline Item 5 */}
                <div className="relative mb-8">
                    <div className="absolute -left-8 top-0 flex items-center justify-center w-6 h-6 bg-gray-500 rounded-full ring-8 ring-white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                            <path d="M9 12l2 2 4-4"/>
                            <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"/>
                        </svg>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 ml-4">
                        <p className="text-sm text-gray-500 mb-1">June 20, 2025</p>
                        <h3 className="font-semibold text-lg text-gray-800">Initial Consultation Complete</h3>
                        <p className="mt-2 text-gray-600">Completed comprehensive consultation session to understand your business needs and automation requirements. Project roadmap has been finalized and approved.</p>
                        <div className="mt-4">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">Milestone</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 