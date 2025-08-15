import React, { useState } from 'react';
import {
  HardDrive,
  Clock,
  Star,
  Trash2,
  Users,
  Plus,
  FolderPlus,
  Upload,
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onClose }) => {
  const [showNewMenu, setShowNewMenu] = useState(false);

  const navigation = [
    { name: 'My Drive', icon: HardDrive, href: '/', count: null },
    { name: 'Recent', icon: Clock, href: '/recent', count: null },
    { name: 'Starred', icon: Star, href: '/starred', count: null },
    { name: 'Shared with me', icon: Users, href: '/shared', count: null },
    { name: 'Trash', icon: Trash2, href: '/trash', count: 12 },
  ];

  return (
    <>
      {/* Mobile sidebar overlay */}
      {isOpen && (
        <div className="fixed inset-0 flex z-40 md:hidden">
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
            onClick={onClose}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={onClose}
              >
                <span className="sr-only">Close sidebar</span>
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
            <SidebarContent 
              showNewMenu={showNewMenu} 
              setShowNewMenu={setShowNewMenu}
              navigation={navigation}
            />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <SidebarContent 
            showNewMenu={showNewMenu} 
            setShowNewMenu={setShowNewMenu}
            navigation={navigation}
          />
        </div>
      </div>
    </>
  );
};

interface SidebarContentProps {
  showNewMenu: boolean;
  setShowNewMenu: (show: boolean) => void;
  navigation: Array<{
    name: string;
    icon: React.ComponentType<any>;
    href: string;
    count: number | null;
  }>;
}

const SidebarContent: React.FC<SidebarContentProps> = ({ 
  showNewMenu, 
  setShowNewMenu, 
  navigation 
}) => {
  const handleNewClick = () => {
    setShowNewMenu(!showNewMenu);
  };

  return (
    <div className="flex flex-col h-0 flex-1 border-r border-gray-200 bg-white">
      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <svg
                className="h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 5a2 2 0 012-2h4a2 2 0 012 2v1H8V5z"
                />
              </svg>
            </div>
            <span className="ml-2 text-xl font-semibold text-gray-900">
              Drive Clone
            </span>
          </div>
        </div>

        {/* New Button */}
        <div className="mt-6 px-4">
          <div className="relative">
            <button
              type="button"
              className="group relative w-full bg-white border border-gray-300 rounded-md py-3 px-4 flex items-center justify-center text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 shadow-sm"
              onClick={handleNewClick}
            >
              <Plus className="h-5 w-5 mr-2" />
              New
            </button>

            {/* New Menu Dropdown */}
            {showNewMenu && (
              <div className="absolute left-0 mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                <div className="py-1" role="menu">
                  <button
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    <FolderPlus className="h-4 w-4 mr-3" />
                    New folder
                  </button>
                  <div className="border-t border-gray-100"></div>
                  <button
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    <Upload className="h-4 w-4 mr-3" />
                    File upload
                  </button>
                  <button
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    <Upload className="h-4 w-4 mr-3" />
                    Folder upload
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-6 flex-1 px-2 space-y-1">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors"
            >
              <item.icon
                className="text-gray-400 group-hover:text-gray-500 mr-3 flex-shrink-0 h-5 w-5"
                aria-hidden="true"
              />
              <span className="flex-1">{item.name}</span>
              {item.count && (
                <span className="ml-auto inline-block py-0.5 px-2 text-xs rounded-full bg-gray-100 text-gray-600">
                  {item.count}
                </span>
              )}
            </a>
          ))}
        </nav>

        {/* Storage info */}
        <div className="flex-shrink-0 px-4 py-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Storage</span>
              <span>2.1 GB of 15 GB used</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full"
                style={{ width: '14%' }}
              ></div>
            </div>
            <button className="mt-2 text-primary-600 hover:text-primary-700 text-sm font-medium">
              Get more storage
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;