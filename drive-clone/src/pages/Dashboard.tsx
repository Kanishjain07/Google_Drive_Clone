import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import FileExplorer from '../components/FileExplorer';
import Breadcrumbs from '../components/Breadcrumbs';
import apiService from '../services/api';
import { FileItem } from '../types';

const Dashboard: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPath] = useState([
    { name: 'My Drive', path: '/' }
  ]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentFolderId, setCurrentFolderId] = useState<string | undefined>(undefined);

  useEffect(() => {
    loadFilesAndFolders();
  }, [currentFolderId]);

  const loadFilesAndFolders = async () => {
    try {
      setLoading(true);
      
      // Load folders
      const foldersResponse = await apiService.listFolders(currentFolderId);
      const folders: FileItem[] = Array.isArray(foldersResponse) ? foldersResponse.map((folder: any) => ({
        id: folder.id,
        name: folder.name,
        type: 'folder' as const,
        size: '0 items',
        modifiedAt: new Date(folder.updated_at || folder.created_at).toLocaleDateString(),
        owner: 'You',
        mimeType: 'folder',
        starred: folder.is_starred || false
      })) : [];

      // Load files
      const filesResponse = await apiService.listFiles(currentFolderId);
      const filesData: FileItem[] = Array.isArray(filesResponse) ? filesResponse.map((file: any) => ({
        id: file.id,
        name: file.name,
        type: 'file' as const,
        size: formatFileSize(file.size),
        modifiedAt: new Date(file.updated_at || file.created_at).toLocaleDateString(),
        owner: 'You',
        mimeType: file.mime_type,
        starred: file.is_starred || false
      })) : [];

      setFiles([...folders, ...filesData]);
    } catch (error) {
      console.error('Failed to load files and folders:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Layout>
      <div className="p-6">
        {/* Breadcrumbs */}
        <Breadcrumbs path={currentPath} />
        
        {/* File Explorer */}
        <div className="mt-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <FileExplorer
              files={files}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;