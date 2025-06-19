"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setActiveTab, updateSettings, updateEarningRule, addEarningRule, deleteEarningRule } from "@/app/features/apps/redux/pointsSlice";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EarnSettings } from "@/app/features/apps/components/pointsPage/EarnSettings";
import { ExpireSettings } from "@/app/features/apps/components/pointsPage/ExpireSettings";
import { RedeemSettings } from "@/app/features/apps/components/pointsPage/RedeemSettings";
import { useEffect, useState, useCallback, useRef } from "react";
import { Card } from "@/components/ui/card";
import { PointsData, EarningRule, Reward } from "@/app/features/apps/types";
import { toast } from "sonner";

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

export function PointsPage() {
  const dispatch = useAppDispatch();
  const { activeTab, conversionRate, earningRules, expirationEnabled, expirationPeriod, expirationNotificationDays, rewards } = useAppSelector((state) => state.points);
  const [pointsData, setPointsData] = useState<PointsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Auto-save function with debounce
  const saveSettings = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/apps/points`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversionRate,
          earningRules,
          expirationEnabled,
          expirationPeriod,
          expirationNotificationDays,
          rewards
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save settings');
      }

      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    }
  };

  const debouncedSave = useDebounce(saveSettings, 2000);

  // Update settings and trigger auto-save
  const handleUpdateSettings = (updates: any) => {
    dispatch(updateSettings(updates));
    debouncedSave();
  };

  // API Functions
  const createEarningRule = async (rule: Omit<EarningRule, 'id'>) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/apps/points/earning-rules`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(rule),
      });

      if (!response.ok) {
        throw new Error('Failed to create earning rule');
      }

      const newRule = await response.json();
      dispatch(addEarningRule(newRule));
      toast.success('Earning rule created successfully');
      return newRule;
    } catch (error) {
      toast.error('Failed to create earning rule');
      throw error;
    }
  };

  const updateRulePoints = async (ruleId: string, points: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/apps/points/earning-rules/${ruleId}/points`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ points }),
      });

      if (!response.ok) {
        throw new Error('Failed to update rule points');
      }

      const updatedRule = await response.json();
      dispatch(updateEarningRule({ id: ruleId, updates: { points } }));
      toast.success('Rule points updated successfully');
      return updatedRule;
    } catch (error) {
      toast.error('Failed to update rule points');
      throw error;
    }
  };

  const toggleRule = async (ruleId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/apps/points/earning-rules/${ruleId}/toggle`, {
        method: 'PATCH',
      });

      if (!response.ok) {
        throw new Error('Failed to toggle rule');
      }

      const updatedRule = await response.json();
      dispatch(updateEarningRule({ id: ruleId, updates: { enabled: updatedRule.enabled } }));
      toast.success(`Rule ${updatedRule.enabled ? 'enabled' : 'disabled'} successfully`);
      return updatedRule;
    } catch (error) {
      toast.error('Failed to toggle rule');
      throw error;
    }
  };

  const deleteRule = async (ruleId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/apps/points/earning-rules/${ruleId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete rule');
      }

      dispatch(deleteEarningRule(ruleId));
      toast.success('Rule deleted successfully');
    } catch (error) {
      toast.error('Failed to delete rule');
      throw error;
    }
  };

  const createReward = async (reward: Omit<Reward, 'id'>) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/apps/points/rewards`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reward),
      });

      if (!response.ok) {
        throw new Error('Failed to create reward');
      }

      const newReward = await response.json();
      dispatch(updateSettings({ rewards: [...rewards, newReward] }));
      toast.success('Reward created successfully');
      return newReward;
    } catch (error) {
      toast.error('Failed to create reward');
      throw error;
    }
  };

  const deleteReward = async (rewardId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/apps/points/rewards/${rewardId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete reward');
      }

      dispatch(updateSettings({ 
        rewards: rewards.filter(reward => reward.id !== rewardId)
      }));
      toast.success('Reward deleted successfully');
    } catch (error) {
      toast.error('Failed to delete reward');
      throw error;
    }
  };

  const updateReward = async (rewardId: string, updates: Partial<Reward>) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/apps/points/rewards/${rewardId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update reward');
      }

      const updatedReward = await response.json();
      dispatch(updateSettings({ 
        rewards: rewards.map(reward => 
          reward.id === rewardId ? updatedReward : reward
        )
      }));
      toast.success('Reward updated successfully');
      return updatedReward;
    } catch (error) {
      toast.error('Failed to update reward');
      throw error;
    }
  };

  // const updateConversionRate = async (rate: number) => {
  //   try {
  //     const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/apps/points/conversion-rate`, {
  //       method: 'PATCH',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ conversionRate: rate }),
  //     });

  //     if (!response.ok) {
  //       throw new Error('Failed to update conversion rate');
  //     }

  //     const data = await response.json();
  //     dispatch(updateSettings({
  //       conversionRate: data.conversionRate,
  //       earningRules: data.earningRules,
  //       expirationEnabled: data.expirationEnabled,
  //       expirationPeriod: data.expirationPeriod,
  //       expirationNotificationDays: data.expirationNotificationDays,
  //       rewards: data.rewards
  //     }));
  //     toast.success('Conversion rate updated successfully');
  //   } catch (error) {
  //     toast.error('Failed to update conversion rate');
  //     // Revert the UI state if the API call fails
  //     const currentRate = useAppSelector((state) => state.points.conversionRate);
  //     dispatch(updateSettings({ conversionRate: currentRate }));
  //   }
  // };

  // const debouncedUpdateConversionRate = useDebounce(updateConversionRate, 500);

  // const handleConversionRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const rate = parseFloat(e.target.value);
  //   if (!isNaN(rate)) {
  //     dispatch(updateSettings({ conversionRate: rate }));
  //     debouncedUpdateConversionRate(rate);
  //   }
  // };

  useEffect(() => {
    const fetchPointsData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/apps/points`);
        if (!response.ok) {
          throw new Error('Failed to fetch points data');
        }
        const data = await response.json();
        setPointsData(data);
        // Update Redux store with the fetched data
        dispatch(updateSettings({
          conversionRate: data.conversionRate,
          earningRules: data.earningRules,
          expirationEnabled: data.expirationEnabled,
          expirationPeriod: data.expirationPeriod,
          expirationNotificationDays: data.expirationNotificationDays,
          rewards: data.rewards
        }));
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred';
        setError(errorMessage);
        toast.error(`Failed to load points data: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    };

    fetchPointsData();
  }, []);

  if (loading) {
    return <div className="text-center py-4">Loading points data...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>;
  }

  if (!pointsData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-[2000px] mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-2">
            <Star className="h-6 sm:h-8 w-6 sm:w-8 text-[#FF0000]" />
            <h1 className="text-xl sm:text-2xl font-semibold">
              Points Management
            </h1>
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(value) =>
            dispatch(setActiveTab(value as "earn" | "expire" | "redeem"))
          }
        >
          <TabsList className="w-full min-w-max border-b rounded-none h-12 bg-white gap-2 px-4">
            <TabsTrigger
              value="earn"
              className="flex items-center gap-2 data-[state=active]:border-[#FF0000] data-[state=active]:text-[#FF0000]"
            >
              <Star className="h-4 w-4" />
              Earn
            </TabsTrigger>
            <TabsTrigger
              value="expire"
              className="flex items-center gap-2 data-[state=active]:border-[#FF0000] data-[state=active]:text-[#FF0000]"
            >
              <Star className="h-4 w-4" />
              Expire
            </TabsTrigger>
            <TabsTrigger
              value="redeem"
              className="flex items-center gap-2 data-[state=active]:border-[#FF0000] data-[state=active]:text-[#FF0000]"
            >
              <Star className="h-4 w-4" />
              Redeem
            </TabsTrigger>
          </TabsList>

          <TabsContent value="earn">
            <EarnSettings 
              onCreateRule={createEarningRule}
              onUpdateRulePoints={updateRulePoints}
              onToggleRule={toggleRule}
              onDeleteRule={deleteRule}
              onUpdateSettings={handleUpdateSettings}
            />
          </TabsContent>

          <TabsContent value="expire">
            <ExpireSettings onUpdateSettings={handleUpdateSettings} />
          </TabsContent>

          <TabsContent value="redeem">
            <RedeemSettings 
              onUpdateSettings={handleUpdateSettings}
              onCreateReward={createReward}
              onDeleteReward={deleteReward}
              onUpdateReward={updateReward}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 