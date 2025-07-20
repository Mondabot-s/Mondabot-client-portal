"use client";

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Check, Hammer, TestTube, Rocket, Circle, FileText, File, Loader2 } from 'lucide-react';
import { useProjectDetails } from '../../../hooks/useProjectDetails';

interface Project {
  id: string;
  name: string;
  status: string;
  deadline?: string | null;
  assignedManager?: string[];
  clientName?: string;
  description?: string;
  [key: string]: unknown;
}

// Project Header Component
const ProjectHeader = ({ project }: { project: Project }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'in progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'testing':
        return 'bg-yellow-100 text-yellow-800';
      case 'live':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex justify-between items-start">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">{project.name}</h1>
        <p className="text-slate-500 mt-1 max-w-2xl">{project.description}</p>
      </div>
      <span className={`text-sm font-semibold px-4 py-1.5 rounded-full ${getStatusColor(project.status)}`}>
        {project.status}
      </span>
    </div>
  );
};

// Project Info Component
const ProjectInfo = ({ project }: { project: Project }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6 border-t border-b border-slate-200 py-6">
      <div>
        <p className="text-sm text-slate-500">Start Date</p>
        <p className="font-semibold text-slate-800 mt-1">{String(project.startDate) || 'Not specified'}</p>
      </div>
      <div>
        <p className="text-sm text-slate-500">Estimated Completion</p>
        <p className="font-semibold text-slate-800 mt-1">{String(project.estimatedCompletion) || 'Not specified'}</p>
      </div>
      <div>
        <p className="text-sm text-slate-500">Project Manager</p>
        <p className="font-semibold text-slate-800 mt-1">{String(project.projectManager) || 'Not assigned'}</p>
      </div>
    </div>
  );
};

