"use client";

import { MetricCard } from "@/app/features/dashboard/components/MetricCard";
import { mockMetrics } from "@/app/features/dashboard/redux/dashboardSlice";
import { type Metric } from "@/app/features/dashboard/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatNumber, formatMoney } from "@/lib/format";
import {
  Users,
  TrendingUp,
  ChevronDown,
  Eye,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  setTimePeriod,
  setTopContent,
  setTopCreators,
  updateRegions,
} from "@/app/features/dashboard/redux/dashboardSlice";
import { useState, useEffect, useRef } from "react";

export function DashboardPage() {
  const dispatch = useDispatch();
  const hasUpdatedData = useRef(false);
  const {
    timePeriod,
    activeUsers,
    chartData,
    engagementData,
    periodMetrics,
    topContent,
    topCreators,
    regions,
  } = useSelector((state: RootState) => state.dashboard);

  const timePeriods = [
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: '7day', label: '7 Days' },
    { value: '30day', label: '30 Days' },
    { value: '90day', label: '90 Days' },
  ];

  const getAdjustedValue = (baseValue: number, period: string) => {
    const multipliers = {
      today: 1,
      yesterday: 0.85,
      '7day': 6.2,
      '30day': 24.8,
      '90day': 68.5,
    };
    return Math.round(baseValue * (multipliers[period as keyof typeof multipliers] || 1));
  };

  useEffect(() => {
    // Only update data on client side if needed and if we haven't updated yet
    if (typeof window !== 'undefined' && !hasUpdatedData.current) {
      // Generate random data on client-side only
      dispatch(setTopContent([
        {
          views: Math.random() * 50000 + 10000,
          growth: Math.random() * 20 + 5,
          title: "Content Title 1",
          creator: "Creator Name 1",
        },
        {
          views: Math.random() * 50000 + 10000,
          growth: Math.random() * 20 + 5,
          title: "Content Title 2",
          creator: "Creator Name 2",
        },
        {
          views: Math.random() * 50000 + 10000,
          growth: Math.random() * 20 + 5,
          title: "Content Title 3",
          creator: "Creator Name 3",
        },
      ]));

      dispatch(setTopCreators([
        {
          earned: Math.random() * 5000 + 1000,
          growth: Math.random() * 15 + 5,
          name: "Creator Name 1",
        },
        {
          earned: Math.random() * 5000 + 1000,
          growth: Math.random() * 15 + 5,
          name: "Creator Name 2",
        },
        {
          earned: Math.random() * 5000 + 1000,
          growth: Math.random() * 15 + 5,
          name: "Creator Name 3",
        },
      ]));

      // Update regions with random growth
      dispatch(updateRegions(regions.map(region => ({
        ...region,
        growth: Math.floor(Math.random() * 100)
      }))));

      hasUpdatedData.current = true;
    }
  }, [dispatch]); // Remove regions from dependencies

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-4xl font-bold text-black">Dashboard</h1>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">
                  {timePeriods.find(p => p.value === timePeriod)?.label}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent align="end" className="w-32">
              {timePeriods.map((period) => (
                <DropdownMenuItem
                  key={period.value}
                  onClick={() => dispatch(setTimePeriod(period.value as any))}
                  className={timePeriod === period.value ? 'bg-red-50 text-red-600' : ''}
                >
                  {period.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Live Activity Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Active Users Now"
            value={formatNumber(activeUsers.rightNow)}
            change="+12.5%"
            positive={true}
          />
          <MetricCard
            title="Active Users (Last Hour)"
            value={formatNumber(activeUsers.lastTenMinutes)}
            change="+8.3%"
            positive={true}
          />
          <MetricCard
            title="Average Time Spent"
            value="24m 32s"
            change="+5.2%"
            positive={true}
          />
          <MetricCard
            title="Total Creators"
            value="2.5K"
            change="+15.7%"
            positive={true}
          />
        </div>

        {/* User Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Daily Active Users"
            value={formatNumber(getAdjustedValue(periodMetrics[timePeriod].newUsers, timePeriod))}
            change="+6.2%"
            positive={true}
          />
          <MetricCard
            title="Weekly Active Users"
            value={formatNumber(getAdjustedValue(periodMetrics[timePeriod].newUsers * 7, timePeriod))}
            change="+3.8%"
            positive={true}
          />
          <MetricCard
            title="Monthly Active Users"
            value={formatNumber(getAdjustedValue(periodMetrics[timePeriod].newUsers * 30, timePeriod))}
            change="+12.1%"
            positive={true}
          />
          <MetricCard
            title="New Users"
            value={formatNumber(periodMetrics[timePeriod].newUsers)}
            change="+18.5%"
            positive={true}
          />
        </div>

        {/* App Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <MetricCard
            title="New Installs"
            value={formatNumber(periodMetrics[timePeriod].installs)}
            change="+24.3%"
            positive={true}
          />
          <MetricCard
            title="New Content Created"
            value={formatNumber(periodMetrics[timePeriod].newPosts)}
            change="+11.7%"
            positive={true}
          />
          <MetricCard
            title="Chat Messages"
            value={formatNumber(getAdjustedValue(periodMetrics[timePeriod].newUsers * 15, timePeriod))}
            change="+32.1%"
            positive={true}
          />
        </div>

        {/* Financial Metrics */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">GMV</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${formatNumber(getAdjustedValue(periodMetrics[timePeriod].newUsers * 50, timePeriod))}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${formatNumber(getAdjustedValue(periodMetrics[timePeriod].newUsers * 25, timePeriod))}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Business Earnings</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${formatNumber(getAdjustedValue(periodMetrics[timePeriod].newUsers * 15, timePeriod))}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Creator Earnings</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${formatNumber(getAdjustedValue(periodMetrics[timePeriod].newUsers * 10, timePeriod))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        

        {/* Top Performers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              Top Content
            </h3>
            <div className="space-y-3">
              {Array.from({ length: 10 }, (_, i) => ({
                views: Math.random() * 50000 + 10000,
                growth: Math.random() * 20 + 5,
                title: `Content Title ${i + 1}`,
                creator: `Creator Name ${i + 1}`,
              })).map((content, i) => (
                <div 
                  key={i} 
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-7 h-7 bg-gradient-to-br from-red-400 to-red-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">
                      #{i + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-md truncate">{content.title}</div>
                      <div className="text-xs text-gray-500">
                        by {content.creator}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Eye className="w-4 h-4" />
                    <span>{formatNumber(Math.round(content.views))}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Top Creators</h3>
            <div className="space-y-3">
              {Array.from({ length: 10 }, (_, i) => ({
                earned: Math.random() * 5000 + 1000,
                growth: Math.random() * 15 + 5,
                name: `Creator Name ${i + 1}`,
              })).map((creator, i) => (
                <div 
                  key={i} 
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-7 h-7 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 font-bold text-xs">
                      #{i + 1}
                    </div>
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    <Users className="h-5 w-5 text-gray-500" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-md truncate">{creator.name}</div>
                      <div className="text-xs text-gray-500">
                        Earnings: {formatMoney(creator.earned)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{formatMoney(creator.earned * 1.5)}</div>
                    <div className="text-xs text-gray-500">Revenue</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
