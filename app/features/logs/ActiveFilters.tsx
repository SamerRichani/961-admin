import React from 'react';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ActiveFiltersProps {
  searchTerm: string;
  onClearSearch: () => void;
}

const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  searchTerm,
  onClearSearch
}) => {
  if (!searchTerm) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600">Active filters:</span>
        <Badge variant="outline" className="flex items-center space-x-1">
          <span>Search: "{searchTerm}"</span>
          <button
            onClick={onClearSearch}
            className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
          >
            <X className="w-3 h-3" />
          </button>
        </Badge>
      </div>
    </div>
  );
};

export default ActiveFilters; 