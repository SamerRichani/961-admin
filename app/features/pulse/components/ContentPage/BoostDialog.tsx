"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useDispatch } from "react-redux";
import { boostContent } from "@/app/features/pulse/redux/contentSlice";
import { useState, useEffect } from "react";

interface DialogContent {
  id: string;
  title: string;
  currentBoost?: {
    level: number;
    duration: number;
    startDate: string;
    endDate: string;
  };
  boostHistory?: Array<{
    level: number;
    duration: number;
    startDate: string;
    endDate: string;
    _id: string;
  }>;
}

interface BoostDialogProps {
  content: DialogContent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BoostDialog({ content, open, onOpenChange }: BoostDialogProps) {
  const dispatch = useDispatch();
  const [level, setLevel] = useState(1);
  const [duration, setDuration] = useState(7);
  const [timeRemaining, setTimeRemaining] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (content?.currentBoost?.endDate) {
      const endDate = new Date(content.currentBoost.endDate);
      const now = new Date();
      const diffTime = endDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setTimeRemaining(diffDays > 0 ? `${diffDays} days remaining` : 'Expired');
    } else {
      setTimeRemaining(null);
    }
  }, [content?.currentBoost?.endDate]);

  useEffect(() => {
    if (content?.currentBoost?.level) {
      setLevel(content.currentBoost.level);
    }
  }, [content?.currentBoost?.level]);

  if (!content) return null;

  const handleBoost = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pulse/content/${content.id}/boost`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          level,
          duration
        }),
      });
      const data = await response.json();
      if (data.success) {
        dispatch(boostContent({ id: content.id, level, duration }));
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Error boosting content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveBoost = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pulse/content/${content.id}/remove-boost`, {
        method: 'PATCH',
      });
      const data = await response.json();
      if (data.success) {
        dispatch(boostContent({ id: content.id, level: 0, duration: 0 }));
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Error removing boost:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{content.currentBoost ? "Boost Details" : "Boost Content"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Content Title</Label>
            <p className="font-medium">{content.title}</p>
          </div>

          {content.currentBoost ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Current Boost Level</Label>
                <div className="flex items-center gap-2">
                  <div className="w-64">
                    <Slider
                      value={[content.currentBoost.level]}
                      min={1}
                      max={5}
                      step={1}
                      disabled
                    />
                  </div>
                  <span className="text-sm font-medium">
                    Level {content.currentBoost.level}
                  </span>
                </div>
              </div>
              {timeRemaining && (
                <div className="space-y-2">
                  <Label>Time Remaining</Label>
                  <p className="text-sm font-medium">{timeRemaining}</p>
                </div>
              )}
              {content.boostHistory && content.boostHistory.length > 0 && (
                <div className="space-y-2">
                  <Label>Boost History</Label>
                  <div className="space-y-2">
                    {content.boostHistory.map((boost, index) => (
                      <div key={index} className="text-sm">
                        <span className="font-medium">Level {boost.level}</span> for {boost.duration} days
                        <span className="text-gray-500 ml-2">
                          ({new Date(boost.startDate).toLocaleDateString()} - {new Date(boost.endDate).toLocaleDateString()})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label>Boost Level (1-5)</Label>
                <div className="flex items-center gap-2">
                  <div className="w-64">
                    <Slider
                      value={[level]}
                      onValueChange={(value) => setLevel(value[0])}
                      min={1}
                      max={5}
                      step={1}
                    />
                  </div>
                  <span className="text-sm font-medium">
                    Level {level}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  {level === 1 ? "Minimal" : level === 2 ? "Moderate" : level === 3 ? "High" : level === 4 ? "Very High" : "Maximum"} visibility
                </div>
              </div>

              <div className="space-y-2">
                <Label>Duration (days)</Label>
                <div className="flex items-center gap-4">
                  {[7, 14, 30].map((days) => (
                    <Button
                      key={days}
                      variant={duration === days ? "default" : "outline"}
                      onClick={() => setDuration(days)}
                    >
                      {days} days
                    </Button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          {content.currentBoost ? (
            <Button
              onClick={handleRemoveBoost}
              className="bg-[#FF0000] hover:bg-[#CC0000]"
              disabled={isLoading}
            >
              {isLoading ? "Removing..." : "Remove Boost"}
            </Button>
          ) : (
            <Button
              onClick={handleBoost}
              className="bg-[#FF0000] hover:bg-[#CC0000]"
              disabled={isLoading}
            >
              {isLoading ? "Applying..." : "Apply Boost"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 