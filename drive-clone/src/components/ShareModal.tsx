import React, { useState } from 'react';
import {
  X,
  Link as LinkIcon,
  Mail,
  Copy,
  Check,
  Globe,
  Users,
  Lock,
  ChevronDown
} from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileName: string;
  fileType: 'file' | 'folder';
}

const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  fileName,
  fileType
}) => {
  const [emailInput, setEmailInput] = useState('');
  const [permission, setPermission] = useState<'viewer' | 'editor'>('viewer');
  const [linkAccess, setLinkAccess] = useState<'restricted' | 'anyone'>('restricted');
  const [copied, setCopied] = useState(false);
  const [shareLink] = useState('https://drive-clone.app/share/abc123xyz');

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddPerson = () => {
    if (emailInput.trim()) {
      console.log(`Adding ${emailInput} as ${permission}`);
      setEmailInput('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Share "{fileName}"
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Add people */}
        <div className="mb-6">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Add people
          </label>
          <div className="flex space-x-2">
            <div className="flex-1 relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                id="email"
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter email address"
                onKeyPress={(e) => e.key === 'Enter' && handleAddPerson()}
              />
            </div>
            <div className="relative">
              <select
                value={permission}
                onChange={(e) => setPermission(e.target.value as 'viewer' | 'editor')}
                className="block w-full py-2 pl-3 pr-10 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="viewer">Viewer</option>
                <option value="editor">Editor</option>
              </select>
            </div>
          </div>
          <button
            onClick={handleAddPerson}
            disabled={!emailInput.trim()}
            className="mt-2 w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send invite
          </button>
        </div>

        {/* Link sharing */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <LinkIcon className="h-4 w-4 text-gray-400 mr-2" />
              <span className="text-sm font-medium text-gray-900">Get link</span>
            </div>
            <div className="relative">
              <select
                value={linkAccess}
                onChange={(e) => setLinkAccess(e.target.value as 'restricted' | 'anyone')}
                className="text-sm border border-gray-300 rounded-md py-1 pl-2 pr-8 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="restricted">Restricted</option>
                <option value="anyone">Anyone with the link</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-2 mb-2">
            <input
              type="text"
              value={shareLink}
              readOnly
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md bg-gray-50 text-gray-600"
            />
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          </div>

          <div className="flex items-center text-xs text-gray-500">
            {linkAccess === 'restricted' ? (
              <>
                <Lock className="h-3 w-3 mr-1" />
                Only people with access can open with this link
              </>
            ) : (
              <>
                <Globe className="h-3 w-3 mr-1" />
                Anyone on the internet with this link can view
              </>
            )}
          </div>
        </div>

        {/* People with access */}
        <div className="border-t border-gray-200 pt-4 mt-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">People with access</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-primary-500 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-white">You</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">You</p>
                  <p className="text-xs text-gray-500">Owner</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;