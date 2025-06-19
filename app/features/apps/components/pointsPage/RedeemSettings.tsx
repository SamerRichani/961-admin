"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { updateSettings, setIsRedeemDialogOpen, setIsDeleteDialogOpen, setRewardToDelete } from "@/app/features/apps/redux/pointsSlice";
import { AddRedeemDialog } from "@/app/features/apps/components/pointsPage/AddRedeemDialog";
import { Reward } from "@/app/features/apps/types";
import { toast } from "sonner";
import { useCallback, useRef, useState, useEffect } from "react";
import { DeleteRewardDialog } from './DeleteRewardDialog';

interface RedeemSettingsProps {
  onUpdateSettings: (updates: any) => void;
  onCreateReward: (reward: Omit<Reward, 'id'>) => Promise<Reward>;
  onDeleteReward: (rewardId: string) => Promise<void>;
  onUpdateReward: (rewardId: string, updates: Partial<Reward>) => Promise<Reward>;
}

// Custom hook for debouncing
function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<NodeJS.Timeout>();

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );
}

export function RedeemSettings({ 
  onUpdateSettings, 
  onCreateReward,
  onDeleteReward,
  onUpdateReward
}: RedeemSettingsProps) {
  const dispatch = useAppDispatch();
  const { rewards } = useAppSelector((state) => state.points);
  const [localRewards, setLocalRewards] = useState<Reward[]>(rewards);
  const [isSaving, setIsSaving] = useState<{ [key: string]: boolean }>({});

  // Update local rewards when Redux rewards change
  useEffect(() => {
    setLocalRewards(rewards);
  }, [rewards]);

  const handleUpdateReward = async (rewardId: string, updates: Partial<Reward>) => {
    setIsSaving(prev => ({ ...prev, [rewardId]: true }));
    try {
      const updatedReward = await onUpdateReward(rewardId, updates);
      setLocalRewards(prev => 
        prev.map(reward => reward.id === rewardId ? updatedReward : reward)
      );
      toast.success('Reward updated successfully');
    } catch (error) {
      toast.error('Failed to update reward');
      // Revert to the original reward from Redux
      setLocalRewards(rewards);
    } finally {
      setIsSaving(prev => ({ ...prev, [rewardId]: false }));
    }
  };

  const debouncedUpdateReward = useDebounce(handleUpdateReward, 1000);

  const handleDeleteReward = async (rewardId: string) => {
    try {
      await onDeleteReward(rewardId);
      dispatch(setIsDeleteDialogOpen(false));
      dispatch(setRewardToDelete(null));
      toast.success('Reward deleted successfully');
    } catch (error) {
      toast.error('Failed to delete reward');
    }
  };

  const handleToggleReward = async (rewardId: string, checked: boolean) => {
    try {
      const updatedReward = await onUpdateReward(rewardId, { enabled: checked });
      setLocalRewards(prev => 
        prev.map(reward => reward.id === rewardId ? updatedReward : reward)
      );
      toast.success(`Reward ${checked ? 'enabled' : 'disabled'} successfully`);
    } catch (error) {
      toast.error('Failed to toggle reward');
      setLocalRewards(rewards);
    }
  };

  const handleToggleLimited = async (rewardId: string, checked: boolean) => {
    try {
      const updatedReward = await onUpdateReward(rewardId, { isLimited: checked });
      setLocalRewards(prev => 
        prev.map(reward => reward.id === rewardId ? updatedReward : reward)
      );
      toast.success(`Reward ${checked ? 'set as limited' : 'set as unlimited'} successfully`);
    } catch (error) {
      toast.error('Failed to update reward limit');
      setLocalRewards(rewards);
    }
  };

  const formatDateForInput = (dateString: string | undefined) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const parseDateForAPI = (dateString: string) => {
    if (!dateString) return undefined;
    const date = new Date(dateString);
    return date.toISOString();
  };

  return (
    <Card className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 sm:mb-6">
        <h3 className="text-lg font-semibold">Redemption Options</h3>
        <Button
          onClick={() => dispatch(setIsRedeemDialogOpen(true))}
          className="bg-[#FF0000] hover:bg-[#CC0000] w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Reward
        </Button>
      </div>
      <div className="space-y-4">
        {localRewards.map((reward) => (
          <div
            key={reward.id}
            className="p-3 sm:p-4 bg-gray-50 rounded-lg"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 sm:mb-4">
              <div className="flex items-center gap-3">
                <Switch
                  checked={reward.enabled}
                  onCheckedChange={(checked: boolean) => {
                    handleToggleReward(reward.id, checked);
                  }}
                />
                <div className="flex-1 min-w-0">
                  <Input
                    value={reward.name}
                    onChange={(e) => {
                      const newName = e.target.value;
                      setLocalRewards(prev => 
                        prev.map(r => r.id === reward.id ? { ...r, name: newName } : r)
                      );
                      debouncedUpdateReward(reward.id, { name: newName });
                    }}
                    className="font-medium bg-transparent border-0 p-0 focus-visible:ring-0 w-full"
                    disabled={isSaving[reward.id]}
                  />
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  dispatch(setIsDeleteDialogOpen(true));
                  dispatch(setRewardToDelete(reward.id));
                }}
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  value={reward.description}
                  onChange={(e) => {
                    const newDescription = e.target.value;
                    setLocalRewards(prev => 
                      prev.map(r => r.id === reward.id ? { ...r, description: newDescription } : r)
                    );
                    debouncedUpdateReward(reward.id, { description: newDescription });
                  }}
                  className="w-full"
                  disabled={isSaving[reward.id]}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Points Required</Label>
                  <Input
                    type="number"
                    value={reward.points}
                    onChange={(e) => {
                      const newPoints = parseInt(e.target.value);
                      setLocalRewards(prev => 
                        prev.map(r => r.id === reward.id ? { ...r, points: newPoints } : r)
                      );
                      debouncedUpdateReward(reward.id, { points: newPoints });
                    }}
                    min={0}
                    className="w-full"
                    disabled={isSaving[reward.id]}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Validity (Days)</Label>
                  <Input
                    type="number"
                    value={reward.validityDays || ""}
                    onChange={(e) => {
                      const newValidityDays = parseInt(e.target.value) || undefined;
                      setLocalRewards(prev => 
                        prev.map(r => r.id === reward.id ? { ...r, validityDays: newValidityDays } : r)
                      );
                      debouncedUpdateReward(reward.id, { validityDays: newValidityDays });
                    }}
                    min={1}
                    placeholder="No expiry"
                    className="w-full"
                    disabled={isSaving[reward.id]}
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={reward.isLimited}
                    onCheckedChange={(checked: boolean) => {
                      handleToggleLimited(reward.id, checked);
                    }}
                  />
                  <Label>Limited Time Reward</Label>
                </div>
                {reward.isLimited && (
                  <Input
                    type="date"
                    value={formatDateForInput(reward.endDate)}
                    onChange={(e) => {
                      const newEndDate = parseDateForAPI(e.target.value);
                      setLocalRewards(prev => 
                        prev.map(r => r.id === reward.id ? { ...r, endDate: newEndDate } : r)
                      );
                      debouncedUpdateReward(reward.id, { endDate: newEndDate });
                    }}
                    className="w-full sm:w-40"
                    disabled={isSaving[reward.id]}
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <AddRedeemDialog onCreateReward={onCreateReward} />
      <DeleteRewardDialog onDeleteReward={handleDeleteReward} />
    </Card>
  );
} 