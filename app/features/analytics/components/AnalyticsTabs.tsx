"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TimeRangeSelect } from "./TimeRangeSelect";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  setActiveTab,
  setTimeRange,
} from "@/app/features/analytics/redux/analyticsSlice";
import { ReactNode, useEffect } from "react";
import AnalyticsChatbot from "./AnalyticsChatbot";
import {
  PieChart,
  Users,
  DollarSign,
  Play,
  Activity,
  MessageCircle,
  Smartphone
} from 'lucide-react';
import { useRouter, useSearchParams } from "next/navigation";

interface AnalyticsTabsProps {
  children: ReactNode;
}

export function AnalyticsTabs({ children }: AnalyticsTabsProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { timeRange, activeTab } = useAppSelector((state) => state.analytics);

  // Handle URL-based tab navigation
  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl && tabFromUrl !== activeTab) {
      dispatch(setActiveTab(tabFromUrl));
    }
  }, [searchParams, dispatch, activeTab]);

  const handleTabChange = (value: string) => {
    dispatch(setActiveTab(value));
    
    // Update URL with the selected tab
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', value);
    router.push(`/analytics?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="bg-gray-50">
      <div className="max-w-[2000px] mx-auto p-8">
        <div className="mb-8 flex justify-between">
          <h1 className="text-4xl font-bold">Analytics</h1>
          <TimeRangeSelect
              value={timeRange}
              onValueChange={(value) => dispatch(setTimeRange(value))}
          />
        </div>
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <div className="mb-4">
            <div className="py-4 flex items-center justify-between min-w-max w-full">
              <div className="overflow-x-auto scrollbar-hide w-full">
                <TabsList className="w-full justify-start border-b rounded-none gap-2 min-w-max">
                  <TabsTrigger
                    value="overview"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#FF0000] data-[state=active]:bg-transparent px-4 text-sm font-medium whitespace-nowrap flex items-center gap-2"
                  >
                    <PieChart className="h-4 w-4" /> Overview
                  </TabsTrigger>
                  <TabsTrigger
                    value="users"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#FF0000] data-[state=active]:bg-transparent px-4 text-sm font-medium whitespace-nowrap flex items-center gap-2"
                  >
                    <Users className="h-4 w-4" /> Users
                  </TabsTrigger>
                  <TabsTrigger
                    value="revenue"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#FF0000] data-[state=active]:bg-transparent px-4 text-sm font-medium whitespace-nowrap flex items-center gap-2"
                  >
                    <DollarSign className="h-4 w-4" /> Revenue
                  </TabsTrigger>
                  <TabsTrigger
                    value="sections"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#FF0000] data-[state=active]:bg-transparent px-4 text-sm font-medium whitespace-nowrap flex items-center gap-2"
                  >
                    <PieChart className="h-4 w-4" /> Sections
                  </TabsTrigger>
                  <TabsTrigger
                    value="content"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#FF0000] data-[state=active]:bg-transparent px-4 text-sm font-medium whitespace-nowrap flex items-center gap-2"
                  >
                    <Play className="h-4 w-4" /> Content
                  </TabsTrigger>
                  <TabsTrigger
                    value="pulse"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#FF0000] data-[state=active]:bg-transparent px-4 text-sm font-medium whitespace-nowrap flex items-center gap-2"
                  >
                    <Activity className="h-4 w-4" /> Pulse
                  </TabsTrigger>
                  <TabsTrigger
                    value="chat"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#FF0000] data-[state=active]:bg-transparent px-4 text-sm font-medium whitespace-nowrap flex items-center gap-2"
                  >
                    <MessageCircle className="h-4 w-4" /> Chat
                  </TabsTrigger>
                  <TabsTrigger
                    value="miniapps"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#FF0000] data-[state=active]:bg-transparent px-4 text-sm font-medium whitespace-nowrap flex items-center gap-2"
                  >
                    <Smartphone className="h-4 w-4" /> Mini-Apps
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>
          </div>
          {children}
        </Tabs>
      </div>
      {/*<AnalyticsChatbot />*/}
    </div>
  );
}
