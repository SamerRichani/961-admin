"use client"

import { Card } from '@/components/ui/card';
import { ArrowUpRight, Users } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TopPerformers } from '@/app/features/finance/components/RevenuePage/TopPerformers';
import { formatMoney } from '@/lib/format';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setTimeRange } from '@/app/features/finance/redux/financeSlice';
import { type TimeRange } from '@/app/features/finance/type';
import { useEffect, useRef, useState } from 'react';
import {
  setTopCreators,
  setTopLocations,
  setTopAdvertisers,
  setError,
} from '@/app/features/finance/redux/topPerformersSlice';
import { RootState } from '@/redux/store';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export function RevenuePage() {
  const dispatch = useAppDispatch();
  const timeRange = useAppSelector((state) => state.finance.timeRange);
  // Mock data for visual frontend-only display
  const topCreators = [
    { id: '1', name: 'Creator A', totalRevenue: 120000, totalActiveUsers: 1500 },
    { id: '2', name: 'Creator B', totalRevenue: 95000, totalActiveUsers: 1200 },
  ];
  const topLocations = [
    { id: '1', name: 'Lebanon', totalRevenue: 80000, totalActiveUsers: 900 },
    { id: '2', name: 'UAE', totalRevenue: 60000, totalActiveUsers: 700 },
  ];
  const topAdvertisers = [
    { id: '1', name: 'Advertiser X', totalRevenue: 40000, totalActiveUsers: 300 },
    { id: '2', name: 'Advertiser Y', totalRevenue: 30000, totalActiveUsers: 200 },
  ];
  const error = null;
  const [isLoading] = useState(false);

  console.log('RevenuePage render - timeRange:', timeRange, 'isLoading:', isLoading);

  const totalRevenue =
    topCreators.reduce((sum, c) => sum + c.totalRevenue, 0) +
    topLocations.reduce((sum, l) => sum + l.totalRevenue, 0) +
    topAdvertisers.reduce((sum, a) => sum + a.totalRevenue, 0);

  const totalActiveUsers =
    topCreators.reduce((sum, c) => sum + c.totalActiveUsers, 0) +
    topLocations.reduce((sum, l) => sum + l.totalActiveUsers, 0) +
    topAdvertisers.reduce((sum, a) => sum + a.totalActiveUsers, 0);

  const averageRevenuePerUser = totalRevenue / (totalActiveUsers || 1);

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 p-4 sm:p-8">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen bg-gray-50 p-4 sm:p-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-[2000px] mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-8 mb-8">
          <h1 className="text-2xl font-semibold">Revenue Dashboard</h1>
          <Select value={timeRange} onValueChange={(value) => dispatch(setTimeRange(value as TimeRange))}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Today</SelectItem>
              <SelectItem value="weekly">This Week</SelectItem>
              <SelectItem value="monthly">This Month</SelectItem>
              <SelectItem value="quarterly">This Quarter</SelectItem>
              <SelectItem value="ytd">Year to Date</SelectItem>
              <SelectItem value="last_12_months">Last 12 Months</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <ArrowUpRight className="h-6 w-6 text-red-600" />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold truncate">{formatMoney(totalRevenue)}</p>
                <p className="text-sm text-emerald-600 flex items-center gap-1">
                  <ArrowUpRight className="h-4 w-4 shrink-0" />
                  <span className="truncate">+25.8% from last {timeRange}</span>
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                <Users className="h-6 w-6 text-emerald-600" />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-gray-500">Active Subscribers</p>
                <p className="text-2xl font-bold truncate">{totalActiveUsers.toLocaleString()}</p>
                <p className="text-sm text-emerald-600 flex items-center gap-1">
                  <ArrowUpRight className="h-4 w-4 shrink-0" />
                  <span className="truncate">+12.3% from last {timeRange}</span>
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <ArrowUpRight className="h-6 w-6 text-blue-600" />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-gray-500">Average Revenue per User</p>
                <p className="text-2xl font-bold truncate">{formatMoney(averageRevenuePerUser)}</p>
                <p className="text-sm text-emerald-600 flex items-center gap-1">
                  <ArrowUpRight className="h-4 w-4 shrink-0" />
                  <span className="truncate">+8.7% from last {timeRange}</span>
                </p>
              </div>
            </div>
          </Card>
        </div>

        <TopPerformers />
      </div>
    </div>
  );
}
