"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { boostContent } from "@/app/features/pulse/redux/contentSlice";

interface DialogContent {
  id: string;
  title: string;
}

interface BoostContentDialogProps {
  content: DialogContent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BoostContentDialog({ content, open, onOpenChange }: BoostContentDialogProps) {
  const dispatch = useDispatch();
  const [boostLevel, setBoostLevel] = useState(100);
  const [boostDuration, setBoostDuration] = useState(7);

  if (!content) return null;

  const handleApplyBoost = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pulse/content/${content.id}/boost`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          level: boostLevel,
          duration: boostDuration,
        }),
      });
      const data = await response.json();
      if (data.success) {
        dispatch(boostContent({ id: content.id, level: boostLevel, duration: boostDuration }));
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Error applying boost:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Boost Content</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 pt-4">
          <div className="space-y-4">
            <Label>Content Title</Label>
            <p className="font-medium">{content.title}</p>
          </div>

          <div className="space-y-4">
            <Label>Boost Level ({boostLevel}%)</Label>
            <Slider
              value={[boostLevel]}
              onValueChange={(value: number[]) => setBoostLevel(value[0])}
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
              {[7, 14, 30].map((days) => (
                <Button
                  key={days}
                  variant={boostDuration === days ? "default" : "outline"}
                  onClick={() => setBoostDuration(days)}
                >
                  {days} days
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
            onClick={handleApplyBoost}
            disabled={!boostDuration || !boostLevel}
            className="bg-[#FF0000] hover:bg-[#CC0000]"
          >
            Apply Boost
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 