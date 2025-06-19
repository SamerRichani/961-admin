"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { updateSettings } from "@/app/features/apps/redux/pointsSlice";
import { useCallback, useRef } from "react";
import { toast } from "sonner";

interface ExpireSettingsProps {
  onUpdateSettings: (updates: any) => void;
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

export function ExpireSettings({ onUpdateSettings }: ExpireSettingsProps) {
  const dispatch = useAppDispatch();
  const {
    expirationEnabled,
    expirationPeriod,
    expirationNotificationDays,
  } = useAppSelector((state) => state.points);

  const updateExpirationSettings = async (updates: any) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/apps/points/expiration`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update expiration settings');
      }

      const data = await response.json();
      dispatch(updateSettings(data));
      toast.success('Expiration settings updated successfully');
    } catch (error) {
      toast.error('Failed to update expiration settings');
      // Revert the UI state if the API call fails
      dispatch(updateSettings({
        expirationEnabled,
        expirationPeriod,
        expirationNotificationDays,
      }));
    }
  };

  const debouncedUpdateExpirationSettings = useDebounce(updateExpirationSettings, 500);

  const handleUpdateSettings = (updates: any) => {
    dispatch(updateSettings(updates));
    debouncedUpdateExpirationSettings(updates);
  };

  return (
    <Card className="p-4 sm:p-6">
      <h3 className="text-lg font-semibold mb-4 sm:mb-6">
        Points Expiration Rules
      </h3>
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <Label>Enable Points Expiration</Label>
            <p className="text-sm text-gray-500">
              Points will expire after the specified period
            </p>
          </div>
          <Switch
            checked={expirationEnabled}
            onCheckedChange={(checked: boolean) =>
              handleUpdateSettings({ expirationEnabled: checked })
            }
          />
        </div>

        {expirationEnabled && (
          <>
            <div className="space-y-2">
              <Label>Expiration Period (Days)</Label>
              <Input
                type="number"
                value={expirationPeriod}
                onChange={(e) =>
                  handleUpdateSettings({
                    expirationPeriod: parseInt(e.target.value),
                  })
                }
                min={1}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label>Notification Days Before Expiry</Label>
              <Input
                type="number"
                value={expirationNotificationDays}
                onChange={(e) =>
                  handleUpdateSettings({
                    expirationNotificationDays: parseInt(e.target.value),
                  })
                }
                min={1}
                max={expirationPeriod}
                className="w-full"
              />
            </div>
          </>
        )}
      </div>
    </Card>
  );
} 