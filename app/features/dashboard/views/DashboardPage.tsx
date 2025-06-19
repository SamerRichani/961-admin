"use client";

import { MetricCard } from "@/app/features/dashboard/components/MetricCard";
import { mockMetrics } from "@/app/features/dashboard/redux/dashboardSlice";
import { type Metric } from "@/app/features/dashboard/types";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

  useEffect(() => {
    // Only update data on client side if needed and if we haven't updated yet
    if (typeof window !== 'undefined' && !hasUpdatedData.current) {
      // Generate random data on client-side only
      dispatch(setTopContent([
        {
          views: Math.random() * 50000 + 10000,
          growth: Math.random() * 20 + 5,
          title: "Content Title 1",
        },
        {
          views: Math.random() * 50000 + 10000,
          growth: Math.random() * 20 + 5,
          title: "Content Title 2",
        },
        {
          views: Math.random() * 50000 + 10000,
          growth: Math.random() * 20 + 5,
          title: "Content Title 3",
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
        growth: Math.random() * 10 + 5
      }))));

      hasUpdatedData.current = true;
    }
  }, [dispatch]); // Remove regions from dependencies

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-[2000px] mx-auto p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Dashboard Overview
          </h1>
          <Select
            value={timePeriod}
            onValueChange={(value) => dispatch(setTimePeriod(value as any))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="7day">7 Days</SelectItem>
              <SelectItem value="30day">30 Days</SelectItem>
              <SelectItem value="90day">90 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-6">
          {/* Active Users Card */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Active Users</h2>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-sm text-gray-500">Live</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <div className="text-sm text-gray-500 mb-1">Right Now</div>
                <div className="text-4xl font-bold text-[#FF0000]">
                  {formatNumber(activeUsers.rightNow)}
                </div>
                <div className="flex items-center gap-1 mt-1 text-sm text-emerald-600">
                  <TrendingUp className="h-4 w-4" />
                  <span>+24.3% vs last hour</span>
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">
                  Last 10 Minutes
                </div>
                <div className="text-4xl font-bold">
                  {formatNumber(activeUsers.lastTenMinutes)}
                </div>
                <div className="flex items-center gap-1 mt-1 text-sm text-emerald-600">
                  <TrendingUp className="h-4 w-4" />
                  <span>+18.5% vs previous</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Active Now Card */}
          <div className="mb-6">
            {mockMetrics
              .filter((m: Metric) => m.title === "Active Now")
              .map((metric: Metric) => (
                <MetricCard
                  key={metric.title}
                  title={metric.title}
                  value={metric.value}
                  change={metric.change}
                  positive={metric.positive}
                  className="text-white"
                />
              ))}
          </div>

          {/* Other Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-6">
            {mockMetrics
              .filter((m: Metric) => m.title !== "Active Now")
              .map((metric: Metric) => (
                <MetricCard
                  key={metric.title}
                  title={metric.title}
                  value={metric.value}
                  change={metric.change}
                  positive={metric.positive}
                />
              ))}
          </div>

          {/* Other Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
            <MetricCard
              title="App Installs"
              value={formatNumber(periodMetrics[timePeriod].installs)}
              change="+23.1%"
              positive={true}
            />
            <MetricCard
              title="New Posts"
              value={formatNumber(periodMetrics[timePeriod].newPosts)}
              change="+8.9%"
              positive={true}
            />
            <MetricCard
              title="New Users"
              value={formatNumber(periodMetrics[timePeriod].newUsers)}
              change="+15.3%"
              positive={true}
            />
            <MetricCard
              title="Active Creators"
              value="2.5K"
              change="+12.3%"
              positive={true}
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Real-time Activity */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-6">Real-time Activity</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="hour"
                    scale="auto"
                    padding={{ left: 10, right: 10 }}
                    allowDecimals={false}
                    axisLine={true}
                    tickLine={true}
                  />
                  <YAxis yAxisId="left" scale="linear" />
                  <YAxis yAxisId="right" orientation="right" scale="linear" />
                  <Tooltip />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="users"
                    name="Active Users"
                    stroke="#FF0000"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="posts"
                    name="New Posts"
                    stroke="#FF6666"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* Engagement Overview */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-6">
                Engagement Overview
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart 
                  data={engagementData} 
                  margin={{ top: 20, right: 30, left: 30, bottom: 5 }}
                  barCategoryGap={40}
                  barGap={0}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="type"
                    axisLine={true}
                    tickLine={false}
                    interval={0}
                    padding={{ left: 30, right: 30 }}
                  />
                  <YAxis
                    tickFormatter={(value) => formatNumber(value)}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    formatter={(value) => formatNumber(value as number)}
                  />
                  <Bar
                    dataKey="count"
                    fill="#FF0000"
                    radius={[4, 4, 0, 0]}
                    barSize={60}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                Top Performing Content
              </h3>
              <div className="space-y-4">
                {topContent.map((content, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg" />
                      <div>
                        <div className="font-medium">Content Title {i + 1}</div>
                        <div className="text-sm text-gray-500">
                          {formatNumber(content.views)} views
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-emerald-600">
                      +{content.growth.toFixed(1)}%
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Top Creators</h3>
              <div className="space-y-4">
                {topCreators.map((creator, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full" />
                      <div>
                        <div className="font-medium">Creator Name {i + 1}</div>
                        <div className="text-sm text-gray-500">
                          {formatMoney(creator.earned)} earned
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-emerald-600">
                      +{creator.growth.toFixed(1)}%
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Active Regions</h3>
              <div className="space-y-4">
                {regions.map((region) => (
                  <div
                    key={region.name}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Users className="h-5 w-5 text-gray-500" />
                      </div>
                      <div>
                        <div className="font-medium">{region.name}</div>
                        <div className="text-sm text-gray-500">
                          {formatNumber(region.users)} active users
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-emerald-600">
                      +{region.growth.toFixed(1)}%
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
