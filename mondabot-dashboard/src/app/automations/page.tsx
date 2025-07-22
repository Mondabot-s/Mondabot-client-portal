"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { useProjects } from '../../hooks/useProjects';

interface Project {
    id: string;
    projectId?: string;
    name: string;
    status: string;
    deadline?: string | null;
    assignedManager?: string[];
    tasks?: string[];
    clientName?: string;
    updatedAt?: string;
    // Add any other fields that might come from Airtable
    [key: string]: unknown;
}

interface Task {
    id: string;
    'Task Name': string;
    'Status': string;
    'Projects': string[];
}

interface ProjectProgress {
    completedTasks: number;
    totalTasks: number;
    percentage: number;
}

export default function AutomationsPage() {
    const [tasks, setTasks] = useState([] as Task[]);
    const [sortOrder, setSortOrder] = useState('recent');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [activeFilter, setActiveFilter] = useState('All Projects');
    const [searchTerm, setSearchTerm] = useState('');

    // Get the current user for client filtering
    const isAuthEnabled = process.env.NEXT_PUBLIC_ENABLE_AUTHENTICATION === 'true';
    const isClerkConfigured = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

    // Always call useUser hook at the top level to comply with React hooks rules
    const userResult = useUser();

    // Only use results if authentication is enabled and Clerk is configured
    const user = (isAuthEnabled && isClerkConfigured) ? userResult.user : null;

    // Get the user's full name for client filtering
    const clientName = user?.fullName || user?.firstName || null;

    // Use our custom hook to fetch projects filtered by client name
    const {
        projects,
        loading,
        error,
        refetch: refetchProjects
    } = useProjects(clientName || undefined, sortOrder);

    // Filter options
    const filters = ['All Projects', 'Planning', 'Building', 'Quality Control', 'Live', 'Completed'];

    // Sort options
    const sortOptions = [
        { value: 'recent', label: 'Most Recent' },
        { value: 'deadline', label: 'Deadline' },
        { value: 'progress', label: 'Progress' },
        { value: 'name', label: 'Name (A-Z)' },
        { value: 'status', label: 'Status' }
    ];

    const fetchTasks = useCallback(async () => {
        try {
            const tasksResponse = await fetch('/api/tasks');

            if (!tasksResponse.ok) {
                throw new Error(`Tasks API error: ${tasksResponse.status}`);
            }

            const tasksData = await tasksResponse.json();
            setTasks(tasksData);
        } catch (err) {
            console.error('Error fetching tasks:', err);
        }
    }, []);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // Cmd/Ctrl + K for search
            if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
                event.preventDefault();
                const searchInput = document.getElementById('search-input') as HTMLInputElement;
                if (searchInput) {
                    searchInput.focus();
                }
            }
            // Escape to clear search
            if (event.key === 'Escape' && searchTerm) {
                setSearchTerm('');
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [searchTerm]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isDropdownOpen && !(event.target as Element).closest('.dropdown-container')) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isDropdownOpen]);

    // Calculate project progress
    const calculateProjectProgress = useCallback((projectId: string): ProjectProgress => {
        const projectTasks = tasks.filter(task => task.Projects && task.Projects.includes(projectId));
        const completedTasks = projectTasks.filter(task => task.Status === 'Done').length;
        const totalTasks = projectTasks.length;

        return {
            completedTasks,
            totalTasks,
            percentage: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
        };
    }, [tasks]);

    // Search functionality
    const searchProjects = useCallback((searchTerm: string) => {
        if (!searchTerm) return projects;

        const term = searchTerm.toLowerCase();
        return projects.filter(project =>
            project.name.toLowerCase().includes(term) ||
            (project.assignedManager && project.assignedManager.some(manager => manager.toLowerCase().includes(term))) ||
            project.status.toLowerCase().includes(term)
        );
    }, [projects]);

    // Filter functionality
    const filterProjects = useCallback((projects: Project[], filterType: string) => {
        if (filterType === 'All Projects') return projects;

        if (filterType === 'Completed') {
            return projects.filter(project => {
                const progress = calculateProjectProgress(project.id);
                return progress.percentage === 100;
            });
        }

        return projects.filter(project => project.status === filterType);
    }, [calculateProjectProgress]);

    // Sort functionality
    const sortProjects = useCallback((projects: Project[], sortBy: string) => {
        return [...projects].sort((a, b) => {
            switch (sortBy) {
                case 'recent':
                    return new Date(b.updatedAt || '').getTime() - new Date(a.updatedAt || '').getTime();
                case 'deadline':
                    return new Date(a.deadline || '').getTime() - new Date(b.deadline || '').getTime();
                case 'progress':
                    const progressA = calculateProjectProgress(a.id);
                    const progressB = calculateProjectProgress(b.id);
                    return progressB.percentage - progressA.percentage;
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'status':
                    const statusOrder = ['Live', 'Quality Control', 'Building', 'Planning'];
                    return statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
                default:
                    return 0;
            }
        });
    }, [calculateProjectProgress]);

    // Computed filtered and sorted projects
    const filteredAndSortedProjects = useMemo(() => {
        let result = searchProjects(searchTerm);
        result = filterProjects(result, activeFilter);
        result = sortProjects(result, sortOrder);
        return result;
    }, [searchTerm, activeFilter, sortOrder, searchProjects, filterProjects, sortProjects]);

    const handleSortChange = (newSortOrder: string) => {
        setSortOrder(newSortOrder);
        setIsDropdownOpen(false);
    };

    const formatDeadline = (deadline: string | null | undefined) => {
        if (!deadline) return 'No deadline';
        try {
            return new Date(deadline).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        } catch {
            return deadline;
        }
    };



    if (loading) {
        return (
            <div className="space-y-6 animate-pulse">
                <div className="flex justify-between items-center">
                    <div className="h-9 bg-gray-200 rounded-lg w-64"></div>
                    <div className="h-10 bg-gray-200 rounded-lg w-32"></div>
                </div>
                <div className="bg-white rounded-xl p-5 shadow-sm">
                    <div className="flex gap-2 mb-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-8 bg-gray-200 rounded-lg w-24"></div>
                        ))}
                    </div>
                </div>
                <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                            <div className="h-6 bg-gray-200 rounded w-48 mb-3"></div>
                            <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-24"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-900">Projects Dashboard</h1>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-red-800 font-medium">Error loading projects</span>
                    </div>
                    <p className="text-red-600 text-sm mt-1">{error}</p>
                    <button
                        onClick={() => {
                            refetchProjects();
                            fetchTasks();
                        }}
                        className="mt-3 bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Your Projects</h1>
                <p className="text-slate-500 mt-1">Filter and view all your active and completed automations.</p>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <input
                    id="search-input"
                    type="text"
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-20 py-2 border border-slate-300 rounded-lg leading-5 bg-white placeholder-slate-500 focus:outline-none focus:placeholder-slate-400 focus:ring-2 focus:ring-slate-800 focus:border-transparent text-sm transition-all duration-200"
                />
                {/* Keyboard shortcut hint */}
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <kbd className="hidden sm:inline-flex items-center px-2 py-1 text-xs font-medium text-slate-500 bg-slate-100 border border-slate-300 rounded">
                        {typeof window !== 'undefined' && navigator.userAgent.indexOf('Mac') > -1 ? '⌘K' : 'Ctrl+K'}
                    </kbd>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                {/* Filter Tabs */}
                <nav className="flex space-x-2">
                    {filters.map(filter => {
                        // Calculate count for each filter
                        const getFilterCount = (filterType: string) => {
                            if (filterType === 'All Projects') {
                                return projects.length;
                            } else if (filterType === 'Completed') {
                                return projects.filter(p => calculateProjectProgress(p.id).percentage === 100).length;
                            } else {
                                return projects.filter(p => p.status === filterType).length;
                            }
                        };

                        const count = getFilterCount(filter);

                        return (
                            <button
                                key={filter}
                                className={`font-semibold px-4 py-2 rounded-lg text-sm flex items-center transition-all duration-200 ${activeFilter === filter
                                        ? 'bg-pink-600 text-white'
                                        : 'bg-white text-slate-600 hover:bg-slate-50'
                                    }`}
                                onClick={() => setActiveFilter(filter)}
                            >
                                {filter}
                                <span className={`ml-2 text-xs w-5 h-5 flex items-center justify-center rounded-full ${activeFilter === filter
                                        ? 'bg-pink-400 text-white'
                                        : filter === 'Completed'
                                            ? 'bg-slate-200 text-slate-700'
                                            : filter === 'Planning'
                                                ? 'bg-purple-200 text-purple-800'
                                                : filter === 'Building'
                                                    ? 'bg-blue-200 text-blue-800'
                                                    : filter === 'Quality Control'
                                                        ? 'bg-yellow-200 text-yellow-800'
                                                        : filter === 'Live'
                                                            ? 'bg-green-200 text-green-800'
                                                            : 'bg-slate-200 text-slate-700'
                                    }`}>
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </nav>

                {/* Sort Dropdown */}
                <div className="relative dropdown-container">
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="text-slate-500 font-medium px-4 py-2 rounded-lg text-sm flex items-center border border-slate-300 bg-white hover:bg-slate-50 transition-colors duration-200"
                    >
                        Sort by: {sortOptions.find(option => option.value === sortOrder)?.label}
                        <i className={`fas fa-chevron-down ml-2 text-xs transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}></i>
                    </button>
                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-lg shadow-lg z-20 animate-fade-in">
                            <div className="py-1">
                                {sortOptions.map(option => (
                                    <button
                                        key={option.value}
                                        onClick={() => handleSortChange(option.value)}
                                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-slate-100 transition-colors duration-150 ${sortOrder === option.value
                                                ? 'font-semibold text-slate-800 bg-slate-50'
                                                : 'text-slate-700'
                                            }`}
                                    >
                                        {option.label}
                                        {sortOrder === option.value && (
                                            <svg className="w-4 h-4 inline-block ml-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Projects Grid */}
            {filteredAndSortedProjects.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8 text-center">
                    <svg className="w-12 h-12 text-slate-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="text-lg font-medium text-slate-900 mb-2">No Projects Found</h3>
                    <p className="text-slate-600">
                        {searchTerm ? 'Try adjusting your search terms' : 'No projects yet. Contact your account manager to get started.'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredAndSortedProjects.map((project) => {
                        const progress = calculateProjectProgress(project.id);

                        // Get status-specific styling
                        const getStatusStyling = (status: string) => {
                            switch (status) {
                                case 'Planning':
                                    return {
                                        badge: 'bg-purple-100 text-purple-800',
                                        progress: 'bg-purple-500'
                                    };
                                case 'Building':
                                    return {
                                        badge: 'bg-blue-100 text-blue-800',
                                        progress: 'bg-blue-500'
                                    };
                                case 'Quality Control':
                                    return {
                                        badge: 'bg-yellow-100 text-yellow-800',
                                        progress: 'bg-yellow-500'
                                    };
                                case 'Live':
                                    return {
                                        badge: 'bg-green-100 text-green-800',
                                        progress: 'bg-green-500'
                                    };
                                default:
                                    return {
                                        badge: 'bg-slate-200 text-slate-700',
                                        progress: 'bg-green-500'
                                    };
                            }
                        };

                        const statusStyling = getStatusStyling(project.status);

                        // Get estimated completion date
                        const getEstimatedCompletion = (project: Project) => {
                            return formatDeadline(project.deadline);
                        };

                        // Get button text - always View Details
                        const getButtonText = () => {
                            return 'View Details';
                        };

                        return (
                            <div
                                key={project.id}
                                className="project-card bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200"
                            >
                                {/* Project Header */}
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-lg text-slate-800">{project.name}</h3>
                                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusStyling.badge}`}>
                                        {project.status}
                                    </span>
                                </div>

                                {/* Project Description */}
                                <p className="text-sm text-slate-500 mt-2">
                                    {project.status === 'Live'
                                        ? 'This automation is live and actively working for you.'
                                        : project.status === 'Quality Control'
                                            ? 'This automation is ready for your review before we move to the final deployment phase.'
                                            : project.status === 'Building'
                                                ? 'Currently in development phase, building and integrating core features.'
                                                : project.status === 'Planning'
                                                    ? 'Our team is planning and scoping the requirements for this automation.'
                                                    : progress.percentage === 100
                                                        ? 'This project was successfully completed and delivered.'
                                                        : 'Automation project in progress.'
                                    }
                                </p>

                                {/* Progress Section */}
                                <div className="mt-4">
                                    <span className="text-sm font-medium text-slate-600">Overall Progress</span>
                                    <div className="w-full bg-slate-200 rounded-full h-2.5 mt-1">
                                        <div
                                            className={`h-2.5 rounded-full ${statusStyling.progress}`}
                                            style={{ width: `${progress.percentage}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Project Footer */}
                                <div className="flex justify-between items-end mt-4 border-t border-slate-200 pt-4">
                                    <div>
                                        <p className="text-xs text-slate-500">
                                            {'Estimated Completion'}
                                        </p>
                                        <p className="font-semibold text-slate-700">
                                            {getEstimatedCompletion(project)}
                                        </p>
                                    </div>
                                    <Link
                                        href={`/projects/${project.id}`}
                                        className="bg-pink-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-pink-700 transition-colors"
                                    >
                                        {getButtonText()}
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
} 