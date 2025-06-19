"use client"

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
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
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarIcon, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { toast } from 'sonner';
import {
  setDialogOpen,
  setEditingTab,
  addTab,
  updateTab,
  deleteTab,
  type Tab,
} from '@/app/features/pulse/redux/tabsSlice';

interface TabDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (tab: Tab) => Promise<void>;
  tab?: Tab | null;
}

export function TabDialog({ open, onOpenChange, onSave, tab }: TabDialogProps) {
  const dispatch = useDispatch();
  const { editingTab } = useSelector((state: RootState) => state.tabs);
  const [name, setName] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [newKeyword, setNewKeyword] = useState('');
  const [isSeasonal, setIsSeasonal] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  useEffect(() => {
    if (editingTab) {
      setName(editingTab.name);
      setKeywords(editingTab.keywords || []);
      setIsSeasonal(editingTab.isSeasonal || false);
      setIsPaused(editingTab.isPaused || false);
      setStartDate(
        editingTab.startDate ? new Date(editingTab.startDate) : 
        editingTab.seasonalDates?.startDate ? new Date(editingTab.seasonalDates.startDate) : undefined
      );
      setEndDate(
        editingTab.endDate ? new Date(editingTab.endDate) : 
        editingTab.seasonalDates?.endDate ? new Date(editingTab.seasonalDates.endDate) : undefined
      );
    } else {
      setName('');
      setKeywords([]);
      setIsSeasonal(false);
      setIsPaused(false);
      setStartDate(undefined);
      setEndDate(undefined);
    }
  }, [editingTab, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const tabData = {
      name,
      keywords,
      isSeasonal,
      isPaused,
      ...(isSeasonal && startDate && endDate ? {
        seasonalDates: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
      } : {
        ...(startDate && { startDate: startDate.toISOString() }),
        ...(endDate && { endDate: endDate.toISOString() }),
      }),
    };

    try {
      if (editingTab && onSave) {
        const updatedTab = {
          ...editingTab,
          ...tabData,
        };
        await onSave(updatedTab);
        toast.success('Tab updated successfully');
      } else {
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
        
        dispatch(addTab(transformedTab));
        toast.success('Tab created successfully');
      }
      dispatch(setDialogOpen(false));
      dispatch(setEditingTab(null));
    } catch (error) {
      toast.error('Failed to save tab. Please try again.');
    }
  };

  const handleAddKeyword = () => {
    if (newKeyword && !keywords.includes(newKeyword)) {
      setKeywords(prev => [...prev, newKeyword]);
      setNewKeyword('');
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setKeywords(prev => prev.filter(k => k !== keyword));
  };

  const handleDelete = () => {
    if (editingTab) {
      dispatch(deleteTab(editingTab.id));
      dispatch(setDialogOpen(false));
      dispatch(setEditingTab(null));
      setShowDeleteDialog(false);
      onOpenChange(false);
    }
  };

  // Check if it's Following or For You tab
  const isSystemTab = editingTab?.name === 'Following' || editingTab?.name === 'For You';

  return (
    <>
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{editingTab ? 'Edit Tab' : 'Add New Tab'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Tab Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter tab name"
              required
            />
          </div>

          {!isSystemTab && (
            <div className="space-y-2">
              <Label>Keywords</Label>
              <div className="flex gap-2">
                <Input
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  placeholder="Add keyword"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddKeyword();
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={handleAddKeyword}
                  disabled={!newKeyword}
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {keywords.map((keyword, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer hover:bg-gray-200"
                    onClick={() => handleRemoveKeyword(keyword)}
                  >
                    {keyword}
                    <Trash2 className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="seasonal">Seasonal Tab</Label>
                <p className="text-sm text-gray-500">Enable for seasonal content</p>
              </div>
              <Switch id="seasonal" checked={isSeasonal} onCheckedChange={setIsSeasonal} />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="pause">Pause Tab</Label>
                <p className="text-sm text-gray-500">Temporarily hide from users</p>
              </div>
              <Switch id="pause" checked={isPaused} onCheckedChange={setIsPaused} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !startDate && 'text-muted-foreground'
                    )}
                    type="button"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => {
                      if (date) {
                        setStartDate(date);
                      }
                    }}
                    initialFocus
                    showOutsideDays
                    className="rounded-md border"
                    classNames={{
                      months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
                      month: 'space-y-4',
                      caption: 'flex justify-center pt-1 relative items-center',
                      caption_label: 'text-sm font-medium',
                      nav: 'space-x-1 flex items-center',
                      nav_button: cn(
                        'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100'
                      ),
                      nav_button_previous: 'absolute left-1',
                      nav_button_next: 'absolute right-1',
                      table: 'w-full border-collapse space-y-1',
                      head_row: 'flex',
                      head_cell: 'text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]',
                      row: 'flex w-full mt-2',
                      cell: cn(
                        'relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md',
                        '[&:has([aria-selected])]:rounded-md'
                      ),
                      day: cn(
                        'h-8 w-8 p-0 font-normal aria-selected:opacity-100'
                      ),
                      day_selected: 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
                      day_today: 'bg-accent text-accent-foreground',
                      day_outside: 'text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30',
                      day_disabled: 'text-muted-foreground opacity-50',
                      day_hidden: 'invisible',
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>End Date (Optional)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !endDate && 'text-muted-foreground'
                    )}
                    type="button"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => {
                      if (date) {
                        setEndDate(date);
                      }
                    }}
                    initialFocus
                    showOutsideDays
                    className="rounded-md border"
                    disabled={(date) => {
                      return startDate ? date < startDate : false;
                    }}
                    classNames={{
                      months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
                      month: 'space-y-4',
                      caption: 'flex justify-center pt-1 relative items-center',
                      caption_label: 'text-sm font-medium',
                      nav: 'space-x-1 flex items-center',
                      nav_button: cn(
                        'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100'
                      ),
                      nav_button_previous: 'absolute left-1',
                      nav_button_next: 'absolute right-1',
                      table: 'w-full border-collapse space-y-1',
                      head_row: 'flex',
                      head_cell: 'text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]',
                      row: 'flex w-full mt-2',
                      cell: cn(
                        'relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md',
                        '[&:has([aria-selected])]:rounded-md'
                      ),
                      day: cn(
                        'h-8 w-8 p-0 font-normal aria-selected:opacity-100'
                      ),
                      day_selected: 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
                      day_today: 'bg-accent text-accent-foreground',
                      day_outside: 'text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30',
                      day_disabled: 'text-muted-foreground opacity-50',
                      day_hidden: 'invisible',
                    }}
                  />
                </PopoverContent>
              </Popover>
              {endDate && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setEndDate(undefined);
                  }}
                  className="mt-1"
                >
                  Clear end date
                </Button>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false);
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#FF0000] hover:bg-[#CC0000]"
              disabled={!name}
            >
              {editingTab ? 'Save Changes' : 'Add Tab'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>

    <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Tab</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this tab? This action cannot be undone.
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