"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setCommentSettings } from "@/app/features/pulse/redux/engagementSettingsSlice";
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function CommentsSettings() {
  const dispatch = useDispatch();
  const { commentSettings } = useSelector((state: RootState) => state.engagementSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchCommentSettings();
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, []);

  const fetchCommentSettings = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pulse/engagement/`);
      if (!response.ok) {
        throw new Error('Failed to fetch comment settings');
      }
      const data = await response.json();
      dispatch(setCommentSettings(data.commentSettings));
    } catch (error) {
      console.error('Error fetching comment settings:', error);
      toast.error('Failed to load comment settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSettingChange = useCallback(async (changes: Partial<typeof commentSettings>) => {
    // Update Redux state immediately for responsive UI
    dispatch(setCommentSettings(changes));

    // Clear any existing timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // Set a new timer for API call
    const timer = setTimeout(async () => {
      try {
        setIsSaving(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pulse/engagement/comment-settings`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            freeCommentsLimit: changes.freeCommentsLimit ?? commentSettings.freeCommentsLimit,
            additionalCommentPrice: changes.additionalCommentPrice ?? commentSettings.additionalCommentPrice,
            investorCommentAllowance: changes.investorCommentAllowance ?? commentSettings.investorCommentAllowance,
            restrictionsEnabled: changes.restrictionsEnabled ?? commentSettings.restrictionsEnabled,
          }),
        });

        if (!response.ok) {
          // If API call fails, revert the changes
          dispatch(setCommentSettings(commentSettings));
          throw new Error('Failed to update comment settings');
        }

        const updatedData = await response.json();
        // Update with server response to ensure consistency
        dispatch(setCommentSettings(updatedData.commentSettings));
        toast.success('Comment settings updated successfully');
      } catch (error) {
        console.error('Error updating comment settings:', error);
        toast.error('Failed to update comment settings');
      } finally {
        setIsSaving(false);
      }
    }, 1000);

    setDebounceTimer(timer);
  }, [commentSettings, debounceTimer, dispatch]);

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-6">Comments Management</h3>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Enable Comment Restrictions</Label>
            <p className="text-sm text-gray-500">
              Limit free comments and enable paid comments
            </p>
          </div>
          <Switch
            checked={commentSettings.restrictionsEnabled}
            onCheckedChange={(checked: boolean) => {
              handleSettingChange({ restrictionsEnabled: checked });
            }}
            disabled={isSaving}
          />
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Free Comments Limit</Label>
              <Input
                type="number"
                value={commentSettings.freeCommentsLimit}
                onChange={(e) => {
                  handleSettingChange({
                    freeCommentsLimit: parseInt(e.target.value),
                  });
                }}
                min={0}
                disabled={isSaving}
              />
              <p className="text-sm text-gray-500">
                Number of free comments per post
              </p>
            </div>
            <div className="space-y-2">
              <Label>Additional Comment Price</Label>
              <Input
                type="number"
                value={commentSettings.additionalCommentPrice}
                onChange={(e) => {
                  handleSettingChange({
                    additionalCommentPrice: parseInt(e.target.value),
                  });
                }}
                min={0}
                disabled={isSaving}
              />
              <p className="text-sm text-gray-500">
                Cost in coins per additional comment
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Investor Comment Allowance</Label>
            <Input
              type="number"
              value={commentSettings.investorCommentAllowance}
              onChange={(e) => {
                handleSettingChange({
                  investorCommentAllowance: parseInt(e.target.value),
                });
              }}
              min={0}
              disabled={isSaving}
            />
            <p className="text-sm text-gray-500">
              Free comments allowed for investors per post
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
} 