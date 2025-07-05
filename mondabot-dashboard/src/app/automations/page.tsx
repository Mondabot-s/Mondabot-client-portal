"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';

interface Project {
  id: string;
  projectId: string;
  name: string;
  status: string;
  deadline: string;
  assignedManager: string[];
  tasks: string[];
  updatedAt?: string;
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
    const [projects, setProjects] = useState<Project[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState('recent');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [activeFilter, setActiveFilter] = useState('All Projects');
    const [searchTerm, setSearchTerm] = useState('');

    // Filter options
    const filters = ['All Projects', 'Building', 'Testing', 'For Review', 'Live', 'Completed'];

    // Sort options
    const sortOptions = [
        { value: 'recent', label: 'Most Recent' },
        { value: 'deadline', label: 'Deadline' },
        { value: 'progress', label: 'Progress' },
        { value: 'name', label: 'Name (A-Z)' },
        { value: 'status', label: 'Status' }
    ];

    const fetchProjectsAndTasks = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            
            const [projectsResponse, tasksResponse] = await Promise.all([
                fetch('/api/projects'),
                fetch('/api/tasks')
            ]);

            if (!projectsResponse.ok) {
                throw new Error(`Projects API error: ${projectsResponse.status}`);
            }
            if (!tasksResponse.ok) {
                throw new Error(`Tasks API error: ${tasksResponse.status}`);
            }

            const projectsData = await projectsResponse.json();
            const tasksData = await tasksResponse.json();

            setProjects(projectsData);
            setTasks(tasksData);
        } catch (err) {
            console.error('Error fetching data:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch data');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProjectsAndTasks();
    }, [fetchProjectsAndTasks]);

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
            project.assignedManager.some(manager => manager.toLowerCase().includes(term)) ||
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
            switch(sortBy) {
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
                    const statusOrder = ['Live', 'For Review', 'Testing', 'Building'];
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

    const formatDeadline = (deadline: string) => {
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

    const getManagerNames = (managers: string[]) => {
        if (!managers || managers.length === 0) return 'Unassigned';
        return managers.join(', ');
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
                        onClick={fetchProjectsAndTasks}
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
            {/* Header with Search */}
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
                <h1 className="text-3xl font-bold text-gray-900">Projects Dashboard</h1>
                
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
                        className="block w-full pl-10 pr-20 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-brand-primary focus:border-transparent text-sm transition-all duration-200"
                    />
                    {/* Keyboard shortcut hint */}
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <kbd className="hidden sm:inline-flex items-center px-2 py-1 text-xs font-medium text-gray-500 bg-gray-100 border border-gray-300 rounded">
                            {typeof window !== 'undefined' && navigator.platform.indexOf('Mac') > -1 ? '⌘K' : 'Ctrl+K'}
                        </kbd>
                    </div>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white rounded-xl p-5 shadow-sm flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                {/* Filter Tabs */}
                <div className="flex flex-wrap gap-2 overflow-x-auto filter-tabs">
                    {filters.map(filter => (
                        <button
                            key={filter}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                                activeFilter === filter
                                    ? 'bg-brand-primary text-white shadow-sm'
                                    : 'text-gray-600 hover:bg-gray-100'
                            }`}
                            onClick={() => setActiveFilter(filter)}
                        >
                            {filter}
                            {filter === 'Completed' && (
                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    {filteredAndSortedProjects.filter(p => calculateProjectProgress(p.id).percentage === 100).length}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Sort Dropdown */}
                <div className="relative dropdown-container">
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 transition-colors duration-200"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                        Sort by: {sortOptions.find(option => option.value === sortOrder)?.label}
                        <svg className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.23 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                        </svg>
                    </button>
                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-20 animate-fade-in">
                            <div className="py-1">
                                {sortOptions.map(option => (
                                    <button
                                        key={option.value}
                                        onClick={() => handleSortChange(option.value)}
                                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors duration-150 ${
                                            sortOrder === option.value
                                                ? 'font-semibold text-brand-primary bg-brand-primary/5'
                                                : 'text-gray-700'
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

            {/* Projects List */}
            {filteredAndSortedProjects.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 text-center">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Projects Found</h3>
                    <p className="text-gray-600">
                        {searchTerm ? 'Try adjusting your search terms' : 'No projects match your current filters'}
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredAndSortedProjects.map((project) => {
                        const progress = calculateProjectProgress(project.id);
                        
                        return (
                            <div 
                                key={project.id} 
                                className="project-card bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden border border-transparent hover:border-gray-200 cursor-pointer group"
                            >
                                {/* Left accent border on hover */}
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-transparent group-hover:bg-brand-primary transition-colors duration-200"></div>
                                
                                {/* Project Header */}
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-brand-primary transition-colors">
                                            {project.name}
                                        </h3>
                                        <div className="flex flex-col sm:flex-row sm:gap-6 gap-2 text-sm text-gray-600">
                                            <div className="flex items-center gap-1.5">
                                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                                <span>{getManagerNames(project.assignedManager)}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <span>Due: {formatDeadline(project.deadline)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Status Badge */}
                                    <span className={`status-badge px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                                        project.status === 'Building' ? 'bg-status-building text-white' :
                                        project.status === 'Testing' ? 'bg-status-testing text-white' :
                                        project.status === 'For Review' ? 'bg-status-review text-white' :
                                        project.status === 'Live' ? 'bg-status-live text-white' :
                                        'bg-gray-100 text-gray-700'
                                    }`}>
                                        {project.status}
                                    </span>
                                </div>
                                
                                {/* Project Footer with Progress */}
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mt-4 pt-4 border-t border-gray-100 progress-container">
                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                        <span className="font-medium">
                                            {progress.completedTasks} / {progress.totalTasks} tasks
                                        </span>
                                        
                                        {/* Progress Bar */}
                                        <div className="w-32 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-brand-primary transition-all duration-300 progress-fill" 
                                                style={{ width: `${progress.percentage}%` }}
                                            ></div>
                                        </div>
                                        
                                        <span className="font-medium text-brand-primary">
                                            {progress.percentage}% complete
                                        </span>
                                    </div>
                                    
                                    <Link 
                                        href={`/tasks?project=${project.id}`}
                                        className="text-sm font-medium text-gray-700 hover:text-brand-primary transition-colors flex items-center gap-1 group"
                                    >
                                        View Details 
                                        <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                        </svg>
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