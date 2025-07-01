"use client";

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getStatusBadgeClasses, getStatusBadgeStyle } from '@/utils/statusTheme';

interface Task {
  id: string;
  'Task Name': string;
  'Status': 'To Do' | 'In Progress' | 'Done';
  'Projects': string[];
}

interface Project {
  id: string;
  projectId: string;
  name: string;
  status: string;
  deadline: string;
  assignedManager: string[];
  tasks: string[];
}

function TasksPageContent() {
    const searchParams = useSearchParams();
    const projectFilter = searchParams.get('project');
    
    const [tasks, setTasks] = useState<Task[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchTasksAndProjects();
    }, []);

    const fetchTasksAndProjects = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const [tasksResponse, projectsResponse] = await Promise.all([
                fetch('/api/tasks'),
                fetch('/api/projects')
            ]);

            if (!tasksResponse.ok) {
                throw new Error(`Tasks API error: ${tasksResponse.status}`);
            }
            if (!projectsResponse.ok) {
                throw new Error(`Projects API error: ${projectsResponse.status}`);
            }

            const tasksData = await tasksResponse.json();
            const projectsData = await projectsResponse.json();

            setTasks(tasksData);
            setProjects(projectsData);
        } catch (err) {
            console.error('Error fetching data:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    const getProjectById = (projectId: string) => {
        return projects.find(p => p.id === projectId);
    };

    const getFilteredTasks = () => {
        if (!projectFilter) return tasks;
        return tasks.filter(task => task.Projects && task.Projects.includes(projectFilter));
    };

    const getTasksByStatus = (status: 'To Do' | 'In Progress' | 'Done') => {
        return getFilteredTasks().filter(task => task.Status === status);
    };

    const getProjectName = (projectId: string) => {
        const project = getProjectById(projectId);
        return project ? project.name : 'Unknown Project';
    };

    const getCurrentProjectName = () => {
        if (!projectFilter) return null;
        const project = getProjectById(projectFilter);
        return project ? project.name : 'Unknown Project';
    };

    const renderKanbanColumn = (status: 'To Do' | 'In Progress' | 'Done', title: string) => {
        const columnTasks = getTasksByStatus(status);
        
        const getStatusColor = () => {
            switch (status) {
                case 'To Do': return 'bg-gray-200 text-gray-700';
                case 'In Progress': return 'bg-blue-200 text-blue-700';
                case 'Done': return 'bg-green-200 text-green-700';
                default: return 'bg-gray-200 text-gray-700';
            }
        };

        const getBorderColor = () => {
            switch (status) {
                case 'To Do': return 'border-gray-400';
                case 'In Progress': return 'border-blue-400';
                case 'Done': return 'border-green-400';
                default: return 'border-gray-400';
            }
        };

        return (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-800">{title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor()}`}>
                        {columnTasks.length}
                    </span>
                </div>
                <div className="space-y-4">
                    {columnTasks.length === 0 ? (
                        <p className="text-sm text-gray-500">No tasks in this category.</p>
                    ) : (
                        columnTasks.map(task => (
                            <div key={task.id} className={`bg-gray-50 border-l-4 ${getBorderColor()} p-4 rounded-lg shadow-sm`}>
                                <h4 className="font-bold text-gray-900 mb-1">{task['Task Name']}</h4>
                                {!projectFilter && task.Projects && task.Projects.length > 0 && (
                                    <div className="mt-2">
                                        {task.Projects.map(projectId => (
                                            <p key={projectId} className="text-xs font-bold text-indigo-700">
                                                {getProjectName(projectId)}
                                            </p>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-900">Global Tasks Board</h1>
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    <span className="ml-2 text-gray-600">Loading tasks...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-900">Global Tasks Board</h1>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-red-800 font-medium">Error loading tasks</span>
                    </div>
                    <p className="text-red-600 text-sm mt-1">{error}</p>
                    <button 
                        onClick={fetchTasksAndProjects}
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
                    <Link href="/automations" className="bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-gray-700 transition-colors">
                        Projects List
                    </Link>
                    <span className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow">
                        Global Tasks View (Current)
                    </span>
                </div>
            </div>

            {/* Project Detail Navigation */}
            {projectFilter && (
                <div className="mb-8">
                    <Link href="/tasks" className="text-indigo-600 hover:text-indigo-800 font-semibold text-sm mb-4 inline-block">
                        ← Back to All Tasks
                    </Link>
                    <div className="md:flex md:items-center md:justify-between">
                        <div className="min-w-0 flex-1">
                            <h1 className="text-3xl font-bold text-gray-900">{getCurrentProjectName()}</h1>
                            <p className="mt-2 text-lg text-gray-600">A detailed view of all tasks for this project.</p>
                        </div>
                        <div className="mt-4 md:mt-0">
                            {(() => {
                                const project = getProjectById(projectFilter);
                                if (!project) return null;
                                
                                return (
                                    <span 
                                        className={getStatusBadgeClasses(project.status)}
                                    >
                                        {project.status}
                                    </span>
                                );
                            })()}
                        </div>
                    </div>
                </div>
            )}

            {/* Global Tasks Header */}
            {!projectFilter && (
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Global Tasks Board</h1>
                    <p className="mt-2 text-lg text-gray-600">A high-level overview of all tasks across all active projects.</p>
                </div>
            )}

            {/* Kanban Board */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {renderKanbanColumn('To Do', 'TO DO')}
                {renderKanbanColumn('In Progress', 'IN PROGRESS')}
                {renderKanbanColumn('Done', 'DONE')}
            </div>

            {/* Empty State */}
            {getFilteredTasks().length === 0 && (
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 text-center">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Tasks Found</h3>
                    <p className="text-gray-600">
                        {projectFilter 
                            ? 'No tasks found for this project.' 
                            : 'No tasks are currently available in your Airtable database.'
                        }
                    </p>
                </div>
            )}
        </div>
    );
}

function TasksPageSkeleton() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Global Tasks Board</h1>
            <div className="flex justify-center items-center py-12">
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-300 rounded w-32"></div>
                </div>
            </div>
        </div>
    );
}

export default function TasksPage() {
    return (
        <Suspense fallback={<TasksPageSkeleton />}>
            <TasksPageContent />
        </Suspense>
    );
} 