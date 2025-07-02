'use client';
export const dynamic = "force-dynamic";

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { mockLogs } from '@/app/features/logs/mockLogs';
import LogsFilters from '@/app/features/logs/LogsFilters';
import LogsTable from '@/app/features/logs/LogsTable';
import LogsPagination from '@/app/features/logs/LogsPagination';
import ActiveFilters from '@/app/features/logs/ActiveFilters';

const itemsPerPage = 10;

const Logs: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState('');

  // Always derive currentPage from searchParams
  const currentPage = useMemo(() => {
    const pageParam = searchParams.get('page');
    const pageNum = pageParam ? parseInt(pageParam, 10) : 1;
    return isNaN(pageNum) || pageNum < 1 ? 1 : pageNum;
  }, [searchParams]);

  // Update URL when page changes
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page > 1) {
      params.set('page', String(page));
    } else {
      params.delete('page');
    }
    router.replace(`?${params.toString()}`);
  };

  const handlePostClick = (postId: string) => {
    // Navigate to internal post list with the specific post highlighted
    // router.push(`/posts?highlight=${postId}`);
    console.log(`Navigate to post list and highlight post ${postId}`);
  };

  const filteredLogs = mockLogs.filter(log => {
    const matchesSearch = 
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.admin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.target && log.target.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLogs = filteredLogs.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('page');
    router.replace(`?${params.toString()}`);
  }, [searchTerm]);

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Activity Logs</h1>
        </div>

        {/* Filters */}
        <LogsFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        {/* Active Filters */}
        <ActiveFilters
          searchTerm={searchTerm}
          onClearSearch={() => setSearchTerm('')}
        />

        {/* Logs Table */}
        <Card>
          <CardContent className="p-0">
            <LogsTable
              logs={currentLogs}
              onPostClick={handlePostClick}
            />
          </CardContent>
        </Card>

        {/* Pagination */}
        <LogsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={mockLogs.length}
          itemsPerPage={itemsPerPage}
          filteredCount={filteredLogs.length}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default Logs; 