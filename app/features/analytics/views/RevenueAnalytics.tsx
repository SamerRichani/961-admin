"use client";

import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { formatMoney } from "@/lib/format";
import {
  MapPin,
  ArrowUpRight,
  DollarSign,
  ShoppingBag,
  Coins,
  Package,
  CreditCard,
  Users,
  TrendingDown,
  TrendingUp,
  Eye,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { type TimeRange as AnalyticsTimeRange } from "@/app/features/analytics/types";
import { type TimeRange as RevenueTimeRange } from "@/app/features/finance/type";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  setViewType,
  setDealsPeriod,
} from "@/app/features/analytics/redux/analyticsSlice";
import type {
  RevenueData as ReduxRevenueData,
  Location,
  Region,
  City,
} from "@/app/features/analytics/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AnalyticsTabs } from "@/app/features/analytics/components/AnalyticsTabs";
import { useState } from "react";

const COLORS = ["#FF0000", "#FF3333", "#FF6666", "#FF9999", "#FFCCCC"];

const mapTimeRange = (range: AnalyticsTimeRange): RevenueTimeRange => {
  const map: Record<AnalyticsTimeRange, RevenueTimeRange> = {
    day: "daily",
    week: "weekly",
    month: "monthly",
    quarter: "quarterly",
    year: "last_12_months",
    all: "ytd",
  };
  return map[range];
};

interface RevenueAnalyticsProps {
  timeRange: AnalyticsTimeRange;
}

