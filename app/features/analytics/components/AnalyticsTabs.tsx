import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TimeRangeSelect } from "./TimeRangeSelect";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  setActiveTab,
  setTimeRange,
} from "@/app/features/analytics/redux/analyticsSlice";
import { setPage } from "@/components/sidebar/redux/navigationSlice";
import { ReactNode } from "react";
import AnalyticsChatbot from "./AnalyticsChatbot";

interface AnalyticsTabsProps {
  children: ReactNode;
}

export function AnalyticsTabs({ children }: AnalyticsTabsProps) {
  const dispatch = useAppDispatch();
  const { timeRange, activeTab } = useAppSelector((state) => state.analytics);

  const handleTabChange = (value: string) => {
    dispatch(setActiveTab(value));
    switch (value) {
      case "live":
        dispatch(setPage("analytics"));
        break;
      case "overview":
        dispatch(setPage("analytics/overview"));
        break;
      case "user":
        dispatch(setPage("analytics/user"));
        break;
      case "revenue":
        dispatch(setPage("analytics/revenue"));
        break;
      case "apps":
        dispatch(setPage("analytics/apps"));
        break;
      case "content":
        dispatch(setPage("analytics/content"));
        break;
      case "tabs":
        dispatch(setPage("analytics/tabs"));
        break;
      default:
        dispatch(setPage("analytics"));
    }
  };

  return (
    <div className="bg-gray-50">
      <div className="max-w-[2000px] mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold">Analytics Dashboard</h1>
        </div>
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <div className="bg-white border-b">
            <div className="px-6 py-4 flex items-center justify-between">
              <div className="overflow-x-auto scrollbar-hide">
                <TabsList className="w-full justify-start border-b rounded-none h-12 bg-white gap-2 min-w-max">
                  <TabsTrigger
                    value="live"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#FF0000] data-[state=active]:bg-transparent px-6 text-base font-medium whitespace-nowrap"
                  >
                    Live
                  </TabsTrigger>
                  <TabsTrigger
                    value="overview"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#FF0000] data-[state=active]:bg-transparent px-6 text-base font-medium whitespace-nowrap"
                  >
                    Overview
                  </TabsTrigger>
                  <TabsTrigger
                    value="user"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#FF0000] data-[state=active]:bg-transparent px-6 text-base font-medium whitespace-nowrap"
                  >
                    User
                  </TabsTrigger>
                  <TabsTrigger
                    value="revenue"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#FF0000] data-[state=active]:bg-transparent px-6 text-base font-medium whitespace-nowrap"
                  >
                    Revenue
                  </TabsTrigger>
                  <TabsTrigger
                    value="apps"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#FF0000] data-[state=active]:bg-transparent px-6 text-base font-medium whitespace-nowrap"
                  >
                    Apps
                  </TabsTrigger>
                  <TabsTrigger
                    value="content"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#FF0000] data-[state=active]:bg-transparent px-6 text-base font-medium whitespace-nowrap"
                  >
                    Content
                  </TabsTrigger>
                  <TabsTrigger
                    value="tabs"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#FF0000] data-[state=active]:bg-transparent px-6 text-base font-medium whitespace-nowrap"
                  >
                    Tabs
                  </TabsTrigger>
                </TabsList>
              </div>
              <TimeRangeSelect
                value={timeRange}
                onValueChange={(value) => dispatch(setTimeRange(value))}
              />
            </div>
          </div>
          {children}
        </Tabs>
      </div>
      <AnalyticsChatbot />
    </div>
  );
}
