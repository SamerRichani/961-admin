"use client"

import { useState } from 'react';
import { useDispatch } from 'react-redux';
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
import { Clock, MapPin, Package } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { addBlock } from '@/app/features/flex/redux/blocksSlice';

interface CreateBlockDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateBlockDialog({ open, onOpenChange }: CreateBlockDialogProps) {
  const dispatch = useDispatch();
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [maxTasks, setMaxTasks] = useState('10');
  const [blockType, setBlockType] = useState<'delivery' | 'pickup' | 'mixed'>('mixed');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create a new block with a unique ID
    const newBlock = {
      id: `BLK${Date.now()}`,
      status: 'available' as const,
      startTime,
      endTime,
      location,
      tasks: {
        total: 0,
        completed: 0,
        deliveries: 0,
        pickups: 0,
        entities: []
      },
      earnings: 0
    };

    // Dispatch the action to add the block
    dispatch(addBlock(newBlock));
    
    // Reset form and close dialog
    setStartTime('');
    setEndTime('');
    setLocation('');
    setMaxTasks('10');
    setBlockType('mixed');
    onOpenChange(false);
  };

  const handleClose = () => {
    // Reset form when closing
    setStartTime('');
    setEndTime('');
    setLocation('');
    setMaxTasks('10');
    setBlockType('mixed');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Block</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  id="startTime"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="pl-9"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  id="endTime"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="pl-9"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger className="pl-9">
                  <SelectValue placeholder="Select station" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beirut">Beirut Central</SelectItem>
                  <SelectItem value="tripoli">Tripoli Hub</SelectItem>
                  <SelectItem value="sidon">Sidon Station</SelectItem>
                  <SelectItem value="jounieh">Jounieh Point</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxTasks">Maximum Tasks</Label>
            <div className="relative">
              <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                id="maxTasks"
                type="number"
                min="1"
                max="20"
                value={maxTasks}
                onChange={(e) => setMaxTasks(e.target.value)}
                className="pl-9"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="blockType">Block Type</Label>
            <Select value={blockType} onValueChange={(value: 'delivery' | 'pickup' | 'mixed') => setBlockType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mixed">Mixed (Deliveries & Pickups)</SelectItem>
                <SelectItem value="delivery">Deliveries Only</SelectItem>
                <SelectItem value="pickup">Cash Pickups Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-[#FF0000] hover:bg-[#CC0000]">
              Create Block
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}