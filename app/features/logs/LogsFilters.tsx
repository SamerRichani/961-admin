import React from 'react';
import { Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface LogsFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const LogsFilters: React.FC<LogsFiltersProps> = ({
  searchTerm,
  onSearchChange
}) => {
  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search logs by action, admin, or details..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default LogsFilters; 