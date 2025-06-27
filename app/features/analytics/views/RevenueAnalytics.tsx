"use client";

import React, { useState } from "react";
import { DollarSign, Eye, Users, ChevronDown, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppSelector } from "@/redux/hooks";

function getAdjustedValue(baseValue: number, period: string) {
  switch (period) {
    case "today":
    case "day":
      return baseValue;
    case "7days":
    case "week":
      return Math.round(baseValue * 1.1);
    case "30days":
    case "month":
      return Math.round(baseValue * 1.2);
    default:
      return Math.round(baseValue * 1.3);
  }
}

function getAdjustedPercentage(basePercentage: string, period: string) {
  let base = parseFloat(basePercentage);
  let adjusted = base;
  switch (period) {
    case "today":
    case "day":
      adjusted = base;
      break;
    case "7days":
    case "week":
      adjusted = base * 1.1;
      break;
    case "30days":
    case "month":
      adjusted = base * 1.2;
      break;
    default:
      adjusted = base * 1.3;
  }
  return (adjusted > 0 ? "+" : "") + adjusted.toFixed(1) + "%";
}

export function RevenueAnalytics() {
  const { timeRange } = useAppSelector((state) => state.analytics);
  const [expandedSources, setExpandedSources] = useState<string[]>([]);
  const timePeriod = timeRange === "day" ? "today" : timeRange === "week" ? "7days" : timeRange === "month" ? "30days" : timeRange;

  const toggleExpanded = (source: string) => {
    setExpandedSources((prev) =>
      prev.includes(source)
        ? prev.filter((s) => s !== source)
        : [...prev, source]
    );
  };

  const getRevenuePerView = (period: string) => {
    return (0.0045 * (period === 'today' ? 1 : period === '7days' ? 1.1 : period === '30days' ? 1.2 : 1.3)).toFixed(4);
  };

  const getCreatorEarningsPerView = (period: string) => {
    return (0.0028 * (period === 'today' ? 1 : period === '7days' ? 1.1 : period === '30days' ? 1.2 : 1.3)).toFixed(4);
  };

  const getAppRevenuePerUser = (period: string) => {
    const appRevenue = getAdjustedValue(245800, period);
    const totalUsers = getAdjustedValue(573800, period);
    return (appRevenue / totalUsers).toFixed(2);
  };

  const getAvgSpendPerUser = (period: string) => {
    const gmv = getAdjustedValue(2450000, period);
    const totalUsers = getAdjustedValue(573800, period);
    return (gmv / totalUsers).toFixed(2);
  };

  return (
    <div className="space-y-6">
      {/* Revenue Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500 font-bold">Revenue per User</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">App Revenue per User</span>
                <div className="text-right">
                  <span className="text-sm font-medium text-gray-900">
                    ${getAppRevenuePerUser(timePeriod)}
                  </span>
                  <span className="text-blue-600 text-sm font-medium ml-2">
                    {getAdjustedPercentage('+18.2%', timePeriod)}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Avg Spend per User</span>
                <div className="text-right">
                  <span className="text-sm font-medium text-gray-900">
                    ${getAvgSpendPerUser(timePeriod)}
                  </span>
                  <span className="text-blue-600 text-sm font-medium ml-2">
                    {getAdjustedPercentage('+24.7%', timePeriod)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="mb-4">
              <p className="text-sm text-gray-500 font-bold">Revenue</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">GMV</span>
                <div className="text-right">
                  <span className="text-sm font-medium text-gray-900">
                    ${(getAdjustedValue(2450000, timePeriod) / 1000000).toFixed(2)}M
                  </span>
                  <span className="text-blue-600 text-sm font-medium ml-2">
                    {getAdjustedPercentage('+18.5%', timePeriod)}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">App</span>
                <div className="text-right">
                  <span className="text-sm font-medium text-gray-900">
                    ${(getAdjustedValue(245800, timePeriod) / 1000).toFixed(1)}K
                  </span>
                  <span className="text-blue-600 text-sm font-medium ml-2">
                    {getAdjustedPercentage('+22.1%', timePeriod)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="mb-4">
              <p className="text-sm text-gray-500 font-bold">Rev/View</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">App</span>
                <div className="text-right">
                  <span className="text-sm font-medium text-gray-900">
                    ${getRevenuePerView(timePeriod)}
                  </span>
                  <span className="text-blue-600 text-sm font-medium ml-2">
                    {getAdjustedPercentage('+8.3%', timePeriod)}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Creator Earnings</span>
                <div className="text-right">
                  <span className="text-sm font-medium text-gray-900">
                    ${getCreatorEarningsPerView(timePeriod)}
                  </span>
                  <span className="text-blue-600 text-sm font-medium ml-2">
                    {getAdjustedPercentage('+12.7%', timePeriod)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Sources */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Sources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { 
                source: 'Coin Purchases', 
                amount: getAdjustedValue(98200, timePeriod), 
                trend: getAdjustedPercentage('+28.7%', timePeriod), 
                percentage: 40.0,
                breakdown: [
                  { item: 'Premium Features', amount: getAdjustedValue(35000, timePeriod), percentage: 35.7 },
                  { item: 'Content Boosts', amount: getAdjustedValue(28000, timePeriod), percentage: 28.5 },
                  { item: 'Virtual Gifts', amount: getAdjustedValue(20000, timePeriod), percentage: 20.4 },
                  { item: 'Profile Upgrades', amount: getAdjustedValue(15200, timePeriod), percentage: 15.4 },
                ]
              },
              { source: 'Advertising', amount: getAdjustedValue(67400, timePeriod), trend: getAdjustedPercentage('+15.2%', timePeriod), percentage: 27.4 },
              { source: '961+ Membership', amount: getAdjustedValue(45800, timePeriod), trend: getAdjustedPercentage('+12.4%', timePeriod), percentage: 18.6 },
              { 
                source: 'Commerce', 
                amount: getAdjustedValue(34400, timePeriod), 
                trend: getAdjustedPercentage('+22.1%', timePeriod), 
                percentage: 14.0,
                breakdown: [
                  { item: 'Marketplace Sales', amount: getAdjustedValue(18000, timePeriod), percentage: 52.3 },
                  { item: 'Service Bookings', amount: getAdjustedValue(10000, timePeriod), percentage: 29.1 },
                  { item: 'Digital Products', amount: getAdjustedValue(4200, timePeriod), percentage: 12.2 },
                  { item: 'Delivery Fees', amount: getAdjustedValue(2200, timePeriod), percentage: 6.4 },
                ]
              },
            ].map((source) => (
              <div key={source.source} className="border border-gray-100 rounded-lg">
                <div 
                  className={`flex items-center justify-between p-4 ${source.breakdown ? 'cursor-pointer hover:bg-gray-50' : ''}`}
                  onClick={() => source.breakdown && toggleExpanded(source.source)}
                >
                  <div className="flex items-center space-x-4">
                    <span className="font-medium text-gray-900">{source.source}</span>
                    <span className="text-sm text-gray-500">({source.percentage}%)</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-lg font-bold text-gray-900">${(source.amount / 1000).toFixed(1)}K</span>
                    <span className="text-sm text-blue-600 font-medium">{source.trend}</span>
                    {source.breakdown ? (
                      expandedSources.includes(source.source) 
                        ? <ChevronDown className="w-4 h-4 text-gray-400" />
                        : <ChevronRight className="w-4 h-4 text-gray-400" />
                    ) : (
                      <div className="w-4 h-4"></div> // Placeholder for consistent spacing
                    )}
                  </div>
                </div>
                
                {source.breakdown && expandedSources.includes(source.source) && (
                  <div className="px-4 pb-4 border-t border-gray-100 bg-gray-50">
                    <div className="space-y-2 pt-3">
                      {source.breakdown.map((item) => (
                        <div key={item.item} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="text-sm text-gray-700">{item.item}</span>
                            <span className="text-xs text-gray-500">({item.percentage}%)</span>
                          </div>
                          <span className="text-sm font-medium text-blue-600">${(item.amount / 1000).toFixed(1)}K</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top-up Methods */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Top-up Methods</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { method: 'Credit Card', amount: getAdjustedValue(125400, timePeriod), frequency: getAdjustedValue(8420, timePeriod), percentage: 35.2 },
              { method: 'E-Transfer', amount: getAdjustedValue(89750, timePeriod), frequency: getAdjustedValue(6890, timePeriod), percentage: 25.2 },
              { method: 'Agent', amount: getAdjustedValue(67320, timePeriod), frequency: getAdjustedValue(5240, timePeriod), percentage: 18.9 },
              { method: 'Pickup', amount: getAdjustedValue(45890, timePeriod), frequency: getAdjustedValue(3680, timePeriod), percentage: 12.9 },
              { method: 'Office', amount: getAdjustedValue(23150, timePeriod), frequency: getAdjustedValue(1890, timePeriod), percentage: 6.5 },
              { method: 'Other', amount: getAdjustedValue(4680, timePeriod), frequency: getAdjustedValue(340, timePeriod), percentage: 1.3 },
            ].map((method) => (
              <div key={method.method} className="p-4 border border-gray-100 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{method.method}</span>
                  <span className="text-sm text-gray-500">{method.percentage}%</span>
                </div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">Amount</span>
                  <span className="text-sm font-semibold text-gray-900">${method.amount.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">Frequency</span>
                  <span className="text-sm font-semibold text-gray-900">{method.frequency.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Membership Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Membership</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${(getAdjustedValue(45800, timePeriod) / 1000).toFixed(1)}K</p>
              <p className="text-sm text-blue-600 font-medium">{getAdjustedPercentage('+12.4%', timePeriod)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Total Members</p>
              <p className="text-2xl font-bold text-gray-900">{(getAdjustedValue(8200, timePeriod) / 1000).toFixed(1)}K</p>
              <p className="text-sm text-blue-600 font-medium">+{getAdjustedValue(892, timePeriod)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Active Members</p>
              <p className="text-2xl font-bold text-gray-900">{(getAdjustedValue(6800, timePeriod) / 1000).toFixed(1)}K</p>
              <p className="text-sm text-blue-600 font-medium">+{getAdjustedValue(234, timePeriod)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Churn Rate</p>
              <p className="text-2xl font-bold text-gray-900">{(12.3 * (timePeriod === 'today' ? 1 : timePeriod === '7days' ? 0.95 : 0.9)).toFixed(1)}%</p>
              <p className="text-sm text-blue-600 font-medium">-{(2.1 * (timePeriod === 'today' ? 1 : timePeriod === '7days' ? 1.1 : 1.2)).toFixed(1)}%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default RevenueAnalytics;
