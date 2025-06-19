"use client"

import { type Creator, metricConfig } from '@/app/features/pulse/type';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Shield, TrendingUp } from 'lucide-react';
import { formatMoney } from '@/lib/format';
import { useState, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { setPage, setCreatorId } from '@/components/sidebar/redux/navigationSlice';
import { setCreators } from '@/app/features/pulse/redux/creatorsSlice';

interface ModerateDialogProps {
  creator: Creator;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function ModerateDialog({ creator, open, onOpenChange }: ModerateDialogProps) {
  const [action, setAction] = useState<string>('');
  const [duration, setDuration] = useState<number>(7);
  const [reason, setReason] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();

  const handleAction = async () => {
    console.log('Performing action on creator with ID:', creator._id);
    setIsSubmitting(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pulse/creators/${creator._id}/moderation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          duration,
          reason,
        }),
      });

      if (!response.ok) throw new Error('Failed to apply moderation');
      
      // Refresh creators list after successful moderation
      const creatorsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pulse/creators`);
      if (!creatorsResponse.ok) throw new Error('Failed to fetch updated creators');
      const { data } = await creatorsResponse.json();
      dispatch(setCreators(data));
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error applying moderation:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Moderate {creator.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Action</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={action === 'demonetize' ? 'default' : 'outline'}
                onClick={() => setAction('demonetize')}
              >
                Demonetize
              </Button>
              <Button
                variant={action === 'shadowban' ? 'default' : 'outline'}
                onClick={() => setAction('shadowban')}
              >
                Shadowban
              </Button>
              <Button
                variant={action === 'warning' ? 'default' : 'outline'}
                onClick={() => setAction('warning')}
              >
                Warning
              </Button>
              <Button
                variant={action === 'suspend' ? 'default' : 'outline'}
                onClick={() => setAction('suspend')}
              >
                Suspend
              </Button>
              <Button
                variant={action === 'ban' ? 'destructive' : 'outline'}
                onClick={() => setAction('ban')}
                className="col-span-2"
              >
                Ban
              </Button>
            </div>
          </div>

          {action === 'suspend' && (
            <div className="space-y-2">
              <Label>Duration (days)</Label>
              <div className="flex items-center gap-4">
                {[7, 30, 90].map((days) => (
                  <Button
                    key={days}
                    variant={duration === days ? 'default' : 'outline'}
                    onClick={() => setDuration(days)}
                  >
                    {days} days
                  </Button>
                ))}
              </div>
            </div>
          )}
          {action === 'demonetize' && (
            <div className="space-y-2">
              <Label>Duration (days)</Label>
              <div className="flex items-center gap-4">
                {[7, 30, 90, 'ongoing'].map((days) => (
                  <Button
                    key={days}
                    variant={duration === days ? 'default' : 'outline'}
                    onClick={() => setDuration(days === 'ongoing' ? -1 : days as number)}
                  >
                    {days === 'ongoing' ? 'Ongoing' : `${days} days`}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label>Reason</Label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain the reason for this action..."
              rows={4}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleAction}
            disabled={!action || !reason}
            className="bg-[#FF0000] hover:bg-[#CC0000]"
          >
            Apply Action
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface BoostDialogProps {
  creator: Creator;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function BoostDialog({ creator, open, onOpenChange }: BoostDialogProps) {
  const [boost, setBoost] = useState(100);
  const [duration, setDuration] = useState(7);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();

  const handleBoost = async () => {
    console.log('Boosting creator with ID:', creator._id);
    setIsSubmitting(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pulse/creators/${creator._id}/boost`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          boost,
          duration,
        }),
      });

      if (!response.ok) throw new Error('Failed to apply boost');
      
      // Refresh creators list after successful boost
      const creatorsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pulse/creators`);
      if (!creatorsResponse.ok) throw new Error('Failed to fetch updated creators');
      const { data } = await creatorsResponse.json();
      dispatch(setCreators(data));
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error applying boost:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Boost {creator.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 pt-4">
          <div className="space-y-4">
            <Label>Boost Level ({boost}%)</Label>
            <Slider
              value={[boost]}
              onValueChange={(value: number[]) => setBoost(value[0])}
              max={500}
              step={10}
            />
            <div className="grid grid-cols-5 gap-2 text-sm text-gray-500">
              <div>Normal</div>
              <div>2x</div>
              <div>3x</div>
              <div>4x</div>
              <div>5x</div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Duration (days)</Label>
            <div className="flex items-center gap-4">
              {[7, 14, 30, 'ongoing'].map((days) => (
                <Button
                  key={days}
                  variant={duration === days ? 'default' : 'outline'} 
                  onClick={() => setDuration(days === 'ongoing' ? -1 : days as number)}
                >
                  {days === 'ongoing' ? 'Ongoing' : `${days} days`}
                </Button>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleBoost}
            className="bg-[#FF0000] hover:bg-[#CC0000]"
          >
            Apply Boost
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function formatMetricValue(value: number): string {
  if (value >= 1000000) {
    return `${Math.floor(value / 1000000)}M`;
  }
  if (value >= 1000) {
    return `${Math.floor(value / 1000)}K`;
  }
  return value.toString();
}

function formatEarnings(value: number): string {
  if (value >= 1000) {
    return `$${Math.floor(value / 1000)}k`;
  }
  return formatMoney(value);
}

type SortField = 'name' | 'followers' | 'views' | 'engagements' | 'earnings';

export function CreatorsList() {
  const { creators, search } = useSelector((state: RootState) => state.creators);
  const dispatch = useDispatch();
  const [sortField, setSortField] = useState<SortField>('followers');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  const [isModerateOpen, setIsModerateOpen] = useState(false);
  const [isBoostOpen, setIsBoostOpen] = useState(false);

  const handleCreatorClick = useCallback((creator: Creator) => {
    console.log('Opening profile for creator with ID:', creator._id);
    dispatch(setCreatorId(creator._id));
    dispatch(setPage('pulse/creators/[id]'));
  }, [dispatch]);

  // Ensure creators is an array before filtering
  const safeCreators = Array.isArray(creators) ? creators : [];
  const filteredCreators = safeCreators.filter(creator =>
    creator?.name?.toLowerCase().includes(search.toLowerCase()) ||
    creator?.username?.toLowerCase().includes(search.toLowerCase()) ||
    creator?.category?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedCreators = [...filteredCreators].sort((a, b) => {
    const multiplier = sortDirection === 'asc' ? 1 : -1;
    switch (sortField) {
      case 'name':
        return multiplier * a.name.localeCompare(b.name);
      case 'followers':
        return multiplier * (Number(b.metrics.followers) - Number(a.metrics.followers));
      case 'views':
        return multiplier * (Number(b.metrics.views) - Number(a.metrics.views));
      case 'engagements':
        return multiplier * (Number(b.metrics.engagements) - Number(a.metrics.engagements));
      case 'earnings':
        return multiplier * (Number(b.metrics.earnings) - Number(a.metrics.earnings));
      default:
        return 0;
    }
  });

  return (
    <div className="bg-white rounded-lg border overflow-x-auto">
      <div className="min-w-[800px]">
        <div className="grid grid-cols-[1fr,repeat(4,120px)] gap-4 px-6 py-3 border-b">
          <Button
            variant="ghost"
            onClick={() => handleSort('name')}
            className="justify-start font-medium text-sm text-gray-500 hover:text-gray-900"
          >
            Creator
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
          {Object.entries(metricConfig).map(([key, config]) => {
            const Icon = config.icon;
            return (
              <Button
                key={key}
                variant="ghost"
                onClick={() => handleSort(key as SortField)}
                className="justify-start font-medium text-sm text-gray-500 hover:text-gray-900"
              >
                <Icon className="h-4 w-4" />
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            );
          })}
        </div>

        {sortedCreators.map((creator) => (
          <div
            key={creator._id}
            className="grid grid-cols-[1fr,repeat(4,120px)] gap-4 px-6 py-3 items-center hover:bg-gray-50 border-b last:border-b-0"
            onClick={() => handleCreatorClick(creator)}
            style={{ cursor: 'pointer' }}
          >
            <div className="flex items-center gap-3 min-w-0">
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarImage src={creator.avatarUrl} />
                <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <div className="font-medium truncate">{creator.name}</div>
                <div className="text-sm text-gray-500 truncate">@{creator.username}</div>
              </div>
            </div>
            <div className="text-sm">
              {formatMetricValue(creator.metrics.followers)}
            </div>
            <div className="text-sm">
              {formatMetricValue(creator.metrics.views)}
            </div>
            <div className="text-sm">
              {formatMetricValue(creator.metrics.engagements)}
            </div>
            <div className="text-sm">
              {formatEarnings(creator.metrics.earnings)}
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedCreator(creator);
                  setIsBoostOpen(true);
                }}
              >
                <TrendingUp className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedCreator(creator);
                  setIsModerateOpen(true);
                }}
              >
                <Shield className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}

        {sortedCreators.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No creators found matching your search
          </div>
        )}
      </div>

      {selectedCreator && (
        <>
          <ModerateDialog
            creator={selectedCreator}
            open={isModerateOpen}
            onOpenChange={setIsModerateOpen}
          />
          <BoostDialog
            creator={selectedCreator}
            open={isBoostOpen}
            onOpenChange={setIsBoostOpen}
          />
        </>
      )}
    </div>
  );
}