export function RevenueAnalytics() {
  const { timeRange, activeTab } = useAppSelector((state) => state.analytics);
  const dispatch = useAppDispatch();
  const { viewType, dealsPeriod } = useAppSelector((state) => state.analytics);
  const {
    monthlyTrends,
    revenueSourceData,
    revenueByLocation,
    dealsMembershipData,
  } = useAppSelector((state) => state.revenueAnalytics);
  const revenueTimeRange = mapTimeRange(timeRange);
  const [expandedCountries, setExpandedCountries] = useState<string[]>([]);

  // Calculate period totals
  const currentTotal = monthlyTrends.reduce(
    (sum: number, d: ReduxRevenueData) => sum + d.current,
    0
  );
  const previousTotal = monthlyTrends.reduce(
    (sum: number, d: ReduxRevenueData) => sum + d.previous,
    0
  );
  const percentChange = ((currentTotal - previousTotal) / previousTotal) * 100;
  const avgRevenuePerUser =
    monthlyTrends[monthlyTrends.length - 1].revenuePerUser;
  const prevRevenuePerUser = monthlyTrends[0].revenuePerUser;
  const revenuePerUserChange =
    ((avgRevenuePerUser - prevRevenuePerUser) / prevRevenuePerUser) * 100;

  // Map icon strings to components
  const getIconComponent = (iconName: string) => {
    const iconMap: Record<string, any> = {
      CreditCard,
      Coins,
      ShoppingBag,
      Package,
      DollarSign,
    };
    return iconMap[iconName] || DollarSign;
  };

  const toggleCountry = (country: string) => {
    setExpandedCountries(prev => 
      prev.includes(country) 
        ? prev.filter(c => c !== country)
        : [...prev, country]
    );
  };

  return (
    <AnalyticsTabs>
      <div className="space-y-4 sm:space-y-6 mt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-base sm:text-lg font-semibold">
            Revenue Analytics
          </h2>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex flex-col gap-1 w-full sm:w-auto">
              <label className="text-sm text-gray-500">Revenue View</label>
              <Select
                value={viewType}
                onValueChange={(value) =>
                  dispatch(setViewType(value as typeof viewType))
                }
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="ytd">Year to Date</SelectItem>
                  <SelectItem value="last12">Last 12 Months</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1 w-full sm:w-auto">
              <label className="text-sm text-gray-500">Deals Period</label>
              <Select
                value={dealsPeriod}
                onValueChange={(value) =>
                  dispatch(setDealsPeriod(value as typeof dealsPeriod))
                }
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Daily</SelectItem>
                  <SelectItem value="week">Weekly</SelectItem>
                  <SelectItem value="month">Monthly</SelectItem>
                  <SelectItem value="quarter">Quarterly</SelectItem>
                  <SelectItem value="year">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-green-100 flex items-center justify-center">
                <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500">
                  Total Revenue
                </p>
                <p className="text-xl sm:text-2xl font-bold">
                  {formatMoney(currentTotal)}
                </p>
                <p className="text-xs sm:text-sm text-emerald-600 flex items-center gap-1">
                  <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4" />+
                  {percentChange.toFixed(1)}% from last {revenueTimeRange}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Users className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500">
                  Creator Earnings
                </p>
                <p className="text-xl sm:text-2xl font-bold">
                  {formatMoney(currentTotal * 0.5)}
                </p>
                <p className="text-xs sm:text-sm text-emerald-600 flex items-center gap-1">
                  <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4" />+
                  {(percentChange * 1.1).toFixed(1)}% from last{" "}
                  {revenueTimeRange}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-purple-100 flex items-center justify-center">
                <Eye className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500">
                  Revenue per View
                </p>
                <p className="text-xl sm:text-2xl font-bold">
                  {formatMoney(0.012)}
                </p>
                <p className="text-xs sm:text-sm text-emerald-600 flex items-center gap-1">
                  <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4" />
                  +5.2% from last {revenueTimeRange}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-orange-100 flex items-center justify-center">
                <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500">
                  Creator Earnings per View
                </p>
                <p className="text-xl sm:text-2xl font-bold">
                  {formatMoney(0.006)}
                </p>
                <p className="text-xs sm:text-sm text-emerald-600 flex items-center gap-1">
                  <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4" />
                  +5.2% from last {revenueTimeRange}
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg font-semibold">
                Revenue Over Time
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 sm:mb-6">
              <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                <div className="text-xs sm:text-sm text-gray-500">
                  Current Period
                </div>
                <div className="text-xl sm:text-2xl font-bold">
                  {formatMoney(currentTotal)}
                </div>
              </div>
              <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                <div className="text-xs sm:text-sm text-gray-500">
                  Revenue per User
                </div>
                <div className="text-xl sm:text-2xl font-bold">
                  {formatMoney(avgRevenuePerUser)}
                </div>
                <div className="text-xs sm:text-sm text-emerald-600 flex items-center gap-1 mt-1">
                  <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4" />+
                  {revenuePerUserChange.toFixed(1)}%
                </div>
              </div>
              <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                <div className="text-xs sm:text-sm text-gray-500">Change</div>
                <div
                  className={`text-xl sm:text-2xl font-bold ${
                    percentChange >= 0 ? "text-emerald-600" : "text-red-600"
                  }`}
                >
                  {percentChange >= 0 ? "+" : ""}
                  {percentChange.toFixed(1)}%
                </div>
              </div>
            </div>

            <div className="h-[250px] sm:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    axisLine={true}
                    tickLine={true}
                    scale="auto"
                    padding={{ left: 10, right: 10 }}
                    allowDecimals={false}
                    fontSize={12}
                  />
                  <YAxis
                    tickFormatter={(value) => `$${value / 1000}K`}
                    axisLine={true}
                    tickLine={true}
                    scale="linear"
                    allowDecimals={false}
                    fontSize={12}
                  />
                  <Tooltip
                    formatter={(value: number) => formatMoney(value)}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="current"
                    name="Current Period"
                    stroke="#FF0000"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenuePerUser"
                    name="Revenue per User"
                    stroke="#FF6666"
                    strokeWidth={2}
                    dot={false}
                    yAxisId="right"
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tickFormatter={(value) => `$${value}`}
                    axisLine={true}
                    tickLine={true}
                    fontSize={12}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <Card className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-900">
                  Revenue by Location
                </h3>
                {revenueByLocation.length > 0 && (
                  <button
                    onClick={() => setExpandedCountries(prev => 
                      prev.length === revenueByLocation.length 
                        ? [] 
                        : revenueByLocation.map(l => l.country)
                    )}
                    className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {expandedCountries.length === revenueByLocation.length ? 'Collapse All' : 'Expand All'}
                  </button>
                )}
              </div>
              <div className="h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent hover:scrollbar-thumb-gray-300">
                <div className="space-y-2">
                  {revenueByLocation.map((location: Location) => (
                    <div
                      key={location.country}
                      className="bg-gray-50 rounded-lg overflow-hidden"
                    >
                      <button
                        onClick={() => toggleCountry(location.country)}
                        className="w-full p-3 flex items-center justify-between hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          {location.regions && location.regions.length > 0 && (
                            expandedCountries.includes(location.country) 
                              ? <ChevronDown className="h-4 w-4 text-gray-500" />
                              : <ChevronRight className="h-4 w-4 text-gray-500" />
                          )}
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3 w-3 text-[#FF0000]" />
                            <h4 className="text-sm font-medium">
                              {location.country}
                            </h4>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-xs text-gray-500">
                            {location.percentage}% of total
                          </div>
                          <div className="text-sm font-bold text-[#FF0000]">
                            {formatMoney(location.revenue ?? 0)}
                          </div>
                        </div>
                      </button>

                      {expandedCountries.includes(location.country) && location.regions && (
                        <div className="px-3 pb-3 space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
                          {location.regions.map((region: Region) => (
                            <div key={region.name} className="space-y-1.5">
                              <div className="flex items-center justify-between text-xs border-b border-gray-200 pb-1">
                                <span className="font-medium">{region.name}</span>
                                <span className="font-medium text-[#FF0000]">{formatMoney(region.revenue ?? 0)}</span>
                              </div>
                              <div className="pl-3 space-y-1.5">
                                {region.cities.map((city: City) => (
                                  <div
                                    key={city.name}
                                    className="flex items-center justify-between text-xs text-gray-600"
                                  >
                                    <span>{city.name}</span>
                                    <span>{formatMoney(city.revenue ?? 0)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-900">
                  Top Revenue Cities (Lebanon)
                </h3>
                <div className="text-xs text-gray-500">
                  Total Revenue: {formatMoney(revenueByLocation[0]?.regions?.reduce((acc, region) => 
                    acc + region.cities.reduce((sum, city) => sum + (city.revenue ?? 0), 0), 0) ?? 0)}
                </div>
              </div>
              
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={
                      revenueByLocation[0]?.regions
                        ?.flatMap((region: Region) => region.cities)
                        .sort(
                          (a: City, b: City) =>
                            (b.revenue ?? 0) - (a.revenue ?? 0)
                        )
                        .slice(0, 8) || []
                    }
                    layout="vertical"
                    margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis
                      type="number"
                      tickFormatter={(value) => `$${value / 1000}K`}
                    />
                    <YAxis
                      dataKey="name"
                      type="category"
                      width={70}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11 }}
                      style={{ fontSize: 11 }}
                    />
                    <Tooltip
                      formatter={(value: any) => formatMoney(Number(value))}
                      labelFormatter={(label) => `City: ${label}`}
                    />
                    <Bar
                      dataKey="revenue"
                      fill="#FF0000"
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-3">
                <div className="p-2.5 bg-gray-50 rounded-lg">
                  <div className="text-xs text-gray-500">Top Performing City</div>
                  <div className="text-sm font-medium mt-1">
                    {revenueByLocation[0]?.regions
                      ?.flatMap((region: Region) => region.cities)
                      .sort((a: City, b: City) => (b.revenue ?? 0) - (a.revenue ?? 0))[0]?.name}
                  </div>
                  <div className="text-sm font-bold text-[#FF0000] mt-0.5">
                    {formatMoney(revenueByLocation[0]?.regions
                      ?.flatMap((region: Region) => region.cities)
                      .sort((a: City, b: City) => (b.revenue ?? 0) - (a.revenue ?? 0))[0]?.revenue ?? 0)}
                  </div>
                </div>

                <div className="p-2.5 bg-gray-50 rounded-lg">
                  <div className="text-xs text-gray-500">Average Revenue per City</div>
                  <div className="text-sm font-medium mt-1">
                    {revenueByLocation[0]?.regions
                      ?.flatMap((region: Region) => region.cities).length} Cities
                  </div>
                  <div className="text-sm font-bold text-[#FF0000] mt-0.5">
                    {formatMoney((revenueByLocation[0]?.regions?.reduce((acc, region) => 
                      acc + region.cities.reduce((sum, city) => sum + (city.revenue ?? 0), 0), 0) ?? 0) / 
                      (revenueByLocation[0]?.regions?.flatMap((region: Region) => region.cities).length || 1))}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">
              Revenue Breakdown by Source
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="h-[250px] sm:h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={revenueSourceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {revenueSourceData.map((entry, index) => (
                        <Cell
                          key={entry.name}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => formatMoney(value)}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <h3 className="font-medium text-xs sm:text-sm text-gray-500">
                  Revenue Sources
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs sm:text-sm">
                    <thead>
                      <tr className="text-gray-500">
                        <th className="text-left font-medium py-2">Source</th>
                        <th className="text-right font-medium py-2">Amount</th>
                        <th className="text-right font-medium py-2">%</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {revenueSourceData.map((source, index) => {
                        const Icon = getIconComponent(source.icon);
                        const total = revenueSourceData.reduce(
                          (sum, item) => sum + item.value,
                          0
                        );
                        const percentage = (
                          (source.value / total) *
                          100
                        ).toFixed(1);
                        return (
                          <tr key={source.name}>
                            <td className="py-2 flex items-center gap-2">
                              <Icon className="h-4 w-4 text-gray-500" />
                              {source.name}
                            </td>
                            <td className="text-right py-2">
                              {formatMoney(source.value)}
                            </td>
                            <td className="text-right py-2">{percentage}%</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-semibold text-gray-900">
                Deals Membership
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <DollarSign className="h-8 w-8 text-[#FF0000]" />
                  <div>
                    <div className="text-sm text-gray-500">Revenue ({dealsPeriod})</div>
                    <div className="text-2xl font-bold mt-1">
                      {formatMoney(dealsMembershipData.periods[dealsPeriod].revenue)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="h-8 w-8 text-blue-600" />
                  <div>
                    <div className="text-sm text-gray-500">Total Members</div>
                    <div className="text-2xl font-bold mt-1">
                      {dealsMembershipData.totalMembers.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Active: {dealsMembershipData.activeMembers.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="h-8 w-8 text-emerald-600" />
                  <div>
                    <div className="text-sm text-gray-500">New Subscriptions</div>
                    <div className="text-2xl font-bold mt-1">
                      {dealsMembershipData.periods[dealsPeriod].newSubs.toLocaleString()}
                    </div>
                    <div className="text-sm text-emerald-600 mt-1">
                      +12.5% vs last {dealsPeriod}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingDown className="h-8 w-8 text-red-600" />
                  <div>
                    <div className="text-sm text-gray-500">Churn Rate</div>
                    <div className="text-2xl font-bold mt-1">
                      {dealsMembershipData.periods[dealsPeriod].churn}%
                    </div>
                    <div className="text-sm text-emerald-600 mt-1">
                      -0.8% vs last {dealsPeriod}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-base font-medium text-gray-900">
                  Subscription Distribution
                </h4>
                <div className="text-sm text-gray-500">
                  Total Revenue: {formatMoney(dealsMembershipData.subscriptionTypes.reduce((acc, type) => acc + type.revenue, 0))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {dealsMembershipData.subscriptionTypes.map((type, index) => (
                  <div key={type.type} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {type.type}
                      </div>
                      <div className="text-xs text-gray-500">
                        {type.members.toLocaleString()} members
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-[#FF0000]">
                        {formatMoney(type.revenue)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {((type.members / dealsMembershipData.totalMembers) * 100).toFixed(1)}% of total
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </AnalyticsTabs>
  );
}

export default RevenueAnalytics;
