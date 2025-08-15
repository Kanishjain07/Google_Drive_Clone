import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  name: string;
  path: string;
}

interface BreadcrumbsProps {
  path: BreadcrumbItem[];
  onNavigate?: (path: string) => void;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ path, onNavigate }) => {
  const handleClick = (itemPath: string) => {
    if (onNavigate) {
      onNavigate(itemPath);
    }
  };

  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1">
        {path.map((item, index) => (
          <li key={item.path} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="flex-shrink-0 h-4 w-4 text-gray-400 mx-2" />
            )}
            
            {index === 0 && (
              <Home className="flex-shrink-0 h-4 w-4 text-gray-400 mr-2" />
            )}
            
            {index === path.length - 1 ? (
              <span className="text-sm font-medium text-gray-900">
                {item.name}
              </span>
            ) : (
              <button
                type="button"
                className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
                onClick={() => handleClick(item.path)}
              >
                {item.name}
              </button>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;