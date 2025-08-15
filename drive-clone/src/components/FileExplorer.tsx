import React, { useState } from 'react';
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
  Plus
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
}

const FileExplorer: React.FC<FileExplorerProps> = ({
  files,
  viewMode,
  onViewModeChange
}) => {
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [showActions, setShowActions] = useState<string | null>(null);

  const onDrop = (acceptedFiles: File[]) => {
    console.log('Dropped files:', acceptedFiles);
    // Handle file upload here
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: false
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

  const handleFileAction = (action: string, fileId: string) => {
    console.log(`Action: ${action} on file: ${fileId}`);
    setShowActions(null);
  };

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
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload files
          </button>
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
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
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">
            {files.length} item{files.length !== 1 ? 's' : ''}
          </span>
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
    </div>
  );
};

export default FileExplorer;