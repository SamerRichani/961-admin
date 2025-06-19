"use client"

import { useCallback, useEffect } from 'react';
import { Search, Plus, Shield } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ReportsList } from '@/app/features/moderation/components/ReportsList';
import { ReportDetails } from '@/app/features/moderation/components/ReportDetails';
import { KeywordsList } from '@/app/features/moderation/components/KeywordsList';
import { KeywordDialog } from '@/app/features/moderation/components/KeywordDialog';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  setReports,
  setKeywords,
  setSelectedReport,
  setSearch,
  setActiveTab,
  openKeywordDialog,
} from '@/app/features/moderation/redux/moderationSlice';
import { mockReports, mockBlockedKeywords } from '@/app/features/moderation/redux/moderationSlice';
import type { Report } from '@/app/features/moderation/types';

export function ModerationPage() {
  const dispatch = useAppDispatch();
  const {
    reports,
    keywords,
    selectedReport,
    search,
    activeTab,
    keywordDialog,
  } = useAppSelector((state) => state.moderation);

  useEffect(() => {
    // Initialize with mock data
    dispatch(setReports(mockReports));
    dispatch(setKeywords(mockBlockedKeywords));
  }, [dispatch]);

  const pendingCount = reports.filter(r => r.status === 'pending').length;

  const handleSelectReport = useCallback((report: Report) => {
    dispatch(setSelectedReport(report));
  }, [dispatch]);

  const handleBack = useCallback(() => {
    dispatch(setSelectedReport(null));
  }, [dispatch]);

  if (selectedReport) {
    return (
      <ReportDetails
        report={selectedReport}
        onBack={handleBack}
      />
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-gray-50">
      <div className="bg-white border-b">
        <Tabs value={activeTab} onValueChange={(v) => dispatch(setActiveTab(v as 'reports' | 'keywords'))}>
          <div className="px-4 sm:px-6 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h1 className="text-xl sm:text-2xl font-semibold">Content Moderation</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 rounded-lg">
                  <Shield className="h-5 w-5 text-red-600" />
                  <div>
                    <div className="text-sm font-medium text-red-600">Pending Review</div>
                    <div className="text-2xl font-bold text-red-700">{pendingCount}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-full sm:w-auto overflow-x-auto">
                <TabsList className="h-9 w-max">
                  <TabsTrigger 
                    value="reports"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#FF0000] data-[state=active]:bg-transparent px-4 sm:px-6 text-sm sm:text-base font-medium whitespace-nowrap"
                  >
                    Reports
                  </TabsTrigger>
                  <TabsTrigger 
                    value="keywords"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#FF0000] data-[state=active]:bg-transparent px-4 sm:px-6 text-sm sm:text-base font-medium whitespace-nowrap"
                  >
                    Blocked Keywords
                  </TabsTrigger>
                </TabsList>
              </div>
  
              <div className="relative flex-1 w-full sm:max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder={activeTab === 'reports' ? 'Search reports...' : 'Search keywords...'}
                  value={search}
                  onChange={(e) => dispatch(setSearch(e.target.value))}
                  className="pl-9 h-9 sm:h-10 text-sm"
                />
              </div>
              {activeTab === 'keywords' && (
                <Button
                  className="w-full sm:w-auto bg-[#FF0000] hover:bg-[#CC0000]"
                  onClick={() => dispatch(openKeywordDialog(null))}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Keyword
                </Button>
              )}
            </div>
  
            <div className="mt-4">
              <TabsContent value="reports" className="m-0">
                <ReportsList
                  reports={reports}
                  search={search}
                  onSelectReport={handleSelectReport}
                />
              </TabsContent>
  
              <TabsContent value="keywords" className="m-0">
                <KeywordsList
                  keywords={keywords}
                  search={search}
                />
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>

      <KeywordDialog />
    </div>
  );
}