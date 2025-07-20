import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSocket } from './useSocket';

interface ProjectDetails {
  id: string;
  projectId?: string;
  name: string;
  description?: string;
  status: string;
  startDate?: string;
  estimatedCompletion?: string;
  deadline?: string | null;
  projectManager?: string;
  assignedManager?: string[];
  tasks?: string[];
  clientName?: string;
  milestones?: Milestone[];
  activities?: Activity[];
  files?: ProjectFile[];
  [key: string]: unknown;
}

interface Milestone {
  id: string;
  name: string;
  status: 'completed' | 'in-progress' | 'upcoming';
  order?: number;
}

interface Activity {
  id: string;
  description: string;
  timestamp: string;
  type: string;
}

interface ProjectFile {
  id: string;
  name: string;
  type: string;
  url?: string;
}

interface UseProjectDetailsReturn {
  project: ProjectDetails | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  socketConnected: boolean;
  socketError: string | null;
}

export const useProjectDetails = (projectId: string): UseProjectDetailsReturn => {
  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize Socket.IO connection
  const { socket, connected: socketConnected, error: socketError } = useSocket();

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`/api/projects/${projectId}`);

      // Transform the data to match our expected format
      const projectData = response.data;

      // For now, we'll use mock data for milestones, activities, and files
      // Later we'll implement these from Airtable
      const transformedProject: ProjectDetails = {
        ...projectData,
        description: projectData.description || 'An automation project to streamline your business processes.',
        startDate: projectData.startDate || new Date().toLocaleDateString(),
        estimatedCompletion: projectData.deadline || 'TBD',
        projectManager: projectData.assignedManager?.[0] || 'Sergio Bernal',
        milestones: [
          {
            id: '1',
            name: 'Phase 1: Discovery & Scoping',
            status: 'completed',
            order: 1
          },
          {
            id: '2',
            name: 'Phase 2: Core Development',
            status: projectData.status === 'Building' ? 'in-progress' :
              projectData.status === 'Testing' || projectData.status === 'Live' ? 'completed' : 'upcoming',
            order: 2
          },
          {
            id: '3',
            name: 'Phase 3: Testing & Review',
            status: projectData.status === 'Testing' ? 'in-progress' :
              projectData.status === 'Live' ? 'completed' : 'upcoming',
            order: 3
          },
          {
            id: '4',
            name: 'Phase 4: Deployment & Launch',
            status: projectData.status === 'Live' ? 'completed' : 'upcoming',
            order: 4
          }
        ],
        activities: [
          {
            id: '1',
            description: `Project "${projectData.name}" development is in progress.`,
            timestamp: new Date().toLocaleDateString(),
            type: 'progress'
          },
          {
            id: '2',
            description: 'The project proposal was approved and signed.',
            timestamp: projectData.startDate || new Date().toLocaleDateString(),
            type: 'milestone'
          }
        ],
        files: [
          {
            id: '1',
            name: 'Project Proposal.pdf',
            type: 'pdf',
            url: '#'
          },
          {
            id: '2',
            name: 'Meeting Notes.docx',
            type: 'document',
            url: '#'
          }
        ]
      };

      setProject(transformedProject);
    } catch (err: unknown) {
      console.error('Error fetching project details:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch project details';
      const apiError = axios.isAxiosError(err) ? err.response?.data?.message : null;
      setError(apiError || errorMessage);

      // Set project to null on error
      setProject(null);
    } finally {
      setLoading(false);
    }
  };

  // Listen for real-time project updates via Socket.IO
  useEffect(() => {
    if (socket && project) {
      const handleProjectUpdate = (updatedProject: ProjectDetails) => {
        console.log('Received real-time project update:', updatedProject);
        if (updatedProject.id === projectId) {
          setProject(currentProject => {
            if (!currentProject) return currentProject;
            return { ...currentProject, ...updatedProject };
          });
        }
      };

      socket.on('projects_updated', handleProjectUpdate);

      // Cleanup listener on unmount or socket change
      return () => {
        socket.off('projects_updated', handleProjectUpdate);
      };
    }
  }, [socket, project, projectId]);

  useEffect(() => {
    if (projectId) {
      fetchProjectDetails();
    }
  }, [projectId]);

  return {
    project,
    loading,
    error,
    refetch: fetchProjectDetails,
    socketConnected,
    socketError,
  };
};