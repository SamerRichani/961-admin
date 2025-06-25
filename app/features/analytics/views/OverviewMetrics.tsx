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
    textColor: string,
    subMetrics?: { label: string; value: string }[]
  ) => {
    // Split change into percentage and period
    const match = change.match(/([+-]?\d+\.?\d*)% from last (.+)/);
    let percent = change;
    if (match) {
      percent = match[1] + '%';
    }
    return (
      <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm text-gray-500 flex items-center gap-2">{title}</h3>
              <span className="text-xs flex items-center gap-1">
                <ArrowUpRight className="h-3 w-3 text-green-500" />
                <span className="font-bold text-green-500">{percent}</span>
              </span>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
            </div>
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
  };

  return (
    <div className="mt-6 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {renderMetricCard(
          "Total Users",
          "573.8K",
          "+15.3% from last " + timeRange,
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
          "text-purple-600",
          [
            { label: "iOS", value: `${formatNumber(installData.ios)} (${((installData.ios / installData.total) * 100).toFixed(1)}%)` },
            { label: "Android", value: `${formatNumber(installData.android)} (${((installData.android / installData.total) * 100).toFixed(1)}%)` },
            { label: "Uninstalls", value: `${formatNumber(installData.uninstalls)} (${((installData.uninstalls / installData.total) * 100).toFixed(1)}%)` },
          ]
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderMetricCard(
          "Retention Rate",
          "78.5%",
          "+3.2% from last " + timeRange,
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
  );
}
