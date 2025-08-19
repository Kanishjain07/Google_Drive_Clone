import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Folder,
  File as FileIcon,
  Image,
  FileText,
  Download,
  Star,
  Share2,
  MoreVertical,
  Grid3X3,
  List,
  Upload,
  Plus,
  Trash2
} from 'lucide-react';

interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size: string;
  modifiedAt: string;
  owner: string;
  mimeType: string;
  starred: boolean;
}

interface FileExplorerProps {
  files: FileItem[];
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  onFileUpload?: (file: File) => Promise<void>;
  onFolderCreate?: (name: string) => Promise<void>;
  onFileDelete?: (fileId: string, type: 'file' | 'folder') => Promise<void>;
  currentFolderId?: string;
  onRefresh?: () => void;
}

const FileExplorer: React.FC<FileExplorerProps> = ({
  files,
  viewMode,
  onViewModeChange,
  onFileUpload,
  onFolderCreate,
  onFileDelete,
  currentFolderId,
  onRefresh
}) => {
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [showActions, setShowActions] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const onDrop = async (acceptedFiles: File[]) => {
    if (!onFileUpload) return;
    
    setUploading(true);
    try {
      for (const file of acceptedFiles) {
        await onFileUpload(file);
      }
      if (onRefresh) {
        await onRefresh();
      }
    } catch (error) {
      console.error('File upload failed:', error);
      alert('File upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true
  });

  const getFileIcon = (mimeType: string, type: string) => {
    if (type === 'folder') {
      return <Folder className="h-8 w-8 text-blue-500" />;
    }

    if (mimeType.startsWith('image/')) {
      return <Image className="h-8 w-8 text-green-500" />;
    }

    if (mimeType.includes('document') || mimeType.includes('text')) {
      return <FileText className="h-8 w-8 text-blue-600" />;
    }

    return <FileIcon className="h-8 w-8 text-gray-500" />;
  };

  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles(prev =>
      prev.includes(fileId)
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const handleFileAction = async (action: string, fileId: string, fileType: 'file' | 'folder' = 'file') => {
    setShowActions(null);
    
    if (action === 'delete') {
      const confirmDelete = window.confirm(`Are you sure you want to delete this ${fileType}? It will be moved to trash.`);
      if (confirmDelete && onFileDelete) {
        try {
          await onFileDelete(fileId, fileType);
          if (onRefresh) {
            await onRefresh();
          }
        } catch (error) {
          console.error('Delete failed:', error);
          alert('Delete failed. Please try again.');
        }
      }
    } else {
      console.log(`Action: ${action} on ${fileType}: ${fileId}`);
    }
  };

  const handleCreateFolder = async () => {
    if (!onFolderCreate || !newFolderName.trim()) return;
    
    try {
      await onFolderCreate(newFolderName.trim());
      setNewFolderName('');
      setShowNewFolderModal(false);
      if (onRefresh) {
        await onRefresh();
      }
    } catch (error) {
      console.error('Folder creation failed:', error);
      alert('Folder creation failed. Please try again.');
    }
  };

  const handleUploadClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files) {
        onDrop(Array.from(files));
        // Clear the input value so the same file can be selected again later
        (e.target as HTMLInputElement).value = '';
      }
    };
    input.click();
  };

  // Listen for custom events from sidebar
  useEffect(() => {
    const handleCreateNewFolder = () => {
      setShowNewFolderModal(true);
    };

    const handleUploadFiles = () => {
      handleUploadClick();
    };

    window.addEventListener('createNewFolder', handleCreateNewFolder);
    window.addEventListener('uploadFiles', handleUploadFiles);

    return () => {
      window.removeEventListener('createNewFolder', handleCreateNewFolder);
      window.removeEventListener('uploadFiles', handleUploadFiles);
    };
  }, []);

  if (files.length === 0) {
    return (
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
          isDragActive
            ? 'border-primary-400 bg-primary-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No files yet</h3>
        <p className="mt-1 text-sm text-gray-500">
          {isDragActive
            ? 'Drop files here to upload'
            : 'Get started by uploading your first file or folder'}
        </p>
        <div className="mt-6 flex justify-center space-x-3">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            onClick={(e) => { e.stopPropagation(); handleUploadClick(); }}
            disabled={uploading}
          >
            <Upload className="h-4 w-4 mr-2" />
            {uploading ? 'Uploading...' : 'Upload files'}
          </button>
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            onClick={(e) => { e.stopPropagation(); setShowNewFolderModal(true); }}
          >
            <Plus className="h-4 w-4 mr-2" />
            New folder
          </button>
        </div>
      </div>
    );
  }

  return (
    <div {...getRootProps()} className="space-y-4">
      <input {...getInputProps()} />
      
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500">
            {files.length} item{files.length !== 1 ? 's' : ''}
          </span>
          
          <div className="flex items-center space-x-2">
            <button
              type="button"
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              onClick={(e) => { e.stopPropagation(); handleUploadClick(); }}
              disabled={uploading}
            >
              <Upload className="h-4 w-4 mr-1" />
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
            <button
              type="button"
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              onClick={(e) => { e.stopPropagation(); setShowNewFolderModal(true); }}
            >
              <Plus className="h-4 w-4 mr-1" />
              New folder
            </button>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              type="button"
              className={`p-1.5 rounded-md ${
                viewMode === 'grid'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
              onClick={() => onViewModeChange('grid')}
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
            <button
              type="button"
              className={`p-1.5 rounded-md ${
                viewMode === 'list'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
              onClick={() => onViewModeChange('list')}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* File Grid/List */}
      {viewMode === 'grid' ? (
        <div
          className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 ${
            isDragActive ? 'bg-primary-50 border-2 border-dashed border-primary-400 rounded-lg p-4' : ''
          }`}
        >
          {files.map((file) => (
            <div
              key={file.id}
              className={`group relative bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer ${
                selectedFiles.includes(file.id) ? 'ring-2 ring-primary-500 bg-primary-50' : ''
              }`}
              onClick={() => toggleFileSelection(file.id)}
            >
              <div className="flex flex-col items-center">
                <div className="mb-2">
                  {getFileIcon(file.mimeType, file.type)}
                </div>
                <h3 className="text-sm font-medium text-gray-900 text-center line-clamp-2 mb-1">
                  {file.name}
                </h3>
                <p className="text-xs text-gray-500">{file.size}</p>
                <p className="text-xs text-gray-400">{file.modifiedAt}</p>
              </div>
              
              {/* Actions */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="relative">
                  <button
                    type="button"
                    className="p-1 rounded-full bg-white shadow-sm hover:bg-gray-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowActions(showActions === file.id ? null : file.id);
                    }}
                  >
                    <MoreVertical className="h-4 w-4 text-gray-400" />
                  </button>
                  
                  {showActions === file.id && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                      <div className="py-1">
                        <button
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFileAction('download', file.id);
                          }}
                        >
                          <Download className="h-4 w-4 mr-3" />
                          Download
                        </button>
                        <button
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFileAction('share', file.id);
                          }}
                        >
                          <Share2 className="h-4 w-4 mr-3" />
                          Share
                        </button>
                        <button
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFileAction('star', file.id);
                          }}
                        >
                          <Star className={`h-4 w-4 mr-3 ${file.starred ? 'text-yellow-400 fill-current' : ''}`} />
                          {file.starred ? 'Unstar' : 'Star'}
                        </button>
                        <button
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFileAction('delete', file.id, file.type);
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-3" />
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Star indicator */}
              {file.starred && (
                <div className="absolute top-2 left-2">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className={`bg-white rounded-lg border border-gray-200 overflow-hidden ${
          isDragActive ? 'bg-primary-50 border-primary-400' : ''
        }`}>
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
              <div className="col-span-5">Name</div>
              <div className="col-span-2">Owner</div>
              <div className="col-span-2">Modified</div>
              <div className="col-span-2">Size</div>
              <div className="col-span-1"></div>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {files.map((file) => (
              <div
                key={file.id}
                className={`grid grid-cols-12 gap-4 px-4 py-3 hover:bg-gray-50 cursor-pointer ${
                  selectedFiles.includes(file.id) ? 'bg-primary-50' : ''
                }`}
                onClick={() => toggleFileSelection(file.id)}
              >
                <div className="col-span-5 flex items-center">
                  <div className="flex-shrink-0 mr-3">
                    {getFileIcon(file.mimeType, file.type)}
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900">{file.name}</span>
                    {file.starred && (
                      <Star className="h-4 w-4 text-yellow-400 fill-current ml-2" />
                    )}
                  </div>
                </div>
                <div className="col-span-2 flex items-center">
                  <span className="text-sm text-gray-500">{file.owner}</span>
                </div>
                <div className="col-span-2 flex items-center">
                  <span className="text-sm text-gray-500">{file.modifiedAt}</span>
                </div>
                <div className="col-span-2 flex items-center">
                  <span className="text-sm text-gray-500">{file.size}</span>
                </div>
                <div className="col-span-1 flex items-center justify-end">
                  <div className="relative">
                    <button
                      type="button"
                      className="p-1 rounded-full hover:bg-gray-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowActions(showActions === file.id ? null : file.id);
                      }}
                    >
                      <MoreVertical className="h-4 w-4 text-gray-400" />
                    </button>
                    
                    {showActions === file.id && (
                      <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                        <div className="py-1">
                          <button
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFileAction('download', file.id);
                            }}
                          >
                            <Download className="h-4 w-4 mr-3" />
                            Download
                          </button>
                          <button
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFileAction('share', file.id);
                            }}
                          >
                            <Share2 className="h-4 w-4 mr-3" />
                            Share
                          </button>
                          <button
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFileAction('star', file.id);
                            }}
                          >
                            <Star className={`h-4 w-4 mr-3 ${file.starred ? 'text-yellow-400 fill-current' : ''}`} />
                            {file.starred ? 'Unstar' : 'Star'}
                          </button>
                          <button
                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFileAction('delete', file.id, file.type);
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-3" />
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {isDragActive && (
        <div className="fixed inset-0 bg-primary-500 bg-opacity-20 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <Upload className="mx-auto h-12 w-12 text-primary-600" />
            <p className="mt-2 text-lg font-medium text-gray-900">Drop files to upload</p>
          </div>
        </div>
      )}

      {/* New Folder Modal */}
      {showNewFolderModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Folder</h3>
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Folder name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleCreateFolder();
                }
              }}
              autoFocus
            />
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                onClick={() => {
                  setShowNewFolderModal(false);
                  setNewFolderName('');
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                onClick={handleCreateFolder}
                disabled={!newFolderName.trim()}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileExplorer;