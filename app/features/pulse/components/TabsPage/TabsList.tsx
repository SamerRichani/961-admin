import { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, GripVertical, Calendar, Megaphone, Sparkles, PauseCircle, Heart, MessageSquare, Send, MoreHorizontal, Image, MapPin, Trash2 } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import type { Tab } from '@/app/features/pulse/redux/tabsSlice';
import { deleteTab, setTabs } from '@/app/features/pulse/redux/tabsSlice';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface SortableItemProps {
  tab: Tab;
  onEdit: (tab: Tab) => void;
  onDelete: (tabId: string) => void;
}

function SortableItem({ tab, onEdit, onDelete }: SortableItemProps) {
  const dispatch = useDispatch();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: tab.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
  };

  const handleDelete = () => {
    onDelete(tab.id);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={cn(
          'bg-white rounded-lg border transition-colors p-3 flex items-center gap-4',
          isDragging ? 'shadow-lg border-[#FF0000]' : 'hover:border-gray-300'
        )}
      >
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="h-5 w-5 text-gray-400" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {tab.isAd && (
              <img
                src={tab.advertiser?.logo}
                alt={tab.advertiser?.name}
                className="h-6 w-6 rounded-full object-cover"
              />
            )}
            <div className="font-medium truncate">{tab.name}</div>
            <div className="flex items-center gap-1">
              {tab.isAd && (
                <Badge variant="outline" className="bg-blue-100 text-blue-700">
                  <Megaphone className="h-3 w-3 mr-1" />
                  Ad
                </Badge>
              )}
              {tab.isPaused && (
                <Badge variant="outline" className="bg-yellow-100 text-yellow-700">
                  <PauseCircle className="h-3 w-3 mr-1" />
                  Paused
                </Badge>
              )}
              {tab.isSeasonal && (
                <Badge variant="outline" className="bg-orange-100 text-orange-700">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Seasonal
                </Badge>
              )}
            </div>
          </div>

          {(tab.startDate || tab.endDate || (tab.isSeasonal && tab.seasonalDates)) && (
            <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
              <Calendar className="h-3 w-3" />
              <span className="truncate">
                {tab.isSeasonal && tab.seasonalDates
                  ? `${format(new Date(tab.seasonalDates.startDate), 'MMM d')} - ${format(new Date(tab.seasonalDates.endDate), 'MMM d')}`
                  : `${tab.startDate ? format(new Date(tab.startDate), 'MMM d') : ''} ${tab.endDate ? `- ${format(new Date(tab.endDate), 'MMM d')}` : ''}`
                }
              </span>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(tab)}
            className="h-8 w-8 flex-shrink-0"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowDeleteDialog(true)}
            className="h-8 w-8 flex-shrink-0 text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Tab</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{tab.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

interface TabsListProps {
  tabs: Tab[];
  onReorder: (items: Tab[]) => void;
  onEdit: (tab: Tab) => void;
  onDelete: (tabId: string) => void;
}

export function TabsList({ tabs, onReorder, onEdit, onDelete }: TabsListProps) {
  const dispatch = useDispatch();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const items = useMemo(() => tabs.map(tab => tab.id), [tabs]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = tabs.findIndex(t => t.id === active.id);
      const newIndex = tabs.findIndex(t => t.id === over.id);
      const reorderedTabs = arrayMove(tabs, oldIndex, newIndex);
      dispatch(setTabs(reorderedTabs));
      onReorder(reorderedTabs);
    }
  };

  const handleEdit = (tab: Tab) => {
    onEdit(tab);
  };

  const handleDelete = (tabId: string) => {
    dispatch(deleteTab(tabId));
    onDelete(tabId);
  };

  if (tabs.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No tabs found matching your search
      </div>
    );
  }

  return (
    <div className="flex gap-8">
      {/* Tabs List */}
      <div className="w-1/2">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {tabs.map((tab) => (
                <SortableItem
                  key={tab.id}
                  tab={tab}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      {/* iPhone Preview */}
      <div className="w-1/2 flex justify-center">
        <div className="relative w-[375px] h-[812px] bg-white rounded-[60px] shadow-2xl border-8 border-gray-900">
          {/* Notch */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[40%] h-7 bg-gray-900 rounded-b-3xl" />
          
          {/* Screen Content */}
          <div className="h-full pt-12 pb-8 px-6 overflow-hidden">
            {/* Status Bar */}
            <div className="flex items-center justify-between text-xs mb-4">
              <span>9:41</span>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded-full border-2 border-current" />
                <div className="w-4 h-4 rounded-full border-2 border-current" />
                <div className="w-4 h-4 rounded-full border-2 border-current" />
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-4 overflow-x-auto pb-4 mb-4">
              {tabs.map((tab) => (
                <div
                  key={tab.id}
                  className={cn(
                    "flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium",
                    tab.isAd ? "bg-blue-100 text-blue-700" :
                    "bg-gray-100 text-gray-700"
                  )}
                >
                  {tab.name}
                </div>
              ))}
            </div>

            {/* Feed Content */}
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden">
                  {/* Post Header */}
                  <div className="p-4 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gray-200" />
                    <div>
                      <div className="font-medium">Sample User {i}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        Beirut, Lebanon
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="ml-auto">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Post Image */}
                  <div className="aspect-square bg-gray-100 relative">
                    <Image className="h-8 w-8 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-400" />
                  </div>

                  {/* Post Actions */}
                  <div className="p-4">
                    <div className="flex items-center gap-4 mb-3">
                      <Button variant="ghost" size="sm" className="text-gray-600">
                        <Heart className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-600">
                        <MessageSquare className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-600">
                        <Send className="h-5 w-5" />
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <p className="font-medium">Sample Post Title {i}</p>
                      <p className="text-sm text-gray-600">
                        This is a sample post description that shows how content will appear in this tab...
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Home Indicator */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gray-900 rounded-full" />
        </div>
      </div>
    </div>
  );
}