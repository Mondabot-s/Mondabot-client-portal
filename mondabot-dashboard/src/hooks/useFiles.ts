import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useSocket } from './useSocket';

interface FileItem {
  id: string;
  name: string;
  category: string;
  uploader: string;
  clientName?: string;
  uploadDate: string;
  size: string;
  downloadUrl: string;
  cloudinaryId?: string;
  fileType: 'pdf' | 'word' | 'excel' | 'image' | 'other';
  // Add any other fields that might come from Airtable
  [key: string]: unknown;
}

interface UseFilesReturn {
  files: FileItem[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  socketConnected: boolean;
  socketError: string | null;
  uploadFile: (formData: FormData) => Promise<FileItem>;
  deleteFile: (fileId: string) => Promise<void>;
}

// Simple in-memory cache for files
const filesCache = new Map<string, { data: FileItem[]; timestamp: number }>();
const CACHE_DURATION = 30000; // 30 seconds

export const useFiles = (clientName?: string, sortBy?: string): UseFilesReturn => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Use a ref to track file IDs to prevent duplicates - this is more reliable than state
  const fileIdsRef = useRef<Set<string>>(new Set());
  
  // Use a ref to track recently uploaded files - this is more reliable than state for socket handling
  const recentlyUploadedIdsRef = useRef<Set<string>>(new Set());
  
  // Use a ref to track socket update disabling - this is more reliable than state for async operations
  const disableSocketUpdatesRef = useRef<boolean>(false);

  // Initialize Socket.IO connection
  const { socket, connected: socketConnected, error: socketError } = useSocket();

  // Helper function to deduplicate files array
  const deduplicateFiles = (filesArray: FileItem[]): FileItem[] => {
    const uniqueIds = new Set<string>();
    return filesArray.filter(file => {
      if (uniqueIds.has(file.id)) {
        return false;
      }
      uniqueIds.add(file.id);
      return true;
    });
  };

