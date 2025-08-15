// Common types used throughout the application

export interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size: string;
  modifiedAt: string;
  owner: string;
  mimeType: string;
  starred: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}
