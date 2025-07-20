export interface AirtableProject {
  id: string;
  fields: {
    'Project ID': string;
    'Project Name': string;
    'Status': 'Building' | 'Live' | 'Testing';
    'ID': number;
    'Deadline': string;
    'Manager (from Assigned Manager)'?: string[];
    'Tasks'?: string[];
  }
}

export interface Project {
  id: string;
  projectId: string;
  name: string;
  status: 'Building' | 'Live' | 'Testing';
  deadline: string | null;
  assignedManager: string[];
  tasks: Task[];
}

export interface Task {
  id: string;
  taskId: string;
  name: string;
}

export interface AirtableTask {
  id: string;
  fields: {
    'Calculation': string;
    'Task Name': string;
    'ID': number;
    'Projects'?: string[];
  }
}

export interface AirtableFile {
  id: string;
  fields: {
    'File Name': string;
    'Category': string;
    'Uploader': string;
    'Client Name'?: string;
    'File URL': string;
    'File Size': string;
    'Cloudinary ID': string;
    'Created': string;
  }
}

export interface FileItem {
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