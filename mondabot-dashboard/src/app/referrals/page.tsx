"use client";

import { useState } from 'react';
import { Check } from 'lucide-react';
import { useUser } from '@clerk/nextjs';

interface FormData {
    friendName: string;
    friendEmail: string;
    message: string;
}

// Component that uses Clerk hooks with proper error handling
const ReferralsWithAuth = () => {
    const [formData, setFormData] = useState<FormData>({
        friendName: '',
        friendEmail: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    // Check if authentication is enabled and Clerk is configured
    const isAuthEnabled = process.env.NEXT_PUBLIC_ENABLE_AUTHENTICATION === 'true';
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

    // Get user's full name and email with fallbacks
    const getUserFullName = () => {
        if (user?.firstName && user?.lastName) {
            return `${user.firstName} ${user.lastName}`;
        }
        if (user?.firstName) {
            return user.firstName;
        }
        return 'Demo User'; // Fallback for demo mode
    };

    const getUserEmail = () => {
        return user?.emailAddresses?.[0]?.emailAddress || 'demo@mondabot.com';
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleReferralSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const response = await fetch('https://mondabot.up.railway.app/webhook/ddb87201-aeb1-41d2-967d-a8e77380eceb', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    friendName: formData.friendName,
                    friendEmail: formData.friendEmail,
                    message: formData.message,
                    // Add current user information to the payload
                    userName: getUserFullName(),
                    userEmail: getUserEmail()
                }),
            });

            if (response.ok) {
                setIsSuccess(true);
                // Reset form
                setFormData({
                    friendName: '',
                    friendEmail: '',
                    message: ''
                });
                // Reset success state after 3 seconds
                setTimeout(() => {
                    setIsSuccess(false);
                }, 3000);
            } else {
                throw new Error('Failed to send referral');
            }
        } catch (error) {
            console.error('Error sending referral:', error);
            setError('Failed to send referral. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Show loading state if user data is still being loaded
    if (!isLoaded) {
        return (
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Refer & Win</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <div className="animate-pulse">
                            <div className="h-4 bg-gray-200 rounded mb-4"></div>
                            <div className="h-10 bg-gray-200 rounded mb-4"></div>
                            <div className="h-10 bg-gray-200 rounded mb-4"></div>
                            <div className="h-20 bg-gray-200 rounded mb-4"></div>
                            <div className="h-10 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <div className="animate-pulse">
                            <div className="h-4 bg-gray-200 rounded mb-4"></div>
                            <div className="h-10 bg-gray-200 rounded mb-2"></div>
                            <div className="h-10 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Refer & Win</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-xl font-bold mb-4">Refer a Friend</h3>
                    <p className="text-gray-600 mb-6">Get $500 credit for each successful referral!</p>
                    <form onSubmit={handleReferralSubmit} className="space-y-4">
                        <input 
                            type="text" 
                            name="friendName"
                            value={formData.friendName}
                            onChange={handleInputChange}
                            placeholder="Friend's Name" 
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent" 
                            required 
                            disabled={isSubmitting}
                        />
                        <input 
                            type="email" 
                            name="friendEmail"
                            value={formData.friendEmail}
                            onChange={handleInputChange}
                            placeholder="Friend's Email" 
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent" 
                            required 
                            disabled={isSubmitting}
                        />
                        <textarea 
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            placeholder="Why would they benefit from our service?" 
                            className="w-full p-3 border border-gray-300 rounded-lg h-24 focus:ring-2 focus:ring-pink-500 focus:border-transparent" 
                            required
                            disabled={isSubmitting}
                        ></textarea>
                        
                        {error && (
                            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                                {error}
                            </div>
                        )}
                        
                        <button 
                            type="submit" 
                            disabled={isSubmitting || isSuccess}
                            className={`w-full p-3 rounded-lg transition-all duration-200 flex items-center justify-center ${
                                isSuccess 
                                    ? 'bg-green-600 text-white' 
                                    : isSubmitting 
                                        ? 'bg-gray-400 text-white cursor-not-allowed' 
                                        : 'bg-pink-600 text-white hover:bg-pink-700'
                            }`}
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Sending...
                                </>
                            ) : isSuccess ? (
                                <>
                                    <Check className="h-5 w-5 mr-2" />
                                    Referral Sent!
                                </>
                            ) : (
                                'Send Referral'
                            )}
                        </button>
                    </form>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-xl font-bold mb-4">Your Referrals</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                            <span>John Smith</span>
                            <span className="px-2 py-1 text-xs font-semibold text-white bg-yellow-500 rounded-full">Pending</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                            <span>Sarah Johnson</span>
                            <span className="px-2 py-1 text-xs font-semibold text-white bg-green-500 rounded-full">Approved</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Non-authenticated version for demo mode
const ReferralsDemo = () => {
    const [formData, setFormData] = useState<FormData>({
        friendName: '',
        friendEmail: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleReferralSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const response = await fetch('https://mondabot.up.railway.app/webhook/ddb87201-aeb1-41d2-967d-a8e77380eceb', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    friendName: formData.friendName,
                    friendEmail: formData.friendEmail,
                    message: formData.message,
                    // Demo user information
                    userName: 'Demo User',
                    userEmail: 'demo@mondabot.com'
                }),
            });

            if (response.ok) {
                setIsSuccess(true);
                // Reset form
                setFormData({
                    friendName: '',
                    friendEmail: '',
                    message: ''
                });
                // Reset success state after 3 seconds
                setTimeout(() => {
                    setIsSuccess(false);
                }, 3000);
            } else {
                throw new Error('Failed to send referral');
            }
        } catch (error) {
            console.error('Error sending referral:', error);
            setError('Failed to send referral. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Refer & Win</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-xl font-bold mb-4">Refer a Friend</h3>
                    <p className="text-gray-600 mb-6">Get $500 credit for each successful referral!</p>
                    <form onSubmit={handleReferralSubmit} className="space-y-4">
                        <input 
                            type="text" 
                            name="friendName"
                            value={formData.friendName}
                            onChange={handleInputChange}
                            placeholder="Friend's Name" 
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent" 
                            required 
                            disabled={isSubmitting}
                        />
                        <input 
                            type="email" 
                            name="friendEmail"
                            value={formData.friendEmail}
                            onChange={handleInputChange}
                            placeholder="Friend's Email" 
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent" 
                            required 
                            disabled={isSubmitting}
                        />
                        <textarea 
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            placeholder="Why would they benefit from our service?" 
                            className="w-full p-3 border border-gray-300 rounded-lg h-24 focus:ring-2 focus:ring-pink-500 focus:border-transparent" 
                            required
                            disabled={isSubmitting}
                        ></textarea>
                        
                        {error && (
                            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                                {error}
                            </div>
                        )}
                        
                        <button 
                            type="submit" 
                            disabled={isSubmitting || isSuccess}
                            className={`w-full p-3 rounded-lg transition-all duration-200 flex items-center justify-center ${
                                isSuccess 
                                    ? 'bg-green-600 text-white' 
                                    : isSubmitting 
                                        ? 'bg-gray-400 text-white cursor-not-allowed' 
                                        : 'bg-pink-600 text-white hover:bg-pink-700'
                            }`}
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Sending...
                                </>
                            ) : isSuccess ? (
                                <>
                                    <Check className="h-5 w-5 mr-2" />
                                    Referral Sent!
                                </>
                            ) : (
                                'Send Referral'
                            )}
                        </button>
                    </form>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-xl font-bold mb-4">Your Referrals</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                            <span>John Smith</span>
                            <span className="px-2 py-1 text-xs font-semibold text-white bg-yellow-500 rounded-full">Pending</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                            <span>Sarah Johnson</span>
                            <span className="px-2 py-1 text-xs font-semibold text-white bg-green-500 rounded-full">Approved</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Main component that determines which version to render
export default function ReferralsPage() {
    // Check if authentication is enabled (using NEXT_PUBLIC_ prefix)
    const isAuthEnabled = process.env.NEXT_PUBLIC_ENABLE_AUTHENTICATION === 'true';
    
    // Check if Clerk is properly configured
    const isClerkConfigured = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
    
    // Use authenticated version if auth is enabled and Clerk is configured
    if (isAuthEnabled && isClerkConfigured) {
        return <ReferralsWithAuth />;
    }
    
    // Use demo version otherwise
    return <ReferralsDemo />;
} 