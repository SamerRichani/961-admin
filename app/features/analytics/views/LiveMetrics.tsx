"use client";

import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { formatNumber, formatMoney } from "@/lib/format";
import {
  Users,
  Globe,
  DollarSign,
  Play,
  FileText,
  Radio,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { updateLiveMetrics } from "@/app/features/analytics/redux/analyticsSlice";
import { AnalyticsTabs } from "@/app/features/analytics/components/AnalyticsTabs";

const COLORS = ["#FF0000", "#FF3333", "#FF6666", "#FF9999", "#FFCCCC"];

export function LiveMetrics() {
  const dispatch = useAppDispatch();
  const liveMetrics = useAppSelector((state) => state.analytics.liveMetrics);

  useEffect(() => {
    // Simulate real-time data updates
    const interval = setInterval(() => {
      const mockData = {
        activeUsers: Math.floor(Math.random() * 50000) + 10000,
        webSessions: Math.floor(Math.random() * 20000) + 5000,
        mobileSessions: Math.floor(Math.random() * 30000) + 8000,
        revenueToday: Math.floor(Math.random() * 50000) + 10000,
        adRevenue: Math.floor(Math.random() * 20000) + 5000,
        coinRevenue: Math.floor(Math.random() * 15000) + 3000,
        commerceRevenue: Math.floor(Math.random() * 10000) + 2000,
        subscriptionRevenue: Math.floor(Math.random() * 5000) + 1000,
        installations: Math.floor(Math.random() * 1000) + 200,
        uninstalls: Math.floor(Math.random() * 100) + 20,
        topContent: [
          {
            title: "Live Stream: Breaking News",
            views: Math.floor(Math.random() * 50000) + 10000,
            type: "stream" as const,
          },
          {
            title: "Viral Video: Street Food Tour",
            views: Math.floor(Math.random() * 30000) + 8000,
            type: "video" as const,
          },
          {
            title: "Trending Article: Tech News",
            views: Math.floor(Math.random() * 20000) + 5000,
            type: "article" as const,
          },
        ],
        activeByCountry: [
          {
            country: "Lebanon",
            users: Math.floor(Math.random() * 20000) + 5000,
          },
          { country: "UAE", users: Math.floor(Math.random() * 15000) + 3000 },
          { country: "KSA", users: Math.floor(Math.random() * 10000) + 2000 },
          { country: "Qatar", users: Math.floor(Math.random() * 5000) + 1000 },
          { country: "Other", users: Math.floor(Math.random() * 3000) + 500 },
        ],
      };
      dispatch(updateLiveMetrics(mockData));
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [dispatch]);

  const getContentIcon = (type: "video" | "article" | "stream") => {
    switch (type) {
      case "video":
        return <Play className="h-4 w-4 text-blue-500" />;
      case "article":
        return <FileText className="h-4 w-4 text-green-500" />;
      case "stream":
        return <Radio className="h-4 w-4 text-purple-500" />;
    }
  };

  return (
    <AnalyticsTabs>
      <div className="space-y-4 sm:space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Card className="p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-red-100 flex items-center justify-center">
                <Users className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Active Users</p>
                <p className="text-xl sm:text-2xl font-bold">
                  {formatNumber(liveMetrics.activeUsers)}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Globe className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Web Sessions</p>
                <p className="text-xl sm:text-2xl font-bold">
                  {formatNumber(liveMetrics.webSessions)}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-green-100 flex items-center justify-center">
                <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Revenue Today</p>
                <p className="text-xl sm:text-2xl font-bold">
                  {formatMoney(liveMetrics.revenueToday)}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-purple-100 flex items-center justify-center">
                <Users className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Mobile Sessions</p>
                <p className="text-xl sm:text-2xl font-bold">
                  {formatNumber(liveMetrics.mobileSessions)}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Revenue Breakdown */}
        <Card className="p-4 sm:p-6">
          <h2 className="text-lg font-semibold mb-4 sm:mb-6">
            Revenue Breakdown
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            <div>
              <div className="text-sm text-gray-500">Ad Revenue</div>
              <div className="text-xl sm:text-2xl font-bold">
                {formatMoney(liveMetrics.adRevenue)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Coin Revenue</div>
              <div className="text-xl sm:text-2xl font-bold">
                {formatMoney(liveMetrics.coinRevenue)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Commerce</div>
              <div className="text-xl sm:text-2xl font-bold">
                {formatMoney(liveMetrics.commerceRevenue)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Subscriptions</div>
              <div className="text-xl sm:text-2xl font-bold">
                {formatMoney(liveMetrics.subscriptionRevenue)}
              </div>
            </div>
          </div>
        </Card>

        {/* App Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <Card className="p-4 sm:p-6">
            <h2 className="text-lg font-semibold mb-4 sm:mb-6">
              App Statistics
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              <div>
                <div className="text-sm text-gray-500">Installations</div>
                <div className="text-xl sm:text-2xl font-bold text-emerald-600 flex items-center gap-1">
                  <ArrowUpRight className="h-4 w-4" />
                  {formatNumber(liveMetrics.installations)}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Uninstalls</div>
                <div className="text-xl sm:text-2xl font-bold text-red-600 flex items-center gap-1">
                  <ArrowDownRight className="h-4 w-4" />
                  {formatNumber(liveMetrics.uninstalls)}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-6">
            <h2 className="text-lg font-semibold mb-4 sm:mb-6">
              Top Performing Content
            </h2>
            <div className="space-y-3 sm:space-y-4">
              {liveMetrics.topContent.map((content, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getContentIcon(content.type)}
                    <span className="font-medium text-sm sm:text-base">
                      {content.title}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {formatNumber(content.views)} views
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Geographic Distribution */}
        <Card className="p-4 sm:p-6">
          <h2 className="text-lg font-semibold mb-4 sm:mb-6">
            Active Users by Country
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="h-[250px] sm:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={liveMetrics.activeByCountry}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="country" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => formatNumber(value as number)}
                  />
                  <Bar
                    dataKey="users"
                    fill="#FF0000"
                    radius={[4, 4, 0, 0]}
                    barSize={60}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="h-[250px] sm:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={liveMetrics.activeByCountry}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="users"
                    nameKey="country"
                    stroke="none"
                    label={(entry) => entry.country}
                  >
                    {liveMetrics.activeByCountry.map((entry, index) => (
                      <Cell
                        key={entry.country}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name, props) => [
                      formatNumber(value as number),
                      props.payload.country
                    ]}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Legend 
                    formatter={(value, entry) => {
                      if (entry && entry.payload) {
                        return (entry.payload as any).country || value;
                      }
                      return value;
                    }}
                    verticalAlign="middle" 
                    align="right"
                    layout="vertical"
                    iconType="circle"
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>
      </div>
    </AnalyticsTabs>
  );
}