  const fetchFiles = async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);
      
      // Build query parameters
      const params = new URLSearchParams();
      if (clientName) {
        params.append('clientName', clientName);
        // Always include Mondabot files for all users
        params.append('includeMondabot', 'true');
      }
      if (sortBy) {
        params.append('sortBy', sortBy);
      }
      
      const url = `/api/files${params.toString() ? `?${params.toString()}` : ''}`;
      const cacheKey = `${clientName || 'all'}-${sortBy || 'default'}`;
      
      // Check cache first (unless force refresh)
      if (!forceRefresh) {
        const cached = filesCache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
          console.log('📁 Using cached files data');
          
          // Always deduplicate files when setting from cache
          const uniqueFiles = deduplicateFiles(cached.data);
          setFiles(uniqueFiles);
          
          // Update fileIds ref
          fileIdsRef.current = new Set(uniqueFiles.map(file => file.id));
          
          setLoading(false);
          return;
        }
      }
      
      console.log('📁 Fetching fresh files data from API:', {
        url,
        clientName,
        sortBy,
        cacheKey
      });
      const response = await axios.get(url);
      const filesData = response.data;
      
      console.log('📁 Files API response:', {
        status: response.status,
        dataLength: filesData?.length || 0,
        firstFile: filesData?.[0]?.name || 'none',
        clientFilter: clientName || 'none'
      });
      
      // Always deduplicate files from API
      const uniqueFiles = deduplicateFiles(filesData);
      
      // Update cache with deduplicated files
      filesCache.set(cacheKey, {
        data: uniqueFiles,
        timestamp: Date.now()
      });
      
      // Update fileIds ref
      fileIdsRef.current = new Set(uniqueFiles.map(file => file.id));
      
      // Set files state with deduplicated array
      setFiles(uniqueFiles);
    } catch (err: unknown) {
      console.error('Error fetching files:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch files';
      const apiError = axios.isAxiosError(err) ? err.response?.data?.message : null;
      setError(apiError || errorMessage);
      
      // Fallback to empty array if API fails
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (formData: FormData): Promise<FileItem> => {
    try {
      // Completely disable socket updates during upload and for a short period after
      disableSocketUpdatesRef.current = true;
      
      const response = await axios.post('/api/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.data.success) {
        const newFile = response.data.file;
        
        // Invalidate cache for this user/sort combination
        const cacheKey = `${clientName || 'all'}-${sortBy || 'default'}`;
        filesCache.delete(cacheKey);
        
        // Add to local state immediately for better UX
        setFiles(currentFiles => {
          // First check if this file already exists
          const fileExists = currentFiles.some(file => file.id === newFile.id);
          
          if (fileExists) {
            // If file exists, replace it
            return currentFiles.map(file => 
              file.id === newFile.id ? newFile : file
            );
          } else {
            // If file doesn't exist, add it to the beginning
            return [newFile, ...currentFiles];
          }
        });
        
        // Update fileIds ref
        fileIdsRef.current.add(newFile.id);
        
        // Track this ID to prevent socket duplicates
        recentlyUploadedIdsRef.current.add(newFile.id);
        
        console.log('📁 File uploaded and added to local state:', newFile.id);
        
        // Re-enable socket updates after a delay and clear the tracking
        setTimeout(() => {
          disableSocketUpdatesRef.current = false;
          recentlyUploadedIdsRef.current.delete(newFile.id);
        }, 10000); // Use a longer timeout to be safe
        
        return newFile;
      } else {
        disableSocketUpdatesRef.current = false; // Re-enable socket updates on error
        throw new Error(response.data.message || 'Upload failed');
      }
    } catch (err: unknown) {
      disableSocketUpdatesRef.current = false; // Re-enable socket updates on error
      console.error('Error uploading file:', err);
      const errorMessage = err instanceof Error ? err.message : 'File upload failed';
      const apiError = axios.isAxiosError(err) ? err.response?.data?.message : null;
      throw new Error(apiError || errorMessage);
    }
  };

  // Listen for real-time file updates via Socket.IO
  useEffect(() => {
    if (socket) {
      const handleFileUpdate = (updateData: { action: string; file: FileItem }) => {
        console.log('Received real-time file update:', updateData);
        
        // COMPLETELY IGNORE ALL SOCKET EVENTS if we're in the upload cooldown period
        if (disableSocketUpdatesRef.current) {
          console.log('📁 IGNORING ALL socket events during upload cooldown period');
          return;
        }
        
        const { action, file: updatedFile } = updateData;
        
        // IMPORTANT: Completely ignore 'created' events for files we've just uploaded
        if (action === 'created' && recentlyUploadedIdsRef.current.has(updatedFile.id)) {
          console.log('📁 IGNORING socket create event for recently uploaded file:', updatedFile.id);
          return;
        }
        
        // IMPORTANT: Ignore events for files that already exist in our state
        if (action === 'created' && fileIdsRef.current.has(updatedFile.id)) {
          console.log('📁 IGNORING socket create event for existing file:', updatedFile.id);
          return;
        }
        
        setFiles(currentFiles => {
          // Only include files that match the client filter or are Mondabot files
          const matchesClientFilter = () => {
            if (!clientName) return true; // No filter applied
            
            // Handle clientName as either string or array
            if (!updatedFile.clientName) return false;
            
            // Always allow Mondabot files
            if (Array.isArray(updatedFile.clientName)) {
              const hasClientMatch = updatedFile.clientName.some(name => 
                typeof name === 'string' && name.includes(clientName)
              );
              const hasMondabot = updatedFile.clientName.some(name => 
                typeof name === 'string' && name === 'Mondabot'
              );
              return hasClientMatch || hasMondabot;
            }
            
            const hasClientMatch = typeof updatedFile.clientName === 'string' && 
              updatedFile.clientName.includes(clientName);
            const isMondabot = typeof updatedFile.clientName === 'string' && 
              updatedFile.clientName === 'Mondabot';
            
            return hasClientMatch || isMondabot;
          };
          
          if (clientName && !matchesClientFilter()) {
            return currentFiles;
          }
          
          switch (action) {
            case 'created': {
              // Add the file only if it doesn't already exist
              const fileExists = currentFiles.some(f => f.id === updatedFile.id);
              if (fileExists) {
                return currentFiles;
              }
              
              // Update fileIds ref
              fileIdsRef.current.add(updatedFile.id);
              
              // Add new file at the beginning
              return [updatedFile, ...currentFiles];
            }
              
            case 'updated': {
              // Update the file if it exists
              const fileIndex = currentFiles.findIndex(f => f.id === updatedFile.id);
              if (fileIndex >= 0) {
                const newFiles = [...currentFiles];
                newFiles[fileIndex] = updatedFile;
                return newFiles;
              }
              return currentFiles;
            }
              
            case 'deleted': {
              // Remove the file if it exists
              const fileExists = currentFiles.some(f => f.id === updatedFile.id);
              if (fileExists) {
                // Update fileIds ref
                fileIdsRef.current.delete(updatedFile.id);
                
                // Remove the file
                return currentFiles.filter(f => f.id !== updatedFile.id);
              }
              return currentFiles;
            }
              
            default:
              return currentFiles;
          }
        });
      };

      socket.on('files_updated', handleFileUpdate);

      // Cleanup listener on unmount or socket change
      return () => {
        socket.off('files_updated', handleFileUpdate);
      };
    }
  }, [socket, clientName]);

  // Fetch files when clientName or sortBy changes
  useEffect(() => {
    fetchFiles();
  }, [clientName, sortBy]);

  const deleteFile = async (fileId: string): Promise<void> => {
    try {
      const response = await axios.delete(`/api/files/${fileId}`);
      
      if (response.data.success) {
        // Invalidate cache for this user/sort combination
        const cacheKey = `${clientName || 'all'}-${sortBy || 'default'}`;
        filesCache.delete(cacheKey);
        
        // Remove from local state immediately for better UX
        setFiles(currentFiles => currentFiles.filter(file => file.id !== fileId));
        
        // Update fileIds ref
        fileIdsRef.current.delete(fileId);
        
        console.log('📁 File deleted and removed from local state:', fileId);
      } else {
        throw new Error(response.data.message || 'Delete failed');
      }
    } catch (err: unknown) {
      console.error('Error deleting file:', err);
      const errorMessage = err instanceof Error ? err.message : 'File deletion failed';
      const apiError = axios.isAxiosError(err) ? err.response?.data?.message : null;
      throw new Error(apiError || errorMessage);
    }
  };

  // Create a refetch function that forces refresh
  const refetch = () => fetchFiles(true);

  return {
    files,
    loading,
    error,
    refetch,
    socketConnected,
    socketError,
    uploadFile,
    deleteFile,
  };
};