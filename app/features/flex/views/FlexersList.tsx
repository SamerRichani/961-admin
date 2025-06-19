"use client"

import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { type Flexer } from '@/app/features/flex/types';
import { statusColors } from '@/app/features/flex/constants/flex';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatMoney, formatNumber } from '@/lib/format';
import { Shield, XCircle, Star, Package, DollarSign, Clock, ArrowUpDown } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { RootState } from '@/redux/store';
import {
  setSelectedFlexer,
  setModerateFlexer,
  setBanFlexer,
  moderateFlexer as moderateFlexerAction,
  banFlexer as banFlexerAction
} from '@/app/features/flex/redux/flexersSlice';
import { FlexTabs } from '@/app/features/flex/components/FlexTabs';


interface ModerateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (restrictions: { noCashTasks: boolean; noCashOnDelivery: boolean; reason: string }) => void;
}

function ModerateDialog({ open, onOpenChange, onSubmit }: ModerateDialogProps) {
  const [noCashTasks, setNoCashTasks] = useState(false);
  const [noCashOnDelivery, setNoCashOnDelivery] = useState(false);
  const [reason, setReason] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ noCashTasks, noCashOnDelivery, reason });
    setNoCashTasks(false);
    setNoCashOnDelivery(false);
    setReason('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Moderate Flexer</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="noCashTasks" 
                checked={noCashTasks} 
                onCheckedChange={(checked: boolean) => setNoCashTasks(checked)}
              />
              <Label htmlFor="noCashTasks">Don't assign cash tasks (pickup/deliver)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="noCashOnDelivery" 
                checked={noCashOnDelivery} 
                onCheckedChange={(checked: boolean) => setNoCashOnDelivery(checked)}
              />
              <Label htmlFor="noCashOnDelivery">Don't assign cash on delivery tasks</Label>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="reason">Reason</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason for moderation..."
              required
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="bg-[#FF0000] hover:bg-[#CC0000]"
              disabled={!reason.trim() || (!noCashTasks && !noCashOnDelivery)}
            >
              Apply Restrictions
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface BanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (reason: string) => void;
}

