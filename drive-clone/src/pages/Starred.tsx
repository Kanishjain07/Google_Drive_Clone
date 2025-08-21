import React, { useCallback, useEffect, useState } from 'react';
import Layout from '../components/Layout';
import FileExplorer from '../components/FileExplorer';
import apiService from '../services/api';
import { FileItem } from '../types';

const Starred: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [items, setItems] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadStarred = useCallback(async () => {
    try {
      setLoading(true);

      const [foldersResponse, filesResponse] = await Promise.all([
        apiService.listStarredFolders(),
        apiService.listStarredFiles()
      ]);

      const folders: FileItem[] = (foldersResponse || []).map((folder: any) => ({
        id: folder.id,
        name: folder.name,
        type: 'folder',
        size: '0 items',
        modifiedAt: new Date(folder.updated_at || folder.created_at).toLocaleDateString(),
        owner: 'You',
        mimeType: 'folder',
        starred: folder.is_starred || false
      }));

      const files: FileItem[] = (filesResponse || []).map((file: any) => ({
        id: file.id,
        name: file.name,
        type: 'file',
        size: formatFileSize(file.size),
        modifiedAt: new Date(file.updated_at || file.created_at).toLocaleDateString(),
        owner: 'You',
        mimeType: file.mime_type,
        starred: file.is_starred || false
      }));

      setItems([...folders, ...files]);
    } catch (error) {
      console.error('Failed to load starred items:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStarred();
  }, [loadStarred]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileDelete = async (id: string, type: 'file' | 'folder') => {
    if (type === 'file') await apiService.deleteFile(id); else await apiService.deleteFolder(id);
    await loadStarred();
  };

  return (
    <Layout>
      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <FileExplorer
            files={items}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onFileDelete={handleFileDelete}
            onRefresh={loadStarred}
          />
        )}
      </div>
    </Layout>
  );
};

export default Starred;


