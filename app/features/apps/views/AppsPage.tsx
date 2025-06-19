"use client"

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { AppList } from '@/app/features/apps/components/AppsPage/AppList';
import { ReorderList } from '@/app/features/apps/components/AppsPage/ReorderList';
import { MobileApps } from '@/app/features/apps/components/AppsPage/MobileApps';
import { useEffect } from 'react';
import { initialAppState, type App } from '@/app/features/apps/types';
import { AppForm } from '@/app/features/apps/components/AppsPage/AppForm';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  setApps,
  setSearch,
  setViewMode,
  setActiveTab,
  setReorderTab,
  setEditingApp,
  setIsDialogOpen,
  updateApp,
  addApp,
  toggleAppSetting,
  reorderApps,
} from '@/app/features/apps/redux/appsSlice';
import { SearchBar } from '@/app/features/apps/components/AppsPage/SearchBar';
export function AppsPage() {
  const dispatch = useAppDispatch();
  const {
    apps,
    search,
    viewMode,
    activeTab,
    reorderTab,
    editingApp,
    isDialogOpen,
  } = useAppSelector((state) => state.apps);

  // Initialize apps on component mount
  useEffect(() => {
    dispatch(setApps(initialAppState.apps));
  }, [dispatch]);

  const filteredApps = apps.filter(app =>
    app.name.toLowerCase().includes(search.toLowerCase()) ||
    app.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleEditApp = (app: App) => {
    dispatch(setEditingApp(app));
    dispatch(setIsDialogOpen(true));
  };

  const handleSubmit = (data: Partial<App>) => {
    if (editingApp) {
      dispatch(updateApp({ id: editingApp.id, updates: data }));
      dispatch(setEditingApp(null));
    } else {
      dispatch(addApp(data));
    }
    dispatch(setIsDialogOpen(false));
  };

  const handleUpdateApp = (app: App, updates: Partial<App>) => {
    dispatch(updateApp({ id: app.id, updates }));
  };

  const handleDragStart = (app: App) => {
    // Store the dragged app ID in dataTransfer
    const event = window.event as DragEvent;
    if (event.dataTransfer) {
      event.dataTransfer.setData('text/plain', app.id);
    }
  };

  const handleDragOver = (e: React.DragEvent, targetApp: App) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData('text/plain');
    if (draggedId && draggedId !== targetApp.id) {
      dispatch(reorderApps({ sourceId: draggedId, targetId: targetApp.id }));
    }
  };

  const handleDragEnd = () => {
    // Clean up if needed
  };

  return (
    <div className="w-full h-full flex flex-col">
      <Tabs 
        value={activeTab} 
        onValueChange={(value: string) => dispatch(setActiveTab(value as "apps" | "reorder"))} 
        className="w-full"
      >
        <TabsList className="w-full justify-start border-b rounded-none h-12 bg-white px-6 gap-2">
          <TabsTrigger
            value="apps"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#FF0000] data-[state=active]:bg-transparent px-6 text-base font-medium focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
          >
            Apps
          </TabsTrigger>
          <TabsTrigger
            value="reorder"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#FF0000] data-[state=active]:bg-transparent px-6 text-base font-medium focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
          >
            Reorder
          </TabsTrigger>
        </TabsList>

        <TabsContent value="apps" className="px-6 py-6 flex-1">
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-md">
              <SearchBar value={search} onChange={(value: string) => dispatch(setSearch(value))} />
            </div>
            <Dialog open={isDialogOpen} onOpenChange={(open) => dispatch(setIsDialogOpen(open))}>
              <DialogTrigger asChild onClick={() => {
                dispatch(setEditingApp(null));
              }}>
                <Button className="bg-[#FF0000] hover:bg-[#CC0000]">
                  <Plus className="h-4 w-4 mr-2" />
                  App
                </Button>
              </DialogTrigger>
              <DialogContent 
                className="sm:max-w-[500px]" 
                onInteractOutside={(event) => event.preventDefault()}
              >
                <DialogHeader>
                  <DialogTitle>{editingApp ? 'Edit App' : 'Add App'}</DialogTitle>
                </DialogHeader>
                <AppForm
                  app={editingApp || undefined}
                  onSubmit={handleSubmit}
                  onCancel={() => {
                    dispatch(setIsDialogOpen(false));
                    dispatch(setEditingApp(null));
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>
          <div className="mt-6 bg-white rounded-lg w-full">
            <AppList
              apps={filteredApps}
              onToggle={(appId, setting) => dispatch(toggleAppSetting({ id: appId, setting }))}
              onEdit={handleEditApp}
            />
          </div>
        </TabsContent>

        <TabsContent value="reorder" className="px-6 py-6 flex-1">
          <Tabs 
            value={reorderTab} 
            onValueChange={(value: string) => dispatch(setReorderTab(value as "home" | "app"))} 
            className="w-full"
          >
            <TabsList className="w-full justify-start border-b rounded-none h-12 bg-white mb-6 gap-2">
              <TabsTrigger
                value="home"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#FF0000] data-[state=active]:bg-transparent px-6 text-base font-medium focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              >
                Home
              </TabsTrigger>
              <TabsTrigger
                value="app"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#FF0000] data-[state=active]:bg-transparent px-6 text-base font-medium focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              >
                App Page
              </TabsTrigger>
              {reorderTab === 'home' && (
                <div className="ml-auto flex items-center gap-2 bg-gray-100 rounded-full p-1">
                  <button
                    onClick={() => dispatch(setViewMode('mobile'))}
                    className={cn(
                      'px-4 py-1 rounded-full text-sm font-medium transition-colors',
                      viewMode === 'mobile' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                    )}
                  >
                    Mobile
                  </button>
                  <button
                    onClick={() => dispatch(setViewMode('web'))}
                    className={cn(
                      'px-4 py-1 rounded-full text-sm font-medium transition-colors',
                      viewMode === 'web' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                    )}
                  >
                    Web
                  </button>
                </div>
              )}
            </TabsList>
            
            <TabsContent value="home" className="w-full bg-white rounded-lg flex-1">
              <MobileApps
                apps={apps.filter(app => !app.showInMore)}
                moreApps={apps.filter(app => app.showInMore)}
                viewMode={viewMode}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
                onUpdateApp={handleUpdateApp}
              />
            </TabsContent>
            
            <TabsContent value="app" className="w-full bg-white rounded-lg flex-1">
              <ReorderList
                apps={apps}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
              />
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  );
}