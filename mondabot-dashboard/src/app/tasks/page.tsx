"use client";

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

interface Task {
    id: string;
    taskId?: string;
    name: string;
    status: 'pending' | 'in-progress' | 'completed';
    projectId?: string;
    projectName?: string;
    deadline?: string | null;
    assignedTo?: string[];
    description?: string;
    priority?: 'low' | 'medium' | 'high';
    updatedAt?: string;
    [key: string]: unknown;
}

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<'all' | 'pending' | 'in-progress' | 'completed'>('all');

    // Get the current user for filtering (variables not used in this component)
    // const isAuthEnabled = process.env.NEXT_PUBLIC_ENABLE_AUTHENTICATION === 'true';
    // const isClerkConfigured = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
    
    // Always call useUser hook at the top level to comply with React hooks rules
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _userResult = useUser(); // Prefixed with _ to indicate intentionally unused
    
    // Only use results if authentication is enabled and Clerk is configured
    // const user = (isAuthEnabled && isClerkConfigured) ? userResult.user : null;

    // Fetch tasks from API
    const fetchTasks = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/tasks');
            
            if (!response.ok) {
                throw new Error(`Failed to fetch tasks: ${response.status}`);
            }
            
            const data = await response.json();
            setTasks(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching tasks:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    // Filter tasks based on selected filter
    const filteredTasks = tasks.filter(task => {
        if (filter === 'all') return true;
        return task.status === filter;
    });

    // Get task count by status
    const getTaskCount = (status: string) => {
        if (status === 'all') return tasks.length;
        return tasks.filter(task => task.status === status).length;
    };

    // Get status color
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-gray-100 text-gray-800';
            case 'in-progress': return 'bg-blue-100 text-blue-800';
            case 'completed': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    // Get priority color
    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'bg-red-100 text-red-800';
            case 'medium': return 'bg-yellow-100 text-yellow-800';
            case 'low': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl mb-4 shadow-lg">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6A10AD]"></div>
                    </div>
                    <p className="text-gray-600 font-medium">Loading tasks...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="p-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Tasks</h1>
                    <p className="text-gray-600">Manage and track your project tasks</p>
                </div>

                {/* Error State */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600">Error: {error}</p>
                        <button 
                            onClick={fetchTasks}
                            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {/* Filter Tabs */}
                <div className="mb-6">
                    <div className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm border">
                        {[
                            { key: 'all', label: 'All Tasks' },
                            { key: 'pending', label: 'Pending' },
                            { key: 'in-progress', label: 'In Progress' },
                            { key: 'completed', label: 'Completed' }
                        ].map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setFilter(tab.key as 'all' | 'pending' | 'in-progress' | 'completed')}
                                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                                    filter === tab.key
                                        ? 'bg-[#6A10AD] text-white'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                            >
                                {tab.label} ({getTaskCount(tab.key)})
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tasks Grid */}
                {filteredTasks.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-gray-400 mb-4">
                            <i className="fas fa-tasks text-6xl"></i>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
                        <p className="text-gray-600">
                            {filter === 'all' ? 'No tasks available.' : `No ${filter} tasks found.`}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredTasks.map(task => (
                            <div key={task.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between mb-3">
                                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                                        {task.name}
                                    </h3>
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}>
                                        {task.status.replace('-', ' ')}
                                    </span>
                                </div>
                                
                                {task.description && (
                                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                        {task.description}
                                    </p>
                                )}
                                
                                {task.projectName && (
                                    <div className="flex items-center text-sm text-gray-500 mb-2">
                                        <i className="fas fa-project-diagram mr-2"></i>
                                        {task.projectName}
                                    </div>
                                )}
                                
                                {task.priority && (
                                    <div className="flex items-center mb-3">
                                        <span className={`px-2 py-1 text-xs font-medium rounded ${getPriorityColor(task.priority)}`}>
                                            {task.priority} priority
                                        </span>
                                    </div>
                                )}
                                
                                {task.deadline && (
                                    <div className="flex items-center text-sm text-gray-500">
                                        <i className="fas fa-calendar mr-2"></i>
                                        Due: {new Date(task.deadline).toLocaleDateString()}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}