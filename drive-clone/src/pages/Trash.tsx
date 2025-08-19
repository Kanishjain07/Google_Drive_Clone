import React, { useState, useEffect, useCallback } from 'react';
import Layout from '../components/Layout';
import {
  Trash2,
  RotateCcw,
  AlertTriangle,
  FileIcon,
  FolderIcon
} from 'lucide-react';
import apiService from '../services/api';
import { FileItem } from '../types';

const Trash: React.FC = () => {
  const [trashedItems, setTrashedItems] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const loadTrashedItems = useCallback(async () => {
    try {
      setLoading(true);
      
      // Load trashed folders
      const foldersResponse = await apiService.listTrashedFolders();
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

      // Load trashed files
      const filesResponse = await apiService.listTrashedFiles();
      const files: FileItem[] = Array.isArray(filesResponse) ? filesResponse.map((file: any) => ({
        id: file.id,
        name: file.name,
        type: 'file' as const,
        size: formatFileSize(file.size),
        modifiedAt: new Date(file.updated_at || file.created_at).toLocaleDateString(),
        owner: 'You',
        mimeType: file.mime_type,
        starred: file.is_starred || false
      })) : [];

      setTrashedItems([...folders, ...files]);
    } catch (error) {
      console.error('Failed to load trashed items:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTrashedItems();
  }, [loadTrashedItems]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleRestore = async (itemId: string, type: 'file' | 'folder') => {
    try {
      if (type === 'file') {
        await apiService.restoreFile(itemId);
      } else {
        await apiService.restoreFolder(itemId);
      }
      await loadTrashedItems();
    } catch (error) {
      console.error('Restore failed:', error);
      alert('Restore failed. Please try again.');
    }
  };

  const handlePermanentDelete = async (itemId: string, type: 'file' | 'folder') => {
    const confirmDelete = window.confirm(
      `Are you sure you want to permanently delete this ${type}? This action cannot be undone.`
    );
    
    if (confirmDelete) {
      try {
        if (type === 'file') {
          await apiService.permanentlyDeleteFile(itemId);
        } else {
          await apiService.permanentlyDeleteFolder(itemId);
        }
        await loadTrashedItems();
      } catch (error) {
        console.error('Permanent delete failed:', error);
        alert('Permanent delete failed. Please try again.');
      }
    }
  };

  const handleBulkRestore = async () => {
    for (const itemId of selectedItems) {
      const item = trashedItems.find(i => i.id === itemId);
      if (item) {
        try {
          await handleRestore(itemId, item.type);
        } catch (error) {
          console.error(`Failed to restore ${item.name}:`, error);
        }
      }
    }
    setSelectedItems([]);
  };

  const handleBulkDelete = async () => {
    const confirmDelete = window.confirm(
      `Are you sure you want to permanently delete ${selectedItems.length} items? This action cannot be undone.`
    );
    
    if (confirmDelete) {
      for (const itemId of selectedItems) {
        const item = trashedItems.find(i => i.id === itemId);
        if (item) {
          try {
            await handlePermanentDelete(itemId, item.type);
          } catch (error) {
            console.error(`Failed to delete ${item.name}:`, error);
          }
        }
      }
      setSelectedItems([]);
    }
  };

  const toggleSelection = (itemId: string) => {
    setSelectedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const getIcon = (type: string, mimeType: string) => {
    if (type === 'folder') {
      return <FolderIcon className="h-8 w-8 text-blue-500" />;
    }
    return <FileIcon className="h-8 w-8 text-gray-500" />;
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Trash2 className="h-6 w-6 mr-2" />
            Trash
          </h1>
          <p className="text-gray-600 mt-1">
            Items in trash will be automatically deleted after 30 days
          </p>
        </div>

        {selectedItems.length > 0 && (
          <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-700">
                {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={handleBulkRestore}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                >
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Restore
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete Forever
                </button>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : trashedItems.length === 0 ? (
          <div className="text-center py-12">
            <Trash2 className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Trash is empty</h3>
            <p className="mt-1 text-sm text-gray-500">
              Deleted files and folders will appear here
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
              <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
                <div className="col-span-1">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === trashedItems.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedItems(trashedItems.map(item => item.id));
                      } else {
                        setSelectedItems([]);
                      }
                    }}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
                <div className="col-span-4">Name</div>
                <div className="col-span-2">Type</div>
                <div className="col-span-2">Deleted</div>
                <div className="col-span-2">Size</div>
                <div className="col-span-1"></div>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {trashedItems.map((item) => (
                <div
                  key={item.id}
                  className={`grid grid-cols-12 gap-4 px-4 py-3 hover:bg-gray-50 ${
                    selectedItems.includes(item.id) ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="col-span-1 flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => toggleSelection(item.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="col-span-4 flex items-center">
                    <div className="flex-shrink-0 mr-3">
                      {getIcon(item.type, item.mimeType)}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{item.name}</span>
                  </div>
                  <div className="col-span-2 flex items-center">
                    <span className="text-sm text-gray-500 capitalize">{item.type}</span>
                  </div>
                  <div className="col-span-2 flex items-center">
                    <span className="text-sm text-gray-500">{item.modifiedAt}</span>
                  </div>
                  <div className="col-span-2 flex items-center">
                    <span className="text-sm text-gray-500">{item.size}</span>
                  </div>
                  <div className="col-span-1 flex items-center justify-end space-x-2">
                    <button
                      onClick={() => handleRestore(item.id, item.type)}
                      className="p-1 rounded-full hover:bg-green-100 text-green-600"
                      title="Restore"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handlePermanentDelete(item.id, item.type)}
                      className="p-1 rounded-full hover:bg-red-100 text-red-600"
                      title="Delete Forever"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {trashedItems.length > 0 && (
          <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Auto-delete reminder
                </h3>
                <p className="mt-1 text-sm text-yellow-700">
                  Items in trash are automatically deleted after 30 days. To free up storage space immediately, 
                  delete items permanently.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Trash;