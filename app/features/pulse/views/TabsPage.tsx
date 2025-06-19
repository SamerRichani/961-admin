"use client"

import { useState, useEffect } from 'react';
import { Search, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { TabsList as SortableTabsList } from '@/app/features/pulse/components/TabsPage/TabsList';
import { TabDialog } from '@/app/features/pulse/components/TabsPage/TabDialog';
import { useDispatch, useSelector } from 'react-redux';
import { setEditingTab, deleteTab, setTabs, setDialogOpen } from '@/app/features/pulse/redux/tabsSlice';
import { RootState } from '@/redux/store';
import type { Tab } from '@/app/features/pulse/redux/tabsSlice';

export default function TabsPage() {
  const [search, setSearch] = useState('');
  const dispatch = useDispatch();
  const { tabs, isDialogOpen } = useSelector((state: RootState) => state.tabs);

  const fetchTabs = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pulse/tabs`);
      if (!response.ok) {
        throw new Error('Failed to fetch tabs');
      }
      const { data } = await response.json();
      // Transform the API response to match our Tab interface
      const transformedTabs = data.map((tab: any) => ({
        id: tab._id,
        name: tab.name,
        description: tab.description,
        icon: tab.icon,
        keywords: tab.keywords,
        isSeasonal: tab.isSeasonal,
        isPaused: tab.isPaused,
        isAd: tab.isAd,
        metrics: tab.metrics,
        content: tab.content,
        order: tab.order
      }));
      dispatch(setTabs(transformedTabs));
    } catch (error) {
      console.error('Error fetching tabs:', error);
    }
  };

  const createTab = async (tabData: Omit<Tab, 'id'>) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pulse/tabs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tabData),
      });

      if (!response.ok) {
        throw new Error('Failed to create tab');
      }

      const newTab = await response.json();
      // Transform the API response to match our Tab interface
      const transformedTab = {
        id: newTab._id,
        name: newTab.name,
        description: newTab.description,
        icon: newTab.icon,
        keywords: newTab.keywords,
        isSeasonal: newTab.isSeasonal,
        isPaused: newTab.isPaused,
        isAd: newTab.isAd,
        metrics: newTab.metrics,
        content: newTab.content,
        order: newTab.order
      };

      // Update local state with the new tab
      dispatch(setTabs([...tabs, transformedTab]));
      return transformedTab;
    } catch (error) {
      console.error('Error creating tab:', error);
      throw error;
    }
  };

  const deleteTabFromAPI = async (tabId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pulse/tabs/${tabId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete tab');
      }

      // Update local state by removing the deleted tab
      dispatch(setTabs(tabs.filter(tab => tab.id !== tabId)));
    } catch (error) {
      console.error('Error deleting tab:', error);
      throw error;
    }
  };

  const reorderTabs = async (reorderedTabs: Tab[]) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pulse/tabs/reorder`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tabs: reorderedTabs.map((tab, index) => ({
            id: tab.id,
            order: index + 1
          }))
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to reorder tabs');
      }

      const data = await response.json();
      // Transform the API response to match our Tab interface
      const transformedTabs = data.map((tab: any) => ({
        id: tab._id,
        name: tab.name,
        description: tab.description,
        icon: tab.icon,
        keywords: tab.keywords,
        isSeasonal: tab.isSeasonal,
        isPaused: tab.isPaused,
        isAd: tab.isAd,
        metrics: tab.metrics,
        content: tab.content,
        order: tab.order
      }));

      // Update local state with the reordered tabs
      dispatch(setTabs(transformedTabs));
    } catch (error) {
      console.error('Error reordering tabs:', error);
      throw error;
    }
  };

  const updateTab = async (tabId: string, tabData: Partial<Tab>) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pulse/tabs/${tabId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tabData),
      });

      if (!response.ok) {
        throw new Error('Failed to update tab');
      }

      const updatedTab = await response.json();
      // Transform the API response to match our Tab interface
      const transformedTab = {
        id: updatedTab._id,
        name: updatedTab.name,
        description: updatedTab.description,
        icon: updatedTab.icon,
        keywords: updatedTab.keywords,
        isSeasonal: updatedTab.isSeasonal,
        isPaused: updatedTab.isPaused,
        isAd: updatedTab.isAd,
        metrics: updatedTab.metrics,
        content: updatedTab.content,
        order: updatedTab.order
      };

      // Update local state with the updated tab
      dispatch(setTabs(tabs.map(tab => tab.id === tabId ? transformedTab : tab)));
      return transformedTab;
    } catch (error) {
      console.error('Error updating tab:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (tabs.length === 0) {
      fetchTabs();
    }
  }, [dispatch, tabs.length]);

  const handleEditTab = (tab: Tab) => {
    dispatch(setEditingTab(tab));
    dispatch(setDialogOpen(true));
  };

  const handleUpdateTab = async (tab: Tab) => {
    try {
      await updateTab(tab.id, tab);
      dispatch(setDialogOpen(false));
    } catch (error) {
      console.error('Failed to update tab:', error);
    }
  };

  const handleAddTab = async (tabData: Omit<Tab, 'id'>) => {
    try {
      await createTab(tabData);
      dispatch(setDialogOpen(false));
    } catch (error) {
      console.error('Failed to add tab:', error);
    }
  };

  const handleDeleteTab = async (tabId: string) => {
    try {
      await deleteTabFromAPI(tabId);
    } catch (error) {
      console.error('Failed to delete tab:', error);
    }
  };

  const handleTabsReorder = async (items: Tab[]) => {
    try {
      await reorderTabs(items);
    } catch (error) {
      console.error('Failed to reorder tabs:', error);
    }
  };

  const handleDialogOpenChange = (open: boolean) => {
    dispatch(setDialogOpen(open));
  };

  const filteredTabs = tabs.filter(tab =>
    tab.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-[2000px] mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-semibold">Feed Tabs Management</h1>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search tabs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 w-full"
              />
            </div>
            <Button
              onClick={() => {
                dispatch(setEditingTab(null));
                dispatch(setDialogOpen(true));
              }}
              className="bg-[#FF0000] hover:bg-[#CC0000] w-full sm:w-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Tab
            </Button>
          </div>
        </div>

        <Card className="p-4 sm:p-6">
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              <SortableTabsList
                tabs={filteredTabs}
                onReorder={handleTabsReorder}
                onEdit={handleEditTab}
                onDelete={handleDeleteTab}
              />
            </div>
          </div>
        </Card>

        <TabDialog
          open={isDialogOpen}
          onOpenChange={handleDialogOpenChange}
          onSave={handleUpdateTab}
        />
      </div>
    </div>
  );
}