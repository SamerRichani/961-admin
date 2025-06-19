"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  setIsDialogOpen,
  updateSettings,
  updateEarningRule,
  deleteEarningRule,
} from "@/app/features/apps/redux/pointsSlice";
import { AddRuleDialog } from "@/app/features/apps/components/pointsPage/AddRuleDialog";
import { EarningRule } from "@/app/features/apps/types";
import { toast } from "sonner";
import { useEffect, useState, useCallback, useRef } from "react";

interface EarnSettingsProps {
  onCreateRule: (rule: Omit<EarningRule, 'id'>) => Promise<EarningRule>;
  onUpdateRulePoints: (ruleId: string, points: number) => Promise<EarningRule>;
  onToggleRule: (ruleId: string) => Promise<EarningRule>;
  onDeleteRule: (ruleId: string) => Promise<void>;
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

export function EarnSettings({ 
  onCreateRule, 
  onUpdateRulePoints, 
  onToggleRule, 
  onDeleteRule,
  onUpdateSettings
}: EarnSettingsProps) {
  const dispatch = useAppDispatch();
  const { conversionRate, earningRules, isDialogOpen } = useAppSelector(
    (state) => state.points
  );

  const handleUpdateSettings = (updates: any) => {
    dispatch(updateSettings(updates));
  };

  const handleToggleRule = async (ruleId: string, checked: boolean) => {
    // Update UI immediately
    dispatch(updateEarningRule({ id: ruleId, updates: { enabled: checked } }));
    
    try {
      await onToggleRule(ruleId);
    } catch (error) {
      // Revert the UI state if the API call fails
      dispatch(updateEarningRule({ id: ruleId, updates: { enabled: !checked } }));
      toast.error('Failed to toggle rule');
    }
  };

  const updateRulePoints = async (ruleId: string, points: number) => {
    try {
      await onUpdateRulePoints(ruleId, points);
    } catch (error) {
      // Revert the UI state if the API call fails
      const rule = earningRules.find(r => r.id === ruleId);
      if (rule) {
        dispatch(updateEarningRule({ id: ruleId, updates: { points: rule.points } }));
      }
    }
  };

  const debouncedUpdateRulePoints = useDebounce(updateRulePoints, 500);

  const handleUpdatePoints = (ruleId: string, points: number) => {
    dispatch(updateEarningRule({ id: ruleId, updates: { points } }));
    debouncedUpdateRulePoints(ruleId, points);
  };

  const handleDeleteRule = async (ruleId: string) => {
    try {
      await onDeleteRule(ruleId);
    } catch (error) {
      // The rule will remain in the UI if the API call fails
    }
  };

  const updateConversionRate = async (rate: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/apps/points/conversion-rate`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ conversionRate: rate }),
      });

      if (!response.ok) {
        throw new Error('Failed to update conversion rate');
      }

      const data = await response.json();
      dispatch(updateSettings({
        conversionRate: data.conversionRate,
        earningRules: data.earningRules,
        expirationEnabled: data.expirationEnabled,
        expirationPeriod: data.expirationPeriod,
        expirationNotificationDays: data.expirationNotificationDays,
        rewards: data.rewards
      }));
      toast.success('Conversion rate updated successfully');
    } catch (error) {
      toast.error('Failed to update conversion rate');
      // Revert the UI state if the API call fails
      const currentRate = useAppSelector((state) => state.points.conversionRate);
      dispatch(updateSettings({ conversionRate: currentRate }));
    }
  };

  const debouncedUpdateConversionRate = useDebounce(updateConversionRate, 500);

  const handleConversionRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rate = parseFloat(e.target.value);
    if (!isNaN(rate)) {
      dispatch(updateSettings({ conversionRate: rate }));
      debouncedUpdateConversionRate(rate);
    }
  };

  return (
    <Card className="p-4 sm:p-6">
      <h3 className="text-lg font-semibold mb-4 sm:mb-6">
        Points Conversion Settings
      </h3>
      <div className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-2">
            <Label>Conversion Rate (Points per $1)</Label>
            <Input
              type="number"
              value={conversionRate}
              onChange={handleConversionRateChange}
              min={0.01}
              step={0.01}
              className="w-full"
            />
            <p className="text-sm text-gray-500">
              Base conversion rate for monetary transactions
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 sm:mb-6">
          <h3 className="text-lg font-semibold">Point Earning Rules</h3>
          <Button
            onClick={() => dispatch(setIsDialogOpen(true))}
            className="bg-[#FF0000] hover:bg-[#CC0000] w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Rule
          </Button>
        </div>

        <div className="space-y-4">
          {["deals", "merch", "blood", "other"].map((category) => (
            <div key={category} className="mb-4 sm:mb-6">
              <h4 className="text-sm font-medium text-gray-500 mb-3">
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </h4>
              {earningRules
                .filter((rule) => rule.category === category)
                .map((rule) => (
                  <div
                    key={rule.id}
                    className="p-3 sm:p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 sm:mb-4">
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={rule.enabled}
                          onCheckedChange={(checked: boolean) => {
                            handleToggleRule(rule.id, checked);
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <Input
                            value={rule.action}
                            onChange={(e) => {
                              dispatch(
                                updateEarningRule({
                                  id: rule.id,
                                  updates: { action: e.target.value },
                                })
                              );
                            }}
                            className="font-medium bg-transparent border-0 p-0 focus-visible:ring-0 w-full"
                          />
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteRule(rule.id)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Points</Label>
                        <Input
                          type="number"
                          value={rule.points}
                          onChange={(e) => {
                            handleUpdatePoints(rule.id, parseInt(e.target.value));
                          }}
                          min={0}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>

      <AddRuleDialog onCreateRule={onCreateRule} />
    </Card>
  );
} 