// Project Milestones Component
const ProjectMilestones = ({ projectStatus }: { projectStatus: string }) => {
  // Fixed 4-phase milestones structure
  const milestones = [
    {
      id: '1',
      title: 'Phase 1: Discovery & Scoping',
      icon: Check
    },
    {
      id: '2',
      title: 'Phase 2: Core Development',
      icon: Hammer
    },
    {
      id: '3',
      title: 'Phase 3: Testing & Review',
      icon: TestTube
    },
    {
      id: '4',
      title: 'Phase 4: Deployment & Launch',
      icon: Rocket
    }
  ];

  // Determine milestone status based on project status
  const getMilestoneStatus = (index: number, status: string) => {
    const statusPhases = {
      'Planning': 0, // Phase 1: Discovery & Planning
      'Building': 1, // Phase 2: Core Development & Integration 
      'Quality Control': 2, // Phase 3: Testing, Review & Refinement
      'Live': 3 // Phase 4: Deployment & Launch
    };
    
    const currentPhase = statusPhases[status as keyof typeof statusPhases] ?? -1;
    
    if (index < currentPhase) {
      return 'completed';
    } else if (index === currentPhase) {
      return 'in-progress';
    } else {
      return 'pending';
    }
  };

  const getMilestoneStyle = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          bg: 'bg-green-500',
          text: 'text-slate-700',
          icon: 'text-white'
        };
      case 'in-progress':
        return {
          bg: 'bg-blue-500',
          text: 'text-slate-800',
          icon: 'text-white'
        };
      default:
        return {
          bg: 'bg-slate-300',
          text: 'text-slate-400',
          icon: 'text-slate-500'
        };
    }
  };

  return (
    <div>
      <h3 className="font-bold text-lg text-slate-800">Project Milestones</h3>
      <ul className="mt-4 space-y-5">
        {milestones.map((milestone, index) => {
          const milestoneStatus = getMilestoneStatus(index, projectStatus);
          const style = getMilestoneStyle(milestoneStatus);
          const IconComponent = milestone.icon;
          
          return (
            <li key={milestone.id} className="flex items-center">
              <span className={`h-8 w-8 rounded-full ${style.bg} flex items-center justify-center ring-4 ring-white flex-shrink-0`}>
                <IconComponent className={`w-4 h-4 ${style.icon}`} />
              </span>
              <span className={`ml-4 font-medium ${style.text}`}>{milestone.title}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

// Recent Activity Component
const RecentActivity = ({ activities }: { activities: Array<{id: string; type: string; message: string; date: string;}> }) => {
  const getActivityColor = (type: string) => {
    switch (type) {
      case 'progress':
        return 'text-blue-500';
      case 'milestone':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="mt-10 pt-6 border-t border-slate-200">
      <h3 className="font-bold text-lg text-slate-800">Recent Activity</h3>
      <ul className="mt-4 space-y-4 text-sm">
        {activities.map((activity) => (
          <li key={activity.id} className="flex items-start">
            <Circle className={`w-1.5 h-1.5 mt-2 mr-4 flex-shrink-0 ${getActivityColor(activity.type)}`} fill="currentColor" />
            <div>
              <span className="font-semibold">{activity.message}</span>
              <span className="text-slate-500 ml-2">{activity.date}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Project Files Component
const ProjectFiles = ({ files }: { files: Array<{id: string; name: string; type: string; uploadDate: string;}> }) => {
  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <File className="w-5 h-5 text-pink-600" />;
      default:
        return <FileText className="w-5 h-5 text-pink-600" />;
    }
  };

  return (
    <div className="bg-slate-50 p-6 rounded-lg h-fit">
      <h3 className="font-bold text-lg text-slate-800">Project Files</h3>
      <ul className="mt-4 space-y-3">
        {files.map((file) => (
          <li key={file.id}>
            <a 
              href={`#file-${file.id}`} 
              className="flex items-center p-2 rounded-md hover:bg-slate-200 transition-colors"
            >
              {getFileIcon(file.type)}
              <span className="font-medium text-sm text-slate-700 ml-3">{file.name}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Main Project Details Page Component
export default function ProjectDetailsPage() {
  const params = useParams();
  const projectId = params.id as string;

  // Use the custom hook to fetch project details
  const { project, loading, error, refetch } = useProjectDetails(projectId);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="p-8">
          <section id="project-details">
            {/* Back Navigation */}
            <div className="mb-6">
              <Link 
                href="/automations" 
                className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to All Projects
              </Link>
            </div>

            {/* Loading Card */}
            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600 mr-3" />
                <span className="text-lg text-slate-600">Loading project details...</span>
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="p-8">
          <section id="project-details">
            {/* Back Navigation */}
            <div className="mb-6">
              <Link 
                href="/automations" 
                className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to All Projects
              </Link>
            </div>

            {/* Error Card */}
            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Project</h3>
                <p className="text-gray-600 mb-4">{error}</p>
                <button 
                  onClick={refetch}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }

  // No project found
  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="p-8">
          <section id="project-details">
            {/* Back Navigation */}
            <div className="mb-6">
              <Link 
                href="/automations" 
                className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to All Projects
              </Link>
            </div>

            {/* Not Found Card */}
            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Project Not Found</h3>
                <p className="text-gray-600 mb-4">The project you&apos;re looking for doesn&apos;t exist or you don&apos;t have access to it.</p>
                <Link 
                  href="/automations"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-block"
                >
                  Back to Projects
                </Link>
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-8">
        <section id="project-details">
          {/* Back Navigation */}
          <div className="mb-6">
            <Link 
              href="/automations" 
              className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to All Projects
            </Link>
          </div>

          {/* Main Content Card */}
          <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
            {/* Project Header */}
            <ProjectHeader project={project} />
            
            {/* Project Info */}
            <ProjectInfo project={project} />
            
            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
              {/* Left Column: Milestones & Activity */}
              <div className="lg:col-span-2">
                <ProjectMilestones projectStatus={project.status} />
                <RecentActivity activities={(project.activities as unknown) as Array<{id: string; type: string; message: string; date: string;}> || []} />
              </div>
              
              {/* Right Column: Files */}
              <ProjectFiles files={(project.files as unknown) as Array<{id: string; name: string; type: string; uploadDate: string;}> || []} />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}