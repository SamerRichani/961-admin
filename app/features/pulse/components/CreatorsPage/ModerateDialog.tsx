import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  setModerationAction,
  setModerationDuration,
  setModerationReason,
  applyModeration,
} from "@/app/features/pulse/redux/creatorProfileSlice";
import { Creator } from "@/app/features/pulse/type";

interface ModerateDialogProps {
  creator: Creator | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ModerateDialog({ creator, open, onOpenChange }: ModerateDialogProps) {
  const dispatch = useDispatch();
  const { moderationAction, moderationDuration, moderationReason } = useSelector(
    (state: RootState) => state.creatorProfile
  );

  if (!creator) return null;

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
                variant={moderationAction === "demonetize" ? "default" : "outline"}
                onClick={() => dispatch(setModerationAction("demonetize"))}
              >
                Demonetize
              </Button>
              <Button
                variant={moderationAction === "shadowban" ? "default" : "outline"}
                onClick={() => dispatch(setModerationAction("shadowban"))}
              >
                Shadowban
              </Button>
              <Button
                variant={moderationAction === "warning" ? "default" : "outline"}
                onClick={() => dispatch(setModerationAction("warning"))}
              >
                Warning
              </Button>
              <Button
                variant={moderationAction === "suspend" ? "default" : "outline"}
                onClick={() => dispatch(setModerationAction("suspend"))}
              >
                Suspend
              </Button>
              <Button
                variant={moderationAction === "ban" ? "destructive" : "outline"}
                onClick={() => dispatch(setModerationAction("ban"))}
                className="col-span-2"
              >
                Ban
              </Button>
            </div>
          </div>

          {moderationAction === "suspend" && (
            <div className="space-y-2">
              <Label>Duration (days)</Label>
              <div className="flex items-center gap-4">
                {[7, 30, 90].map((days) => (
                  <Button
                    key={days}
                    variant={moderationDuration === days ? "default" : "outline"}
                    onClick={() => dispatch(setModerationDuration(days))}
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
              value={moderationReason}
              onChange={(e) => dispatch(setModerationReason(e.target.value))}
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
            onClick={() => {
              dispatch(
                applyModeration({
                  creatorId: creator._id,
                  action: moderationAction,
                  duration: moderationDuration,
                  reason: moderationReason,
                }) as any
              );
            }}
            disabled={!moderationAction || !moderationReason}
            className="bg-[#FF0000] hover:bg-[#CC0000]"
          >
            Apply Action
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 