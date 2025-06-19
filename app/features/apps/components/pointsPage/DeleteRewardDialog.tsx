"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setIsDeleteDialogOpen, setRewardToDelete } from "@/app/features/apps/redux/pointsSlice";

interface DeleteRewardDialogProps {
  onDeleteReward: (rewardId: string) => Promise<void>;
}

export const DeleteRewardDialog: React.FC<DeleteRewardDialogProps> = ({ onDeleteReward }) => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.points.isDeleteDialogOpen);
  const rewardToDelete = useAppSelector((state) => state.points.rewardToDelete);

  const handleClose = () => {
    dispatch(setIsDeleteDialogOpen(false));
    dispatch(setRewardToDelete(null));
  };

  const handleDelete = async () => {
    if (rewardToDelete) {
      await onDeleteReward(rewardToDelete);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Reward</DialogTitle>
        </DialogHeader>
        <p>Are you sure you want to delete this reward? This action cannot be undone.</p>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 