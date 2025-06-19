"use client"

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { CreatorsList } from '@/app/features/pulse/components/CreatorsPage/CreatorsList';
import ApplicationsList from '@/app/features/pulse/components/CreatorsPage/ApplicationsList';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { setCreators, setSearch as setCreatorsSearch } from '@/app/features/pulse/redux/creatorsSlice';
import { setSearch as setApplicationsSearch } from '@/app/features/pulse/redux/creatorApplicationsSlice';
import { mockCreators } from '@/app/features/pulse/type';

export function CreatorsPage() {
  const dispatch = useDispatch();
  const { search: creatorsSearch } = useSelector((state: RootState) => state.creators);
  const { search: applicationsSearch } = useSelector((state: RootState) => state.creatorApplications);
  const [activeTab, setActiveTab] = useState('active');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCreators = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pulse/creators?status=active`);
        if (!response.ok) throw new Error('Failed to fetch creators');
        const { data } = await response.json();
        dispatch(setCreators(data));
      } catch (error) {
        console.error('Error fetching creators:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCreators();
  }, [dispatch]);

  const handleSearchChange = (value: string) => {
    if (activeTab === 'active') {
      dispatch(setCreatorsSearch(value));
    } else {
      dispatch(setApplicationsSearch(value));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-[2000px] mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold">Creators</h1>
        </div>

        <Tabs defaultValue="active" onValueChange={setActiveTab}>
          <div className="flex items-center justify-between mb-6">
            <TabsList>
              <TabsTrigger value="active">Active Creators</TabsTrigger>
              <TabsTrigger value="applications">Applications</TabsTrigger>
            </TabsList>

            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder={activeTab === 'active' ? 'Search creators...' : 'Search applications...'}
                value={activeTab === 'active' ? creatorsSearch : applicationsSearch}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-9 w-full"
              />
            </div>
          </div>

          <TabsContent value="active">
            {isLoading ? (
              <div className="text-center py-8">Loading creators...</div>
            ) : (
              <CreatorsList />
            )}
          </TabsContent>
          <TabsContent value="applications">
            <ApplicationsList />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}