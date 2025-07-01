"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getStatusBadgeClasses, getStatusBadgeStyle } from '@/utils/statusTheme';

interface Project {
  id: string;
  projectId: string;
  name: string;
  status: string;
  deadline: string;
  assignedManager: string[];
  tasks: string[];
}

interface Task {
  id: string;
  'Task Name': string;
  'Status': string;
  'Projects': string[];
}

export default function AutomationsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState('default');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        fetchProjectsAndTasks();
    }, [sortOrder]);

    const fetchProjectsAndTasks = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const [projectsResponse, tasksResponse] = await Promise.all([
                fetch(`/api/projects?sortBy=${sortOrder}`),
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
    };

    const handleSortChange = (newSortOrder: string) => {
        setSortOrder(newSortOrder);
        setIsDropdownOpen(false);
    };

    const getTaskCount = (projectId: string) => {
        return tasks.filter(task => task.Projects && task.Projects.includes(projectId)).length;
    };

    const formatDeadline = (deadline: string) => {
        if (!deadline) return 'No deadline';
        try {
            return new Date(deadline).toLocaleDateString('en-US', { 
                month: 'long', 
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
            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-900">Projects Dashboard</h1>
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    <span className="ml-2 text-gray-600">Loading projects...</span>
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
            {/* Navigation Header */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 mb-8">
                <h2 className="font-bold text-lg mb-2">Page Navigation</h2>
                <p className="text-sm text-gray-600 mb-4">Switch between different views of your project data.</p>
                <div className="flex flex-wrap gap-4">
                    <span className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow">
                        Projects List (Current)
                    </span>
                    <Link href="/tasks" className="bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-gray-700 transition-colors">
                        Global Tasks View
                    </Link>
                </div>
            </div>

            {/* Header with Sort Dropdown */}
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Projects Dashboard</h1>
                
                {/* Sort Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Sort by
                        <svg className="ml-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.23 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                        </svg>
                    </button>
                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                            <div className="py-1">
                                <button
                                    onClick={() => handleSortChange('default')}
                                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${sortOrder === 'default' ? 'font-semibold text-indigo-600' : 'text-gray-700'}`}
                                >
                                    Default Order
                                </button>
                                <button
                                    onClick={() => handleSortChange('name')}
                                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${sortOrder === 'name' ? 'font-semibold text-indigo-600' : 'text-gray-700'}`}
                                >
                                    Name (A-Z)
                                </button>
                                <button
                                    onClick={() => handleSortChange('status')}
                                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${sortOrder === 'status' ? 'font-semibold text-indigo-600' : 'text-gray-700'}`}
                                >
                                    Status
                                </button>
                                <button
                                    onClick={() => handleSortChange('deadline')}
                                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${sortOrder === 'deadline' ? 'font-semibold text-indigo-600' : 'text-gray-700'}`}
                                >
                                    Deadline (Soonest)
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            {projects.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 text-center">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Projects Found</h3>
                    <p className="text-gray-600">No projects are currently available in your Airtable database.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {projects.map((project) => {
                        const taskCount = getTaskCount(project.id);
                        
                        return (
                            <div key={project.id} className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <h2 className="text-xl font-bold text-gray-800">{project.name}</h2>
                                        <p className="text-sm text-gray-500 mt-2">
                                            Project Manager: {getManagerNames(project.assignedManager)}
                                        </p>
                                        <div className="flex items-center text-sm text-gray-500 mt-2">
                                            <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2v12a2 2 0 002 2z" />
                                            </svg>
                                            Deadline: {formatDeadline(project.deadline)}
                                        </div>
                                    </div>
                                    <span 
                                        className={getStatusBadgeClasses(project.status)}
                                    >
                                        {project.status}
                                    </span>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                                    <p className="text-sm text-gray-600 font-semibold">
                                        {taskCount} task{taskCount !== 1 ? 's' : ''}
                                    </p>
                                    <Link 
                                        href={`/tasks?project=${project.id}`}
                                        className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
                                    >
                                        View Details →
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