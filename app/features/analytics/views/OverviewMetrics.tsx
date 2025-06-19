"use client";

import { Card } from "@/components/ui/card";
import {
  Users,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  TrendingUp,
  Store,
  Calendar,
  Activity,
  Target,
} from "lucide-react";
import { formatNumber, formatMoney } from "@/lib/format";
import { useAppSelector } from "@/redux/hooks";
import { AnalyticsTabs } from "@/app/features/analytics/components/AnalyticsTabs";

const retentionData = {
  oneDay: 85.2,
  sevenDay: 72.8,
  thirtyDay: 64.5,
  churnRate: 8.5,
};

const installData = {
  total: 89300,
  ios: 45200,
  android: 44100,
  uninstalls: 2100,
};

export function OverviewMetrics() {
  const { timeRange, activeTab } = useAppSelector((state) => state.analytics);

  const renderMetricCard = (
    title: string,
    value: string,
    change: string,
    icon: JSX.Element,
    bgColor: string,
    textColor: string,
    subMetrics?: { label: string; value: string }[]
  ) => (
    <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className={`h-12 w-12 rounded-full ${bgColor} flex items-center justify-center`}>
            {icon}
          </div>
          <div className="flex items-center gap-1 text-sm text-emerald-600">
            <ArrowUpRight className="h-4 w-4" />
            <span>{change}</span>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm text-gray-500 mb-1">{title}</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>

        {subMetrics && (
          <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-3">
            {subMetrics.map((metric, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-gray-500">{metric.label}</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">{metric.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );

  return (
    <AnalyticsTabs>
      <div className="mt-6 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {renderMetricCard(
            "Total Users",
            "573.8K",
            "+15.3% from last " + timeRange,
            <Users className="h-6 w-6 text-blue-600" />,
            "bg-blue-100",
            "text-blue-600",
            [
              { label: "New Users (Today)", value: "+1.2K" },
              { label: "New Users (YTD)", value: "+284.5K" },
              { label: "Last 12 Months", value: "+892.3K" },
            ]
          )}

          {renderMetricCard(
            "Active Users",
            "24.5K",
            "+12.5% from last " + timeRange,
            <Target className="h-6 w-6 text-orange-600" />,
            "bg-orange-100",
            "text-orange-600",
            [
              { label: "Daily Active", value: "24.5K" },
              { label: "Weekly Active", value: "145.2K" },
              { label: "Monthly Active", value: "573.8K" },
            ]
          )}

          {renderMetricCard(
            "Session Duration",
            "32m 45s",
            "+5.7% from last " + timeRange,
            <Clock className="h-6 w-6 text-green-600" />,
            "bg-green-100",
            "text-green-600",
            [
              { label: "Sessions Per User", value: "4.2/day" },
              { label: "Monthly Sessions", value: "28.5/user" },
              { label: "Bounce Rate", value: "24.8%" },
            ]
          )}

          {renderMetricCard(
            "App Installs",
            formatNumber(installData.total),
            "+23.1% from last " + timeRange,
            <Download className="h-6 w-6 text-purple-600" />,
            "bg-purple-100",
            "text-purple-600",
            [
              { label: "iOS", value: `${formatNumber(installData.ios)} (${((installData.ios / installData.total) * 100).toFixed(1)}%)` },
              { label: "Android", value: `${formatNumber(installData.android)} (${((installData.android / installData.total) * 100).toFixed(1)}%)` },
              { label: "Uninstalls", value: `${formatNumber(installData.uninstalls)} (${((installData.uninstalls / installData.total) * 100).toFixed(1)}%)` },
            ]
          )}

          {renderMetricCard(
            "Retention Rate",
            "78.5%",
            "+3.2% from last " + timeRange,
            <TrendingUp className="h-6 w-6 text-red-600" />,
            "bg-red-100",
            "text-red-600",
            [
              { label: "1-Day", value: `${retentionData.oneDay}%` },
              { label: "7-Day", value: `${retentionData.sevenDay}%` },
              { label: "30-Day", value: `${retentionData.thirtyDay}%` },
              { label: "Churn Rate", value: `${retentionData.churnRate}%` },
            ]
          )}

          {renderMetricCard(
            "Total Transactions",
            formatMoney(1250000),
            "+18.5% from last " + timeRange,
            <Store className="h-6 w-6 text-emerald-600" />,
            "bg-emerald-100",
            "text-emerald-600",
            [
              { label: "Commerce", value: formatMoney(450000) },
              { label: "Coin Purchases", value: formatMoney(350000) },
              { label: "Ads", value: formatMoney(250000) },
              { label: "Subscriptions", value: formatMoney(200000) },
            ]
          )}
        </div>
      </div>
    </AnalyticsTabs>
  );
}
