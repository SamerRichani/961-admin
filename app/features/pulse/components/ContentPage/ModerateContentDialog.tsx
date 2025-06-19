"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useDispatch } from "react-redux";
import { toggleShadowban, toggleDemonetize } from "@/app/features/pulse/redux/creatorContentSlice";

interface DialogContent {
  id: string;
  title: string;
  isShadowbanned?: boolean;
  isDemonetized?: boolean;
}

interface ModerateContentDialogProps {
  content: DialogContent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ModerateContentDialog({ content, open, onOpenChange }: ModerateContentDialogProps) {
  const dispatch = useDispatch();

  if (!content) return null;

  const handleAction = async (action: 'shadowban' | 'unshadowban' | 'demonetize' | 'remonetize') => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pulse/content/${content.id}/${action}`, {
        method: 'PATCH',
      });
      const data = await response.json();
      if (data.success) {
        if (action === 'shadowban' || action === 'unshadowban') {
          dispatch(toggleShadowban(content.id));
        } else {
          dispatch(toggleDemonetize(content.id));
        }
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Error applying moderation:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Moderate Content</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Content Title</Label>
            <p className="font-medium">{content.title}</p>
          </div>

          <div className="space-y-2">
            <Label>Actions</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={content.isDemonetized ? "default" : "outline"}
                onClick={() => handleAction(content.isDemonetized ? 'remonetize' : 'demonetize')}
              >
                {content.isDemonetized ? "Remonetize" : "Demonetize"}
              </Button>
              <Button
                variant={content.isShadowbanned ? "default" : "outline"}
                onClick={() => handleAction(content.isShadowbanned ? 'unshadowban' : 'shadowban')}
              >
                {content.isShadowbanned ? "Remove Shadowban" : "Shadowban"}
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 