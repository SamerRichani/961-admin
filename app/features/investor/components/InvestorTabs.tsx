"use client"

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDispatch, useSelector } from 'react-redux';
import { setSearch } from '@/app/features/investor/redux/investorsSlice';
import { setPage } from '@/components/sidebar/redux/navigationSlice';
import { ReactNode } from 'react';
import { RootState } from '@/redux/store';

interface InvestorTabsProps {
  search: string;
  onSearchChange: (value: string) => void;
  children: ReactNode;
}

export function InvestorTabs({ search, onSearchChange, children }: InvestorTabsProps) {
  const dispatch = useDispatch();
  const currentPage = useSelector((state: RootState) => state.navigation.currentPage);
  const activeTab = currentPage === 'investor' ? 'shares' : currentPage.split('/')[1] || 'shares';

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onSearchChange(value);
    dispatch(setSearch(value) as any);
  };

  const handleTabChange = (value: string) => {
    switch (value) {
      case "shares":
        dispatch(setPage("investor"));
        break;
      case "directory":
        dispatch(setPage("investor/directory"));
        break;
      case "updates":
        dispatch(setPage("investor/updates"));
        break;
      case "polls":
        dispatch(setPage("investor/polls"));
        break;
      case "data":
        dispatch(setPage("investor/data"));
        break;
      default:
        dispatch(setPage("investor"));
    }
  };

  return (
    <div className="bg-white border-b">
      <div className="px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h1 className="text-xl sm:text-2xl font-semibold">Investor Portal</h1>
          <Button onClick={() => console.log('Export data')}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-full sm:w-auto overflow-x-auto">
              <TabsList className="h-9 w-max">
                <TabsTrigger
                  value="shares"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#FF0000] data-[state=active]:bg-transparent px-4 sm:px-6 text-sm sm:text-base font-medium whitespace-nowrap"
                >
                  Shares & Pricing
                </TabsTrigger>
                <TabsTrigger
                  value="directory"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#FF0000] data-[state=active]:bg-transparent px-4 sm:px-6 text-sm sm:text-base font-medium whitespace-nowrap"
                >
                  Directory
                </TabsTrigger>
                <TabsTrigger
                  value="updates"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#FF0000] data-[state=active]:bg-transparent px-4 sm:px-6 text-sm sm:text-base font-medium whitespace-nowrap"
                >
                  Updates
                </TabsTrigger>
                <TabsTrigger
                  value="polls"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#FF0000] data-[state=active]:bg-transparent px-4 sm:px-6 text-sm sm:text-base font-medium whitespace-nowrap"
                >
                  Polls
                </TabsTrigger>
                <TabsTrigger
                  value="data"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#FF0000] data-[state=active]:bg-transparent px-4 sm:px-6 text-sm sm:text-base font-medium whitespace-nowrap"
                >
                  Analytics
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="relative flex-1 w-full sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search..."
                value={search}
                onChange={handleSearch}
                className="pl-9 h-9 sm:h-10 text-sm"
              />
            </div>
          </div>
          {children}
        </Tabs>
      </div>
    </div>
  );
} 