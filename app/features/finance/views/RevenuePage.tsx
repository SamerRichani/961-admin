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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export function RevenuePage() {
  const dispatch = useAppDispatch();
  const timeRange = useAppSelector((state) => state.finance.timeRange);
  const { topCreators, topLocations, topAdvertisers, error } = useAppSelector(
    (state) => state.topPerformers
  );
  const [isLoading, setIsLoading] = useState(false);
  const isFetching = useRef(false);

  console.log('RevenuePage render - timeRange:', timeRange, 'isLoading:', isLoading);

  useEffect(() => {
    console.log('useEffect triggered - timeRange:', timeRange);
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchAllData = async () => {
      if (isFetching.current) {
        console.log('Already fetching, skipping');
        return;
      }
      
      console.log('Starting fetchAll');
      isFetching.current = true;
      setIsLoading(true);

      try {
        const [creatorsResponse, locationsResponse, advertisersResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/finance/revenue/top/creators`, { signal }),
          fetch(`${API_BASE_URL}/finance/revenue/top/locations`, { signal }),
          fetch(`${API_BASE_URL}/finance/revenue/top/advertisers`, { signal })
        ]);

        const [creatorsData, locationsData, advertisersData] = await Promise.all([
          creatorsResponse.json(),
          locationsResponse.json(),
          advertisersResponse.json()
        ]);

        if (!signal.aborted) {
          // Dispatch all data at once
          dispatch(setTopCreators(creatorsData));
          dispatch(setTopLocations(locationsData));
          dispatch(setTopAdvertisers(advertisersData));
        }
      } catch (err) {
        // Don't show error if the request was aborted
        if (err instanceof Error && err.name === 'AbortError') {
          console.log('Request was aborted');
          return;
        }
        console.error('Error fetching data:', err);
        if (!signal.aborted) {
          dispatch(setError(err instanceof Error ? err.message : 'Error fetching data'));
        }
      } finally {
        if (!signal.aborted) {
          console.log('FetchAll completed');
          isFetching.current = false;
          setIsLoading(false);
        }
      }
    };

    fetchAllData();

    return () => {
      console.log('Cleaning up effect');
      if (isFetching.current) {
        controller.abort();
        isFetching.current = false;
      }
    };
  }, [timeRange, dispatch]);

  console.log('Current state:', { topCreators, topLocations, topAdvertisers });

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
