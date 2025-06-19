"use client"

import { type Report } from '@/app/features/moderation/types';
import { Bot, Users } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setFilterBy } from '@/app/features/moderation/redux/moderationSlice';

interface ReportsListProps {
  reports: Report[];
  search: string;
  onSelectReport: (report: Report) => void;
}

type FilterOption = 'all' | 'ai_flagged' | 'user_reported';

export function ReportsList({ reports, search, onSelectReport }: ReportsListProps) {
  const dispatch = useAppDispatch();
  const { filterBy } = useAppSelector((state) => state.moderation);

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.contentPreview.toLowerCase().includes(search.toLowerCase()) ||
      report.reason.toLowerCase().includes(search.toLowerCase()) ||
      report.reporters.some(r => r.name.toLowerCase().includes(search.toLowerCase()));

    switch (filterBy) {
      case 'ai_flagged':
        return matchesSearch && report.aiModerated;
      case 'user_reported':
        return matchesSearch && !report.aiModerated;
      default:
        return matchesSearch;
    }
  });

  return (
    <div className="bg-white rounded-lg">
      <div className="px-4 sm:px-6 py-3 border-b flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
        <Select value={filterBy} onValueChange={(value: FilterOption) => dispatch(setFilterBy(value as FilterOption))}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Reports</SelectItem>
            <SelectItem value="ai_flagged">AI Flagged</SelectItem>
            <SelectItem value="user_reported">User Reported</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="divide-y divide-gray-100">
        {filteredReports.map((report, index) => {
          return (
            <div
              key={report.id}
              className={cn(
                'px-4 sm:px-6 py-3 cursor-pointer transition-all hover:bg-gray-50'
              )}
              onClick={() => onSelectReport(report)}
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                <div className="w-8 text-sm font-medium text-gray-500">#{index + 1}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 truncate">{report.contentPreview}</p>
                </div>
                <div className="flex items-center gap-3 sm:gap-6">
                  {report.aiModerated && <Bot className="h-4 w-4 text-blue-600 flex-shrink-0" />}
                  <span className="flex items-center gap-1 text-sm text-gray-500 flex-shrink-0">
                    <Users className="h-4 w-4" />
                    {report.reporters.length}
                  </span>
                  <span className="text-sm text-gray-500 flex-shrink-0 w-32">
                    {format(new Date(report.reportedAt), 'MMM d, h:mm a')}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredReports.length === 0 && (
        <div className="p-6 sm:p-8 text-center text-gray-500">
          No reports found
        </div>
      )}
    </div>
  );
}