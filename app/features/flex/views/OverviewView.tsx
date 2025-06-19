"use client"

import { Card } from '@/components/ui/card';
import { Users, Clock, DollarSign, ArrowUpRight, Package, TrendingUp, AlertTriangle, MapPin } from 'lucide-react';
import { formatMoney, formatNumber } from '@/lib/format';
import { FlexTabs } from '@/app/features/flex/components/FlexTabs';

export function OverviewView() {
  // Mock data for overview metrics
  const metrics = {
    activeFlexers: {
      today: 250,
      week: 850,
      month: 2500,
      total: 5000,
      change: 12.5
    },
    completedBlocks: {
      today: 450,
      week: 2800,
      month: 12000,
      change: 8.2
    },
    completedTasks: {
      deliveries: 8500,
      cashPickups: 3200,
      returns: 450,
      failed: 320,
      change: 15.3
    },
    cashCollected: {
      today: 25000,
      week: 150000,
      month: 650000,
      change: 10.5
    },
    flexerEarnings: {
      today: 12500,
      week: 75000,
      month: 325000,
      change: 18.2
    }
  };

  return (
    <div>
      <FlexTabs>
        <div className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-8">
            {/* Active Flexers Card */}
            <Card className="p-4 sm:p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Active Flexers</p>
                  <p className="text-2xl font-bold">{formatNumber(metrics.activeFlexers.today)}</p>
                  <p className="text-sm text-emerald-600 flex items-center gap-1">
                    <ArrowUpRight className="h-4 w-4" />
                    +{metrics.activeFlexers.change}% from yesterday
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t">
                <div>
                  <p className="text-xs text-gray-500">Today</p>
                  <p className="font-medium">{formatNumber(metrics.activeFlexers.today)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">This Week</p>
                  <p className="font-medium">{formatNumber(metrics.activeFlexers.week)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">This Month</p>
                  <p className="font-medium">{formatNumber(metrics.activeFlexers.month)}</p>
                </div>
              </div>
            </Card>

            {/* Completed Blocks Card */}
            <Card className="p-4 sm:p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Completed Blocks</p>
                  <p className="text-2xl font-bold">{formatNumber(metrics.completedBlocks.today)}</p>
                  <p className="text-sm text-emerald-600 flex items-center gap-1">
                    <ArrowUpRight className="h-4 w-4" />
                    +{metrics.completedBlocks.change}% from yesterday
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t">
                <div>
                  <p className="text-xs text-gray-500">Today</p>
                  <p className="font-medium">{formatNumber(metrics.completedBlocks.today)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">This Week</p>
                  <p className="font-medium">{formatNumber(metrics.completedBlocks.week)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">This Month</p>
                  <p className="font-medium">{formatNumber(metrics.completedBlocks.month)}</p>
                </div>
              </div>
            </Card>

            {/* Cash Collected Card */}
            <Card className="p-4 sm:p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Cash Collected</p>
                  <p className="text-2xl font-bold">{formatMoney(metrics.cashCollected.today)}</p>
                  <p className="text-sm text-emerald-600 flex items-center gap-1">
                    <ArrowUpRight className="h-4 w-4" />
                    +{metrics.cashCollected.change}% from yesterday
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t">
                <div>
                  <p className="text-xs text-gray-500">Today</p>
                  <p className="font-medium">{formatMoney(metrics.cashCollected.today)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">This Week</p>
                  <p className="font-medium">{formatMoney(metrics.cashCollected.week)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">This Month</p>
                  <p className="font-medium">{formatMoney(metrics.cashCollected.month)}</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-8">
            {/* Task Completion Stats */}
            <Card className="p-4 sm:p-6">
              <h3 className="text-lg font-semibold mb-4 sm:mb-6">Task Completion</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Package className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Deliveries</p>
                      <p className="text-sm text-gray-500">Total completed today</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold">{formatNumber(metrics.completedTasks.deliveries)}</p>
                    <p className="text-sm text-emerald-600">98% success rate</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">Cash Pickups</p>
                      <p className="text-sm text-gray-500">Total collected today</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold">{formatNumber(metrics.completedTasks.cashPickups)}</p>
                    <p className="text-sm text-emerald-600">99% accuracy</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="font-medium">Returns</p>
                      <p className="text-sm text-gray-500">Items returned today</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold">{formatNumber(metrics.completedTasks.returns)}</p>
                    <p className="text-sm text-emerald-600">100% processed</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="font-medium">Failed Tasks</p>
                      <p className="text-sm text-gray-500">Unsuccessful attempts</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold">{formatNumber(metrics.completedTasks.failed)}</p>
                    <p className="text-sm text-red-600">Needs review</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Station Performance */}
            <Card className="p-4 sm:p-6">
              <h3 className="text-lg font-semibold mb-4 sm:mb-6">Station Performance</h3>
              <div className="space-y-4">
                {[
                  { name: 'Beirut Central', tasks: 450, flexers: 25, accuracy: 99.5 },
                  { name: 'Tripoli Hub', tasks: 320, flexers: 18, accuracy: 98.8 },
                  { name: 'Sidon Station', tasks: 280, flexers: 15, accuracy: 99.2 },
                  { name: 'Jounieh Point', tasks: 250, flexers: 12, accuracy: 98.9 }
                ].map((station, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-[#FF0000]" />
                      <div>
                        <p className="font-medium">{station.name}</p>
                        <p className="text-sm text-gray-500">{station.flexers} active flexers</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{station.tasks} tasks</p>
                      <p className="text-sm text-emerald-600">{station.accuracy}% accuracy</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Earnings Overview */}
          <Card className="p-4 sm:p-6">
            <h3 className="text-lg font-semibold mb-4 sm:mb-6">Flexer Earnings</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Today's Earnings</p>
                <p className="text-2xl font-bold">{formatMoney(metrics.flexerEarnings.today)}</p>
                <p className="text-sm text-emerald-600 flex items-center gap-1">
                  <ArrowUpRight className="h-4 w-4" />
                  +{metrics.flexerEarnings.change}% from yesterday
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">This Week</p>
                <p className="text-2xl font-bold">{formatMoney(metrics.flexerEarnings.week)}</p>
                <p className="text-sm text-emerald-600">Avg ${(metrics.flexerEarnings.week / 7).toFixed(2)}/day</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">This Month</p>
                <p className="text-2xl font-bold">{formatMoney(metrics.flexerEarnings.month)}</p>
                <p className="text-sm text-emerald-600">Projected ${formatMoney(metrics.flexerEarnings.month * 1.2)}</p>
              </div>
            </div>
          </Card>
        </div>
      </FlexTabs>
    </div>
  );
} 