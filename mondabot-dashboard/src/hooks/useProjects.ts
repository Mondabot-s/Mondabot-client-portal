import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSocket } from './useSocket';

interface Project {
  id: string;
  projectId?: string;
  name: string;
  status: string;
  deadline?: string | null;
  assignedManager?: string[];
  tasks?: string[];
  clientName?: string;
  // Add any other fields that might come from Airtable
  [key: string]: unknown;
}

interface UseProjectsReturn {
  projects: Project[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  socketConnected: boolean;
  socketError: string | null;
}

export const useProjects = (clientName?: string, sortBy?: string): UseProjectsReturn => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize Socket.IO connection
  const { socket, connected: socketConnected, error: socketError } = useSocket();

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Build query parameters
      const params = new URLSearchParams();
      if (clientName) {
        params.append('clientName', clientName);
      }
      if (sortBy) {
        params.append('sortBy', sortBy);
      }
      
      const url = `/api/projects${params.toString() ? `?${params.toString()}` : ''}`;
      
      const response = await axios.get(url);
      setProjects(response.data);
    } catch (err: unknown) {
      console.error('Error fetching projects:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch projects';
      const apiError = axios.isAxiosError(err) ? err.response?.data?.message : null;
      setError(apiError || errorMessage);
      
      // Fallback to empty array if API fails
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  // Listen for real-time project updates via Socket.IO
  useEffect(() => {
    if (socket) {
      const handleProjectUpdate = (updatedProject: Project) => {
        console.log('Received real-time project update:', updatedProject);
        setProjects(currentProjects => {
          // Only include projects that match the client filter
          if (clientName && updatedProject.clientName !== clientName) {
            return currentProjects;
          }
          
          const existingProjectIndex = currentProjects.findIndex(project => project.id === updatedProject.id);
          if (existingProjectIndex >= 0) {
            // Update existing project
            const newProjects = [...currentProjects];
            newProjects[existingProjectIndex] = { ...newProjects[existingProjectIndex], ...updatedProject };
            return newProjects;
          } else {
            // Add new project
            return [...currentProjects, updatedProject];
          }
        });
      };

      socket.on('projects_updated', handleProjectUpdate);

      // Cleanup listener on unmount or socket change
      return () => {
        socket.off('projects_updated', handleProjectUpdate);
      };
    }
  }, [socket, clientName]);

  useEffect(() => {
    fetchProjects();
  }, [clientName, sortBy]);

  return {
    projects,
    loading,
    error,
    refetch: fetchProjects,
    socketConnected,
    socketError,
  };
};