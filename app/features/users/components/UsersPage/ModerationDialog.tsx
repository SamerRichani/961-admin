"use client";

import { useCallback, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  setIsModerationOpen,
  setModeratingUser,
  setModerationActionType,
  setModerationDuration,
  setModerationReason,
  setModerationNotification,
  setModerationHideExisting,
  setModerationPreventNew,
  setModerationShowBanConfirm,
  resetModerationForm,
} from "@/app/features/users/redux/usersSlice";

type ActionType = "suspend" | "ban" | "warn";

interface ModerationDialogProps {
  onAction: (action: any) => void;
}

export function ModerationDialog({ onAction }: ModerationDialogProps) {
  const dispatch = useAppDispatch();
  const {
    moderatingUser,
    isModerationOpen,
    moderationActionType,
    moderationDuration,
    moderationReason,
    moderationNotification,
    moderationHideExisting,
    moderationPreventNew,
    moderationShowBanConfirm,
  } = useAppSelector((state) => state.users);

  useEffect(() => {
    if (!isModerationOpen) {
      dispatch(resetModerationForm());
    }
  }, [isModerationOpen, dispatch]);

  const handleAction = useCallback(() => {
    onAction({
      type: moderationActionType,
      duration: moderationDuration,
      reason: moderationReason,
      notification: moderationNotification,
      hideExisting: moderationHideExisting,
      preventNew: moderationPreventNew,
    });
  }, [
    moderationActionType,
    moderationDuration,
    moderationReason,
    moderationNotification,
    moderationHideExisting,
    moderationPreventNew,
    onAction,
  ]);

  const handleConfirmBan = useCallback(() => { 
    onAction({
      type: "ban", 
      reason: moderationReason,
      notification: moderationNotification,
      hideExisting: moderationHideExisting,
      preventNew: moderationPreventNew,
    });
    dispatch(setIsModerationOpen(false));
    dispatch(setModeratingUser(null));
    dispatch(resetModerationForm());
  }, [
    moderationReason,
    moderationNotification,
    moderationHideExisting,
    moderationPreventNew,
    onAction,
    dispatch,
  ]);

  if (!moderatingUser) return null;

  return (
    <Dialog
      open={isModerationOpen}
      onOpenChange={(open) => {
        if (!open) {
          dispatch(setIsModerationOpen(false));
          dispatch(setModeratingUser(null));
          dispatch(resetModerationForm());
        }
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Moderate User</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 pt-4">
          <div>
            <Label>Action Type</Label>
            <RadioGroup
              value={moderationActionType}
              onValueChange={(value) =>
                dispatch(setModerationActionType(value as ActionType))
              }
              className="grid grid-cols-3 gap-4 pt-2"
            >
              <div>
                <RadioGroupItem
                  value="suspend"
                  id="suspend"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="suspend"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <span className="text-sm font-medium">Suspend</span>
                </Label>
              </div>
              <div>
                <RadioGroupItem value="ban" id="ban" className="peer sr-only" />
                <Label
                  htmlFor="ban"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <span className="text-sm font-medium">Ban</span>
                </Label>
              </div>
              <div>
                <RadioGroupItem
                  value="warn"
                  id="warn"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="warn"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <span className="text-sm font-medium">Warn</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {moderationActionType === "suspend" && (
            <div>
              <Label>Duration (days)</Label>
              <Input
                type="number"
                min="1"
                value={moderationDuration}
                onChange={(e) =>
                  dispatch(setModerationDuration(Number(e.target.value)))
                }
                className="mt-2"
              />
            </div>
          )}

          <div>
            <Label>Reason</Label>
            <Textarea
              value={moderationReason}
              onChange={(e) => dispatch(setModerationReason(e.target.value))}
              placeholder="Enter reason for moderation action"
              className="mt-2"
            />
          </div>

          <div>
            <Label>Notification Message</Label>
            <Textarea
              value={moderationNotification}
              onChange={(e) =>
                dispatch(setModerationNotification(e.target.value))
              }
              placeholder="Enter notification message for the user"
              className="mt-2"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="hideExisting">Hide Existing Content</Label>
              <Switch
                id="hideExisting"
                checked={moderationHideExisting}
                onCheckedChange={(checked) =>
                  dispatch(setModerationHideExisting(checked))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="preventNew">Prevent New Content</Label>
              <Switch
                id="preventNew"
                checked={moderationPreventNew}
                onCheckedChange={(checked) =>
                  dispatch(setModerationPreventNew(checked))
                }
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                dispatch(setIsModerationOpen(false));
                dispatch(setModeratingUser(null));
                dispatch(resetModerationForm());
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (moderationActionType === "ban") {
                  dispatch(setModerationShowBanConfirm(true));
                } else {
                  handleAction();
                }
              }}
              className="bg-[#FF0000] hover:bg-[#CC0000]"
            >
              Apply Action
            </Button>
          </div>
        </div>
      </DialogContent>

      <Dialog
        open={moderationShowBanConfirm}
        onOpenChange={(open) => dispatch(setModerationShowBanConfirm(open))}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Ban</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <p>
              Are you sure you want to ban this user? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => dispatch(setModerationShowBanConfirm(false))}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmBan}
                className="bg-[#FF0000] hover:bg-[#CC0000]"
              >
                Confirm Ban
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}
