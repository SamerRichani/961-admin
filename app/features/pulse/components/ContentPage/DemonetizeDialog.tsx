"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useDispatch } from "react-redux";
import { toggleDemonetize } from "@/app/features/pulse/redux/contentSlice";
import { useState } from "react";

interface DialogContent {
  id: string;
  title: string;
  isDemonetized?: boolean;
}

interface DemonetizeDialogProps {
  content: DialogContent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DemonetizeDialog({ content, open, onOpenChange }: DemonetizeDialogProps) {
  const dispatch = useDispatch();
  const [reason, setReason] = useState("");

  if (!content) return null;

  const handleAction = async (action: 'demonetize' | 'remonetize') => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pulse/content/${content.id}/${action}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          action === 'demonetize'
            ? { duration: 0, reason } // 0 means permanent
            : { reason }
        ),
      });
      const data = await response.json();
      if (data.success) {
        dispatch(toggleDemonetize(content.id));
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Error applying demonetization:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{content.isDemonetized ? "Remonetize Content" : "Demonetize Content"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Content Title</Label>
            <p className="font-medium">{content.title}</p>
          </div>

          <div className="space-y-2">
            <Label>Reason</Label>
            <Textarea
              placeholder={content.isDemonetized ? "Enter reason for remonetization..." : "Enter reason for demonetization..."}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          {!content.isDemonetized && (
            <div className="text-sm text-gray-500">
              Note: Demonetization is permanent and can only be removed through the remonetization process.
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => handleAction(content.isDemonetized ? 'remonetize' : 'demonetize')}
            disabled={!reason}
            className="bg-[#FF0000] hover:bg-[#CC0000]"
          >
            {content.isDemonetized ? "Remonetize" : "Demonetize"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 