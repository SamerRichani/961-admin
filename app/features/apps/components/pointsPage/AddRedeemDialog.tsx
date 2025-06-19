"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setIsRedeemDialogOpen, setNewReward, resetNewReward } from "@/app/features/apps/redux/pointsSlice";
import { Reward } from "@/app/features/apps/types";

interface AddRedeemDialogProps {
  onCreateReward: (reward: Omit<Reward, 'id'>) => Promise<Reward>;
}

export function AddRedeemDialog({ onCreateReward }: AddRedeemDialogProps) {
  const dispatch = useAppDispatch();
  const { isRedeemDialogOpen, newReward } = useAppSelector((state) => state.points);

  const handleAddReward = async () => {
    if (newReward.name && newReward.points && newReward.description) {
      try {
        const rewardToCreate = {
          name: newReward.name,
          description: newReward.description,
          points: newReward.points,
          validityDays: newReward.validityDays,
          enabled: true,
          isLimited: newReward.isLimited || false,
          endDate: newReward.endDate,
        };
        
        await onCreateReward(rewardToCreate);
        dispatch(setIsRedeemDialogOpen(false));
        dispatch(resetNewReward());
      } catch (error) {
        // Error is handled by the API function
      }
    }
  };

  return (
    <Dialog
      open={isRedeemDialogOpen}
      onOpenChange={(open) => dispatch(setIsRedeemDialogOpen(open))}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Reward</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Reward Name</Label>
            <Input
              value={newReward.name}
              onChange={(e) =>
                dispatch(
                  setNewReward({
                    ...newReward,
                    name: e.target.value,
                  })
                )
              }
              placeholder="e.g., Free Coffee"
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Input
              value={newReward.description}
              onChange={(e) =>
                dispatch(
                  setNewReward({
                    ...newReward,
                    description: e.target.value,
                  })
                )
              }
              placeholder="e.g., Get a free coffee at any participating store"
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label>Points Required</Label>
            <Input
              type="number"
              value={newReward.points}
              onChange={(e) =>
                dispatch(
                  setNewReward({
                    ...newReward,
                    points: parseInt(e.target.value),
                  })
                )
              }
              min={0}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label>Validity (Days)</Label>
            <Input
              type="number"
              value={newReward.validityDays || ""}
              onChange={(e) =>
                dispatch(
                  setNewReward({
                    ...newReward,
                    validityDays: parseInt(e.target.value) || undefined,
                  })
                )
              }
              min={1}
              placeholder="No expiry"
              className="w-full"
            />
          </div>
          <div className="flex items-center gap-2">
            <Label>Limited Time Reward</Label>
            <input
              type="checkbox"
              checked={newReward.isLimited}
              onChange={(e) =>
                dispatch(
                  setNewReward({
                    ...newReward,
                    isLimited: e.target.checked,
                  })
                )
              }
              className="h-4 w-4"
            />
          </div>
          {newReward.isLimited && (
            <div className="space-y-2">
              <Label>End Date</Label>
              <Input
                type="date"
                value={newReward.endDate}
                onChange={(e) =>
                  dispatch(
                    setNewReward({
                      ...newReward,
                      endDate: e.target.value,
                    })
                  )
                }
                className="w-full"
              />
            </div>
          )}
        </div>
        <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => {
              dispatch(setIsRedeemDialogOpen(false));
              dispatch(resetNewReward());
            }}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddReward}
            className="bg-[#FF0000] hover:bg-[#CC0000] w-full sm:w-auto"
            disabled={!newReward.name || !newReward.points || !newReward.description}
          >
            Add Reward
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 