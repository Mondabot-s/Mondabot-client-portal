"use client";

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useFiles } from '@/hooks/useFiles';

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
}

export default function FilesPage() {
  // Authentication setup
  const isAuthEnabled = process.env.NEXT_PUBLIC_ENABLE_AUTHENTICATION === 'true';
  const isClerkConfigured = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  
  const userResult = useUser();
  
  const user = (isAuthEnabled && isClerkConfigured) ? userResult.user : null;
  const isLoaded = (isAuthEnabled && isClerkConfigured) ? userResult.isLoaded : true;
  
  // Get the user's full name for client filtering
  const clientName = user?.fullName || user?.firstName || null;
  
  // Debug logging for user filtering
  console.log('🔍 Files page user data:', {
    isAuthEnabled,
    isClerkConfigured,
    userLoaded: isLoaded,
    userId: user?.id,
    userFullName: user?.fullName,
    userFirstName: user?.firstName,
    clientName,
  });
  
  // File management state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<FileItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [sortBy, setSortBy] = useState('Date');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Use the real files hook with user filtering and delete functionality
  const { files, loading, error, refetch, uploadFile, deleteFile } = useFiles(clientName || undefined, sortBy);

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'pdf':
        return 'fas fa-file-pdf text-xl text-red-500';
      case 'word':
        return 'fas fa-file-word text-xl text-blue-500';
      case 'excel':
        return 'fas fa-file-excel text-xl text-green-500';
      case 'image':
        return 'fas fa-file-image text-xl text-purple-500';
      default:
        return 'fas fa-file text-xl text-slate-500';
    }
  };

  const getCategoryBadgeColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'contract':
        return 'text-xs font-semibold bg-blue-100 text-blue-600 px-2.5 py-1 rounded-full';
      case 'proposal':
        return 'text-xs font-semibold bg-green-100 text-green-600 px-2.5 py-1 rounded-full';
      case 'report':
        return 'text-xs font-semibold bg-purple-100 text-purple-600 px-2.5 py-1 rounded-full';
      case 'invoice':
        return 'text-xs font-semibold bg-orange-100 text-orange-600 px-2.5 py-1 rounded-full';
      default:
        return 'text-xs font-semibold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full';
    }
  };

  // Get user info for display
  const getUserDisplayName = () => {
    if (isAuthEnabled && isClerkConfigured && user) {
      if (user.firstName && user.lastName) {
        return `${user.firstName} ${user.lastName}`;
      }
      if (user.firstName) {
        return user.firstName;
      }
      if (user.emailAddresses?.[0]?.emailAddress) {
        return user.emailAddresses[0].emailAddress;
      }
    }
    return 'Demo User';
  };
  
  // Helper function to determine owner display
  const getOwnerDisplayName = (file: FileItem) => {
    const currentUserName = getUserDisplayName();
    return (file.uploader === currentUserName) ? currentUserName : 'Mondabot';
  };
  
  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All Categories' || file.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDownload = async (file: FileItem) => {
    if (file.downloadUrl && file.downloadUrl !== '#') {
      try {
        // Use the file name as stored in the database (should include extension)
        const fileName = file.name;
        
        console.log(`Downloading file: ${fileName} from URL: ${file.downloadUrl}`);
        
        // For Cloudinary raw files, we need to construct the download URL properly
        let downloadUrl = file.downloadUrl;
        
        // Remove any existing query parameters that might interfere
        const baseUrl = downloadUrl.split('?')[0];
        
        // For Cloudinary raw resources, we need to fetch the file and create a proper download
        // This ensures the file downloads with the correct filename and extension
        
        try {
          // Fetch the file as a blob
          const response = await fetch(baseUrl);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const blob = await response.blob();
          
          // Create a blob URL
          const blobUrl = window.URL.createObjectURL(blob);
          
          // Create a temporary link element to trigger download
          const link = document.createElement('a');
          link.href = blobUrl;
          link.download = fileName; // This will use the correct filename with extension
          link.style.display = 'none';
          
          // Append to body, click, and remove
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          // Clean up the blob URL
          window.URL.revokeObjectURL(blobUrl);
          
        } catch (fetchError) {
          console.error('Error fetching file for download:', fetchError);
          
          // Fallback: try direct link with fl_attachment
          downloadUrl = `${baseUrl}?fl_attachment=${encodeURIComponent(fileName)}`;
          window.open(downloadUrl, '_blank');
        }
        
        console.log(`Download initiated for: ${fileName}`);
      } catch (error) {
        console.error('Error in download handler:', error);
        alert(`Error downloading file: ${file.name}. Please try again.`);
      }
    } else {
      console.log(`Download URL not available for: ${file.name}`);
      alert(`Download URL not available for: ${file.name}`);
    }
  };

  const handleDeleteClick = (file: FileItem) => {
    setFileToDelete(file);
    setShowDeleteModal(true);
    setOpenDropdown(null); // Close the dropdown
  };

  const handleDeleteConfirm = async () => {
    if (!fileToDelete) return;
    
    try {
      setDeleting(true);
      await deleteFile(fileToDelete.id);
      setShowDeleteModal(false);
      setFileToDelete(null);
    } catch (error) {
      console.error('Error deleting file:', error);
      alert(`Failed to delete file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setFileToDelete(null);
  };

  const openUploadModal = () => {
    setShowUploadModal(true);
  };

  const closeUploadModal = () => {
    setShowUploadModal(false);
  };

  // Handle modal animations
  useEffect(() => {
    if (showUploadModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showUploadModal]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (openDropdown) {
        setOpenDropdown(null);
      }
    };

    if (openDropdown) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [openDropdown]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Files & Documents</h1>
          <p className="text-slate-500 mt-1">A central repository for all your contracts, proposals, and reports.</p>
        </div>
        <button 
          onClick={openUploadModal}
          className="bg-pink-600 text-white font-bold py-2.5 px-5 rounded-lg hover:bg-pink-700 transition-colors flex items-center shadow-sm"
        >
          <i className="fas fa-upload mr-2"></i> Upload File
        </button>
      </div>

      {/* Search and Filter Toolbar */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="relative w-full md:w-auto md:flex-1 max-w-lg">
          <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
          <input 
            type="text" 
            placeholder="Search files..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>
        <div className="flex items-center gap-4">
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-slate-300 rounded-lg py-2.5 px-4 text-slate-600 focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            <option>All Categories</option>
            <option>Contract</option>
            <option>Proposal</option>
            <option>Report</option>
            <option>Invoice</option>
          </select>
          <button 
            onClick={() => setSortBy(sortBy === 'Date' ? 'Name' : 'Date')}
            className="text-slate-600 font-medium px-4 py-2.5 rounded-lg flex items-center border border-slate-300 bg-white hover:bg-slate-50"
          >
            <i className="fas fa-sort-amount-down mr-2"></i> {sortBy}
          </button>
        </div>
      </div>

      {/* File List Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200 table-fixed">
          <thead className="bg-slate-50">
            <tr>
              <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider w-[35%]">File Name</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider w-[15%]">Owner</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider w-[15%]">Category</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider w-[15%]">Date Added</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider w-[10%]">Size</th>
              <th scope="col" className="relative px-6 py-3 w-[10%]"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mb-2"></div>
                    <p className="text-slate-500">Loading files...</p>
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center">
                    <i className="fas fa-exclamation-triangle text-red-500 text-2xl mb-2"></i>
                    <p className="text-slate-500 mb-2">Error loading files: {error}</p>
                    <button 
                      onClick={refetch}
                      className="text-pink-600 hover:text-pink-800 font-medium"
                    >
                      Try Again
                    </button>
                  </div>
                </td>
              </tr>
            ) : filteredFiles.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center">
                    <i className="fas fa-folder-open text-slate-400 text-3xl mb-2"></i>
                    <p className="text-slate-500">No files found</p>
                    {searchTerm && (
                      <p className="text-slate-400 text-sm">Try adjusting your search or filters</p>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              filteredFiles.map((file) => (
                <tr key={file.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <i className={getFileIcon(file.fileType)}></i>
                      <span className="ml-4 text-sm font-medium text-slate-800 max-w-[250px] truncate" title={file.name}>
                        {file.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-slate-600 truncate block" title={getOwnerDisplayName(file)}>
                      {getOwnerDisplayName(file)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`${getCategoryBadgeColor(file.category)} truncate inline-block max-w-full`} title={file.category}>
                      {file.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 truncate" title={new Date(file.uploadDate).toLocaleDateString()}>
                    {new Date(file.uploadDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 truncate" title={file.size}>
                    {file.size}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleDownload(file)}
                      className="text-pink-600 hover:text-pink-800 mr-4"
                    >
                      Download
                    </button>
                    <div className="relative inline-block">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenDropdown(openDropdown === file.id ? null : file.id);
                        }}
                        className="text-slate-400 hover:text-slate-600 w-8 h-8 rounded-md flex items-center justify-center hover:bg-slate-100 inline-flex"
                      >
                        <i className="fas fa-ellipsis-v"></i>
                      </button>
                      
                      {/* Dropdown Menu */}
                      {openDropdown === file.id && (
                        <div className="absolute right-0 mt-2 w-32 bg-white border border-slate-200 rounded-lg shadow-lg z-50" style={{ position: 'absolute', zIndex: 50 }}>
                          <button
                            onClick={() => handleDeleteClick(file)}
                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center"
                          >
                            <i className="fas fa-trash mr-2"></i>
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div 
          className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 transition-opacity duration-300 ${
            showUploadModal ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeUploadModal();
            }
          }}
        >
          <div 
            className={`bg-white w-full max-w-md p-8 rounded-2xl shadow-lg transform transition-transform duration-300 ${
              showUploadModal ? 'scale-100' : 'scale-95'
            }`}
          >
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-900">Upload a New File</h2>
              <button 
                onClick={closeUploadModal}
                className="text-slate-400 hover:text-slate-600 text-3xl leading-none"
              >
                &times;
              </button>
            </div>
            <form 
              className="mt-6 space-y-6"
              onSubmit={async (e) => {
                e.preventDefault();
                
                const formData = new FormData(e.currentTarget);
                const fileInput = e.currentTarget.querySelector('input[type="file"]') as HTMLInputElement;
                
                // Check both the file input and selectedFile state
                const file = fileInput?.files?.[0] || selectedFile;
                if (!file) {
                  alert('Please select a file to upload');
                  return;
                }
                
                // If we have selectedFile but the input is empty, update the input
                if (selectedFile && !fileInput?.files?.[0]) {
                  const dt = new DataTransfer();
                  dt.items.add(selectedFile);
                  fileInput.files = dt.files;
                }
                
                // Use the file we already determined
                const fileName = (formData.get('fileName') as string) || file.name;
                const category = formData.get('category') as string;
                
                // Create upload form data  
                const uploadFormData = new FormData();
                uploadFormData.append('file', file); // Use the file we validated above
                uploadFormData.append('fileName', fileName);
                uploadFormData.append('category', category);
                uploadFormData.append('uploader', getUserDisplayName());
                uploadFormData.append('clientName', clientName || '');
                
                try {
                  setUploading(true);
                  await uploadFile(uploadFormData);
                  closeUploadModal();
                  
                  // Reset form safely
                  const form = e.currentTarget;
                  if (form) {
                    form.reset();
                    
                    // Clear file input specifically
                    const fileInput = form.querySelector('input[type="file"]') as HTMLInputElement;
                    if (fileInput) {
                      fileInput.value = '';
                    }
                    
                    // Clear selected file state
                    setSelectedFile(null);
                  }
                } catch (error) {
                  console.error('Upload error:', error);
                  alert(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
                } finally {
                  setUploading(false);
                }
              }}
            >
              <div>
                <label htmlFor="file-name" className="block text-sm font-medium text-slate-700">
                  File Name
                </label>
                <div className="relative mt-1">
                  <input 
                    type="text" 
                    id="file-name"
                    name="fileName"
                    placeholder="e.g., Q3 Performance Report" 
                    className="block w-full rounded-md border border-slate-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm p-3 overflow-hidden text-ellipsis"
                    style={{ textOverflow: 'ellipsis' }}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="file-category" className="block text-sm font-medium text-slate-700">
                  Category
                </label>
                <select 
                  id="file-category"
                  name="category"
                  required
                  className="mt-1 block w-full rounded-md border border-slate-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm p-3"
                >
                  <option>Report</option>
                  <option>Contract</option>
                  <option>Proposal</option>
                  <option>Invoice</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">File</label>
                <div 
                  className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md transition-all duration-200 ${
                    isDragOver 
                      ? 'border-pink-400 bg-pink-50 scale-105' 
                      : 'border-slate-300 hover:border-pink-300'
                  }`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragOver(true);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    setIsDragOver(false);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragOver(false);
                    
                    const files = e.dataTransfer.files;
                    if (files.length > 0) {
                      const file = files[0];
                      setSelectedFile(file);
                      
                      // Update file name input
                      const fileNameInput = document.getElementById('file-name') as HTMLInputElement;
                      if (fileNameInput && !fileNameInput.value) {
                        fileNameInput.value = file.name;
                      }
                      
                      // Update the actual file input
                      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
                      if (fileInput) {
                        try {
                          const dt = new DataTransfer();
                          dt.items.add(file);
                          fileInput.files = dt.files;
                          
                          // Trigger change event to ensure validation
                          const changeEvent = new Event('change', { bubbles: true });
                          fileInput.dispatchEvent(changeEvent);
                        } catch (error) {
                          console.warn('Could not update file input via DataTransfer:', error);
                          // Fallback: the selectedFile state will still work
                        }
                      }
                    }
                  }}
                >
                  {selectedFile ? (
                    // File selected preview
                    <div className="space-y-3 w-full">
                      <div className="flex items-center space-x-3 w-full">
                        <div className="flex-shrink-0">
                          <i className="fas fa-file text-3xl text-green-500"></i>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-slate-700 truncate max-w-full" title={selectedFile.name}>
                            {selectedFile.name}
                          </div>
                          <p className="text-xs text-slate-500">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedFile(null);
                            const fileInput = document.getElementById('file-upload') as HTMLInputElement;
                            if (fileInput) {
                              fileInput.value = '';
                            }
                          }}
                          className="flex-shrink-0 text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-full w-6 h-6 flex items-center justify-center transition-colors"
                        >
                          <i className="fas fa-times text-xs"></i>
                        </button>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-green-600 font-medium">
                          ✓ File ready to upload
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          <label htmlFor="file-upload" className="cursor-pointer text-pink-600 hover:text-pink-500 underline">
                            Choose different file
                          </label>
                        </div>
                      </div>
                      <input 
                        id="file-upload" 
                        name="file-upload" 
                        type="file" 
                        className="sr-only"
                        accept=".pdf,.docx,.doc,.png,.jpg,.jpeg"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setSelectedFile(file);
                            
                            // Update the file name input with the selected file name
                            const fileNameInput = document.getElementById('file-name') as HTMLInputElement;
                            if (fileNameInput && !fileNameInput.value) {
                              fileNameInput.value = file.name;
                            }
                          }
                        }}
                      />
                    </div>
                  ) : (
                    // No file selected - normal upload area
                    <div className="space-y-1 text-center">
                      <i className={`fas fa-cloud-upload-alt text-4xl transition-colors ${
                        isDragOver ? 'text-pink-500' : 'text-slate-400'
                      }`}></i>
                      <div className="flex text-sm text-slate-600">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-pink-600 hover:text-pink-500 focus-within:outline-none">
                          <span>Upload a file</span>
                          <input 
                            id="file-upload" 
                            name="file-upload" 
                            type="file" 
                            className="sr-only"
                            accept=".pdf,.docx,.doc,.png,.jpg,.jpeg"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setSelectedFile(file);
                                
                                // Update the file name input with the selected file name
                                const fileNameInput = document.getElementById('file-name') as HTMLInputElement;
                                if (fileNameInput && !fileNameInput.value) {
                                  fileNameInput.value = file.name;
                                }
                              }
                            }}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className={`text-xs transition-colors ${
                        isDragOver ? 'text-pink-600 font-medium' : 'text-slate-500'
                      }`}>
                        {isDragOver ? 'Drop file here to upload' : 'PDF, DOCX, PNG, JPG up to 10MB'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <button 
                  type="submit" 
                  disabled={uploading}
                  className="w-full bg-pink-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-pink-700 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <i className="fas fa-upload mr-2"></i>
                      <span>Upload and Attach File</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Custom Delete Confirmation Modal */}
      {showDeleteModal && fileToDelete && (
        <div 
          className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 transition-opacity duration-300 ${
            showDeleteModal ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleDeleteCancel();
            }
          }}
        >
          <div 
            className={`bg-white w-full max-w-md p-8 rounded-2xl shadow-lg transform transition-transform duration-300 ${
              showDeleteModal ? 'scale-100' : 'scale-95'
            }`}
          >
            <div className="flex items-center mb-6">
              <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                <i className="fas fa-exclamation-triangle text-red-600 text-xl"></i>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Delete File</h3>
                <p className="text-sm text-slate-500">This action cannot be undone</p>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-slate-700">
                Are you sure you want to delete <span className="font-semibold">&ldquo;{fileToDelete.name}&rdquo;</span>?
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleDeleteCancel}
                disabled={deleting}
                className="flex-1 bg-slate-100 text-slate-700 font-medium py-3 px-4 rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="flex-1 bg-red-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-trash mr-2"></i>
                    <span>Delete File</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}