function BanDialog({ open, onOpenChange, onSubmit }: BanDialogProps) {
  const [reason, setReason] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(reason);
    setReason('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ban Flexer</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="reason">Reason</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason for ban..."
              required
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="bg-[#FF0000] hover:bg-[#CC0000]"
              disabled={!reason.trim()}
            >
              Confirm Ban
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

const mockFlexers: Flexer[] = [
  {
    id: 'FLX001',
    name: 'John Smith',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&q=90',
    status: 'active',
    rating: 4.8,
    totalBlocks: 250,
    completedTasks: 1250,
    failedTasks: 12,
    totalEarnings: 12500,
    avgBlockTime: '3h 45m',
    cashAccuracy: 99.8
  },
  {
    id: 'FLX002',
    name: 'Sarah Johnson',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&q=90',
    status: 'active',
    rating: 4.9,
    totalBlocks: 180,
    completedTasks: 900,
    failedTasks: 5,
    totalEarnings: 9000,
    avgBlockTime: '3h 30m',
    cashAccuracy: 100
  },
  {
    id: 'FLX003',
    name: 'Michael Chen',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&h=96&q=90',
    status: 'inactive',
    rating: 4.5,
    totalBlocks: 120,
    completedTasks: 600,
    failedTasks: 8,
    totalEarnings: 6000,
    avgBlockTime: '4h 15m',
    cashAccuracy: 99.5
  }
];

type SortField = 'name' | 'rating' | 'totalBlocks' | 'successRate' | 'totalEarnings' | 'avgBlockTime';

export function FlexersList() {
  const dispatch = useDispatch();
  const { flexers, selectedFlexer, moderateFlexer, banFlexer } = useSelector((state: RootState) => state.flexers);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const search = useSelector((state: RootState) => state.flex.search);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleModerate = useCallback((restrictions: { noCashTasks: boolean; noCashOnDelivery: boolean; reason: string }) => {
    if (!moderateFlexer) return;
    dispatch(moderateFlexerAction({ flexerId: moderateFlexer.id, restrictions }));
  }, [dispatch, moderateFlexer]);

  const handleBan = useCallback((reason: string) => {
    if (!banFlexer) return;
    dispatch(banFlexerAction({ flexerId: banFlexer.id, reason }));
  }, [dispatch, banFlexer]);

  const filteredFlexers = flexers.filter(flexer =>
    flexer.name.toLowerCase().includes(search.toLowerCase()) ||
    flexer.id.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => {
    const direction = sortDirection === 'asc' ? 1 : -1;
    switch (sortField) {
      case 'name':
        return direction * a.name.localeCompare(b.name);
      case 'rating':
        return direction * (a.rating - b.rating);
      case 'totalBlocks':
        return direction * (a.totalBlocks - b.totalBlocks);
      case 'successRate':
        return direction * ((a.completedTasks - a.failedTasks) / a.completedTasks - (b.completedTasks - b.failedTasks) / b.completedTasks);
      case 'totalEarnings':
        return direction * (a.totalEarnings - b.totalEarnings);
      case 'avgBlockTime':
        return direction * a.avgBlockTime.localeCompare(b.avgBlockTime);
      default:
        return 0;
    }
  });

  if (selectedFlexer) {
    return (
      <div>
        <Button
          variant="ghost"
          onClick={() => dispatch(setSelectedFlexer(null))}
          className="mb-6"
        >
          ← Back to Flexers
        </Button>

        <div className="space-y-6">
          {/* Header Card */}
          <Card className="p-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src={selectedFlexer.avatar} />
                <AvatarFallback>{selectedFlexer.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold">{selectedFlexer.name}</h2>
                  <Badge variant="outline" className={statusColors[selectedFlexer.status]}>
                    {selectedFlexer.status.charAt(0).toUpperCase() + selectedFlexer.status.slice(1)}
                  </Badge>
                </div>
                <div className="flex items-center gap-6 text-sm text-gray-500">
                  <span>ID: {selectedFlexer.id}</span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    {selectedFlexer.rating}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(setBanFlexer(selectedFlexer));
                  }}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Ban
                </Button>
                <Button 
                  className="bg-[#FF0000] hover:bg-[#CC0000]"
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(setModerateFlexer(selectedFlexer));
                  }}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Moderate
                </Button>
              </div>
            </div>
          </Card>

          {/* Performance Metrics */}
          <div className="grid grid-cols-4 gap-6">
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Completed Tasks</p>
                  <p className="text-2xl font-bold">{formatNumber(selectedFlexer.completedTasks)}</p>
                  <p className="text-sm text-emerald-600">
                    {((selectedFlexer.completedTasks - selectedFlexer.failedTasks) / selectedFlexer.completedTasks * 100).toFixed(1)}% success rate
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Blocks</p>
                  <p className="text-2xl font-bold">{formatNumber(selectedFlexer.totalBlocks)}</p>
                  <p className="text-sm text-emerald-600">
                    Avg {selectedFlexer.avgBlockTime}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Earnings</p>
                  <p className="text-2xl font-bold">{formatMoney(selectedFlexer.totalEarnings)}</p>
                  <p className="text-sm text-emerald-600">
                    {selectedFlexer.cashAccuracy}% cash accuracy
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Failed Tasks</p>
                  <p className="text-2xl font-bold">{formatNumber(selectedFlexer.failedTasks)}</p>
                  <p className="text-sm text-red-600">
                    {((selectedFlexer.failedTasks / selectedFlexer.completedTasks) * 100).toFixed(1)}% failure rate
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <FlexTabs>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button variant="ghost" size="sm" onClick={() => handleSort('name')}>
                    Flexer
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" size="sm" onClick={() => handleSort('rating')}>
                    Rating
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" size="sm" onClick={() => handleSort('totalBlocks')}>
                    Blocks
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" size="sm" onClick={() => handleSort('successRate')}>
                    Success Rate
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" size="sm" onClick={() => handleSort('totalEarnings')}>
                    Earnings
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" size="sm" onClick={() => handleSort('avgBlockTime')}>
                    Avg Time
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFlexers.map((flexer) => {
                const successRate = ((flexer.completedTasks - flexer.failedTasks) / flexer.completedTasks * 100).toFixed(1);
                
                return (
                  <TableRow 
                    key={flexer.id}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => dispatch(setSelectedFlexer(flexer))}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={flexer.avatar} />
                          <AvatarFallback>{flexer.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{flexer.name}</div>
                          <div className="text-sm text-gray-500">{flexer.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        {flexer.rating}
                      </div>
                    </TableCell>
                    <TableCell>{formatNumber(flexer.totalBlocks)}</TableCell>
                    <TableCell>
                      <span className="text-emerald-600">{successRate}%</span>
                    </TableCell>
                    <TableCell>{formatMoney(flexer.totalEarnings, { compact: true })}</TableCell>
                    <TableCell>{flexer.avgBlockTime}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusColors[flexer.status]}>
                        {flexer.status.charAt(0).toUpperCase() + flexer.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            dispatch(setBanFlexer(flexer));
                          }}
                        >
                          <XCircle className="h-4 w-4 text-red-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            dispatch(setModerateFlexer(flexer));
                          }}
                        >
                          <Shield className="h-4 w-4 text-blue-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {filteredFlexers.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No flexers found matching your search
            </div>
          )}

          <ModerateDialog
            open={!!moderateFlexer}
            onOpenChange={(open) => !open && dispatch(setModerateFlexer(null))}
            onSubmit={handleModerate}
          />

          <BanDialog
            open={!!banFlexer}
            onOpenChange={(open) => !open && dispatch(setBanFlexer(null))}
            onSubmit={handleBan}
          />
        </div>
      </FlexTabs>
    </div>
  );
}