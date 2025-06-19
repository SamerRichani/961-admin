"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useDispatch } from "react-redux";
import { toggleShadowban } from "@/app/features/pulse/redux/contentSlice";
import { useState } from "react";

interface DialogContent {
  id: string;
  title: string;
  isShadowbanned?: boolean;
}

interface ShadowbanDialogProps {
  content: DialogContent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ShadowbanDialog({ content, open, onOpenChange }: ShadowbanDialogProps) {
  const dispatch = useDispatch();
  const [reason, setReason] = useState("");
  const [duration, setDuration] = useState(30);

  if (!content) return null;

  const handleAction = async (action: 'shadowban' | 'unshadowban') => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pulse/content/${content.id}/${action}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          action === 'shadowban' 
            ? { duration, reason }
            : { reason }
        ),
      });
      const data = await response.json();
      if (data.success) {
        dispatch(toggleShadowban(content.id));
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Error applying shadowban:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{content.isShadowbanned ? "Remove Shadowban" : "Shadowban Content"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Content Title</Label>
            <p className="font-medium">{content.title}</p>
          </div>

          {!content.isShadowbanned && (
            <div className="space-y-2">
              <Label>Duration (days)</Label>
              <div className="flex items-center gap-4">
                {[7, 14, 30, 90].map((days) => (
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
          )}

          <div className="space-y-2">
            <Label>Reason</Label>
            <Textarea
              placeholder="Enter reason for shadowban..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => handleAction(content.isShadowbanned ? 'unshadowban' : 'shadowban')}
            disabled={!reason}
            className="bg-[#FF0000] hover:bg-[#CC0000]"
          >
            {content.isShadowbanned ? "Remove Shadowban" : "Apply Shadowban"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 