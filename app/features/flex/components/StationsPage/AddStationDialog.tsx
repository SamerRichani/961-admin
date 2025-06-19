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

interface AddStationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: StationData) => void;
}

interface StationData {
  name: string;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  managers: Array<{
    name: string;
    role: string;
  }>;
}

const initialFormState = {
  name: '',
  location: '',
  lat: '',
  lng: '',
  managerName: '',
  managerRole: 'Station Manager'
};

export function AddStationDialog({ open, onOpenChange, onSubmit }: AddStationDialogProps) {
  const [formData, setFormData] = useState(initialFormState);

  // Reset form when dialog is opened/closed
  useEffect(() => {
    if (!open) {
      setFormData(initialFormState);
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: formData.name,
      location: formData.location,
      coordinates: {
        lat: parseFloat(formData.lat),
        lng: parseFloat(formData.lng)
      },
      managers: [{
        name: formData.managerName,
        role: formData.managerRole
      }]
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Station</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Station Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Beirut Central"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location Area</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., Downtown"
                required
              />
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <Label>Location Pin</Label>
            <div className="h-[200px] bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Map Placeholder</p>
            </div>
            <p className="text-sm text-gray-500">Click on the map to set station location</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="managerName">Station Manager</Label>
              <Input
                id="managerName"
                value={formData.managerName}
                onChange={(e) => setFormData({ ...formData, managerName: e.target.value })}
                placeholder="Manager's name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="managerRole">Manager Role</Label>
              <Input
                id="managerRole"
                value={formData.managerRole}
                onChange={(e) => setFormData({ ...formData, managerRole: e.target.value })}
                placeholder="e.g., Station Manager"
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-[#FF0000] hover:bg-[#CC0000]">
              Add Station
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}