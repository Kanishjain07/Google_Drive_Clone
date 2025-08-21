const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Type definitions for API responses
interface LoginResponse {
  access_token: string;
  token_type: string;
}

interface UserResponse {
  id: string;
  email: string;
  name: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

interface FileResponse {
  id: string;
  name: string;
  mime_type: string;
  size: number;
  storage_path: string;
  folder_id?: string;
  owner_id: string;
  is_starred: boolean;
  created_at: string;
  updated_at?: string;
}

interface FolderResponse {
  id: string;
  name: string;
  parent_id?: string;
  owner_id: string;
  is_starred: boolean;
  created_at: string;
  updated_at?: string;
}

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${token}`,
      };
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          // Token invalid/expired or missing -> clear and redirect to login
          try {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('drive-clone-user');
          } catch {}
          // Redirect outside of React tree is acceptable for a global guard
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async signup(name: string, email: string, password: string): Promise<UserResponse> {
    return this.request<UserResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    // Store the token
    if (response.access_token) {
      localStorage.setItem('auth_token', response.access_token);
    }
    
    return response;
  }

  async getCurrentUser(): Promise<UserResponse> {
    return this.request<UserResponse>('/auth/me');
  }

  // File endpoints
  async uploadFile(file: File, folderId?: string): Promise<FileResponse> {
    const formData = new FormData();
    formData.append('file', file);
    if (folderId) {
      formData.append('folder_id', folderId);
    }

    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${this.baseURL}/files/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        try {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('drive-clone-user');
        } catch {}
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Upload failed: ${response.status}`);
    }

    return response.json();
  }

  async listFiles(folderId?: string): Promise<FileResponse[]> {
    const params = folderId ? `?folder_id=${folderId}` : '';
    return this.request<FileResponse[]>(`/files/list${params}`);
  }

  async getFile(fileId: string): Promise<FileResponse> {
    return this.request<FileResponse>(`/files/${fileId}`);
  }

  async deleteFile(fileId: string): Promise<{message: string}> {
    return this.request<{message: string}>(`/files/${fileId}`, {
      method: 'DELETE',
    });
  }

  async toggleFileStar(fileId: string): Promise<{message: string}> {
    return this.request<{message: string}>(`/files/${fileId}/star`, {
      method: 'PUT',
    });
  }

  // Folder endpoints
  async createFolder(name: string, parentId?: string): Promise<FolderResponse> {
    return this.request<FolderResponse>('/folders/create', {
      method: 'POST',
      body: JSON.stringify({ name, parent_id: parentId }),
    });
  }

  async listFolders(parentId?: string): Promise<FolderResponse[]> {
    const params = parentId ? `?parent_id=${parentId}` : '';
    return this.request<FolderResponse[]>(`/folders/list${params}`);
  }

  async getFolder(folderId: string): Promise<FolderResponse> {
    return this.request<FolderResponse>(`/folders/${folderId}`);
  }

  async updateFolder(folderId: string, name: string, parentId?: string): Promise<FolderResponse> {
    return this.request<FolderResponse>(`/folders/${folderId}`, {
      method: 'PUT',
      body: JSON.stringify({ name, parent_id: parentId }),
    });
  }

  async deleteFolder(folderId: string): Promise<{message: string}> {
    return this.request<{message: string}>(`/folders/${folderId}`, {
      method: 'DELETE',
    });
  }

  async toggleFolderStar(folderId: string): Promise<{message: string}> {
    return this.request<{message: string}>(`/folders/${folderId}/star`, {
      method: 'PUT',
    });
  }

  // Trash endpoints
  async listTrashedFiles(): Promise<FileResponse[]> {
    try {
      return this.request<FileResponse[]>('/files/trash');
    } catch (error) {
      console.warn('Trash functionality not available:', error);
      return [];
    }
  }

  async listTrashedFolders(): Promise<FolderResponse[]> {
    try {
      return this.request<FolderResponse[]>('/folders/trash');
    } catch (error) {
      console.warn('Trash functionality not available:', error);
      return [];
    }
  }

  // Starred endpoints
  async listStarredFiles(): Promise<FileResponse[]> {
    return this.request<FileResponse[]>('/files/starred');
  }

  async listStarredFolders(): Promise<FolderResponse[]> {
    return this.request<FolderResponse[]>('/folders/starred');
  }

  // Recent endpoints
  async listRecentFiles(): Promise<FileResponse[]> {
    return this.request<FileResponse[]>('/files/recent');
  }

  async listRecentFolders(): Promise<FolderResponse[]> {
    return this.request<FolderResponse[]>('/folders/recent');
  }

  async restoreFile(fileId: string): Promise<{message: string}> {
    return this.request<{message: string}>(`/files/${fileId}/restore`, {
      method: 'PUT',
    });
  }

  async restoreFolder(folderId: string): Promise<{message: string}> {
    return this.request<{message: string}>(`/folders/${folderId}/restore`, {
      method: 'PUT',
    });
  }

  async permanentlyDeleteFile(fileId: string): Promise<{message: string}> {
    return this.request<{message: string}>(`/files/${fileId}/permanent`, {
      method: 'DELETE',
    });
  }

  async permanentlyDeleteFolder(folderId: string): Promise<{message: string}> {
    return this.request<{message: string}>(`/folders/${folderId}/permanent`, {
      method: 'DELETE',
    });
  }

  // Storage usage
  async getStorageUsage(): Promise<{used: number, total: number}> {
    try {
      // Calculate storage usage from user's files
      const files = await this.listFiles();
      const used = files.reduce((total, file) => total + file.size, 0);
      const total = 15 * 1024 * 1024 * 1024; // 15GB default
      return { used, total };
    } catch (error) {
      console.error('Failed to calculate storage usage:', error);
      return { used: 0, total: 15 * 1024 * 1024 * 1024 };
    }
  }

  // Utility methods
  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('drive-clone-user');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  }
}

export const apiService = new ApiService();
export default apiService;
