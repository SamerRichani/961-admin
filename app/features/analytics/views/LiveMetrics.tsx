"use client";

import React, { useState } from 'react';
import { Search, ChevronUp, ChevronDown, Eye, Users, DollarSign, TrendingUp, Coins, Zap, ShoppingCart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

// Helpers
function getAdjustedValue(baseValue: number, period: string) {
  switch (period) {
    case 'today':
    case 'day':
      return baseValue;
    case '7days':
    case 'week':
      return Math.round(baseValue * 1.1);
    case '30days':
    case 'month':
      return Math.round(baseValue * 1.2);
    default:
      return Math.round(baseValue * 1.3);
  }
}
function getAdjustedPercentage(basePercentage: string, period: string) {
  let base = parseFloat(basePercentage);
  let adjusted = base;
  switch (period) {
    case 'today':
    case 'day':
      adjusted = base;
      break;
    case '7days':
    case 'week':
      adjusted = base * 1.1;
      break;
    case '30days':
    case 'month':
      adjusted = base * 1.2;
      break;
    default:
      adjusted = base * 1.3;
  }
  return (adjusted > 0 ? '+' : '') + adjusted.toFixed(1) + '%';
}

export function LiveMetrics() {
  // Simulate timePeriod from Redux
  const timePeriod = '7days'; // Replace with Redux if needed
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<'tab' | 'views' | 'users' | 'engagement' | 'revenue'>('views');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const getEngagement = (baseEngagement: number, period: string) => {
    return (baseEngagement * (period === 'today' ? 1 : period === '7days' ? 1.1 : 1.2)).toFixed(1);
  };

  const pulseTabs = [
    { tab: 'Following', views: 2450000, users: 89200, engagement: 12.4, revenue: 15600 },
    { tab: 'For You', views: 5680000, users: 156800, engagement: 18.7, revenue: 28900 },
    { tab: 'Events', views: 890000, users: 34500, engagement: 22.1, revenue: 12400 },
    { tab: 'Food', views: 1230000, users: 67800, engagement: 15.3, revenue: 18700 },
    { tab: 'Sports', views: 1890000, users: 78900, engagement: 16.8, revenue: 22300 },
    { tab: 'Entertainment', views: 3240000, users: 124500, engagement: 19.2, revenue: 31200 },
    { tab: 'News', views: 4560000, users: 189300, engagement: 14.7, revenue: 38900 },
    { tab: 'Technology', views: 1560000, users: 67200, engagement: 21.3, revenue: 19800 },
    { tab: 'Travel', views: 2340000, users: 89700, engagement: 17.9, revenue: 24600 },
    { tab: 'Fashion', views: 1780000, users: 78400, engagement: 20.1, revenue: 21500 }
  ];

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredAndSortedTabs = pulseTabs
    .filter(tab => 
      tab.tab.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let aValue: number | string;
      let bValue: number | string;

      switch (sortField) {
        case 'tab':
          aValue = a.tab;
          bValue = b.tab;
          break;
        case 'views':
          aValue = getAdjustedValue(a.views, timePeriod);
          bValue = getAdjustedValue(b.views, timePeriod);
          break;
        case 'users':
          aValue = getAdjustedValue(a.users, timePeriod);
          bValue = getAdjustedValue(b.users, timePeriod);
          break;
        case 'engagement':
          aValue = parseFloat(getEngagement(a.engagement, timePeriod));
          bValue = parseFloat(getEngagement(b.engagement, timePeriod));
          break;
        case 'revenue':
          aValue = getAdjustedValue(a.revenue, timePeriod);
          bValue = getAdjustedValue(b.revenue, timePeriod);
          break;
        default:
          return 0;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortDirection === 'asc' 
        ? (aValue as number) - (bValue as number) 
        : (bValue as number) - (aValue as number);
    });

  const SortIcon = ({ field }: { field: typeof sortField }) => {
    if (sortField !== field) {
      return <div className="w-4 h-4" />;
    }
    return sortDirection === 'asc' ? 
      <ChevronUp className="w-4 h-4" /> : 
      <ChevronDown className="w-4 h-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Revenue Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Placeholder for CompactMetricCard, implement as needed */}
      </div>
        
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Breakdown Card */}
        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Revenue Breakdown</h3>
              <p className="text-3xl font-bold text-gray-900">
                ${(getAdjustedValue(200000, timePeriod) / 1000).toFixed(1)}K
              </p>
              <p className="text-sm text-green-600 font-medium">
                {getAdjustedPercentage('+18.5%', timePeriod)} from previous period
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Zap className="w-5 h-5 text-orange-600" />
                  <span className="font-medium text-gray-900">Ads</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    ${(getAdjustedValue(67400, timePeriod) / 1000).toFixed(1)}K
                  </p>
                  <p className="text-sm text-green-600">{getAdjustedPercentage('+15.2%', timePeriod)}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Coins className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-gray-900">Coin Purchases</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    ${(getAdjustedValue(98200, timePeriod) / 1000).toFixed(1)}K
                  </p>
                  <p className="text-sm text-green-600">{getAdjustedPercentage('+28.7%', timePeriod)}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <ShoppingCart className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-gray-900">Commerce</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    ${(getAdjustedValue(34400, timePeriod) / 1000).toFixed(1)}K
                  </p>
                  <p className="text-sm text-green-600">{getAdjustedPercentage('+22.1%', timePeriod)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Revenue Distribution Chart */}
        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Revenue Distribution</h3>
            
            <div className="space-y-6">
              {/* Donut Chart Representation */}
              <div className="relative w-48 h-48 mx-auto">
                <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
                  {/* Background circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#f3f4f6"
                    strokeWidth="8"
                  />
                  
                  {/* Coin Purchases - 49.1% */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="8"
                    strokeDasharray="122.5 128.5"
                    strokeDashoffset="0"
                    className="transition-all duration-500"
                  />
                  
                  {/* Ads - 33.7% */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#f97316"
                    strokeWidth="8"
                    strokeDasharray="84.4 166.6"
                    strokeDashoffset="-122.5"
                    className="transition-all duration-500"
                  />
                  
                  {/* Commerce - 17.2% */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="8"
                    strokeDasharray="43.1 207.9"
                    strokeDashoffset="-206.9"
                    className="transition-all duration-500"
                  />
                </svg>
                
                {/* Center text */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">
                      ${(getAdjustedValue(200000, timePeriod) / 1000).toFixed(0)}K
                    </p>
                    <p className="text-sm text-gray-500">Total</p>
                  </div>
                </div>
              </div>
              
              {/* Legend */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">Coin Purchases</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">49.1%</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">Ads</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">33.7%</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">Commerce</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">17.2%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pulse Tabs Table */}
      <Card>
        <CardContent className="p-6">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search pulse tabs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th 
                    className="text-left py-3 px-4 font-semibold text-gray-700 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handleSort('tab')}
                  >
                    <div className="flex items-center space-x-2">
                      <span>Tab</span>
                      <SortIcon field="tab" />
                    </div>
                  </th>
                  <th 
                    className="text-right py-3 px-4 font-semibold text-gray-700 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handleSort('views')}
                  >
                    <div className="flex items-center justify-end space-x-2">
                      <Eye className="w-4 h-4" />
                      <span>Views</span>
                      <SortIcon field="views" />
                    </div>
                  </th>
                  <th 
                    className="text-right py-3 px-4 font-semibold text-gray-700 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handleSort('users')}
                  >
                    <div className="flex items-center justify-end space-x-2">
                      <Users className="w-4 h-4" />
                      <span>Users</span>
                      <SortIcon field="users" />
                    </div>
                  </th>
                  <th 
                    className="text-right py-3 px-4 font-semibold text-gray-700 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handleSort('engagement')}
                  >
                    <div className="flex items-center justify-end space-x-2">
                      <TrendingUp className="w-4 h-4" />
                      <span>Engagement</span>
                      <SortIcon field="engagement" />
                    </div>
                  </th>
                  <th 
                    className="text-right py-3 px-4 font-semibold text-gray-700 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handleSort('revenue')}
                  >
                    <div className="flex items-center justify-end space-x-2">
                      <DollarSign className="w-4 h-4" />
                      <span>Revenue</span>
                      <SortIcon field="revenue" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedTabs.map((tab, index) => (
                  <tr 
                    key={tab.tab} 
                    className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                    }`}
                  >
                    <td className="py-4 px-4">
                      <span className="font-medium text-gray-900">{tab.tab}</span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="font-normal text-gray-900">
                        {(getAdjustedValue(tab.views, timePeriod) / 1000000).toFixed(1)}M
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="font-normal text-gray-900">
                        {(getAdjustedValue(tab.users, timePeriod) / 1000).toFixed(1)}K
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="font-normal text-gray-900">
                        {getEngagement(tab.engagement, timePeriod)}%
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="font-normal text-gray-900">
                        ${(getAdjustedValue(tab.revenue, timePeriod) / 1000).toFixed(1)}K
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* No results message */}
          {filteredAndSortedTabs.length === 0 && searchTerm && (
            <div className="text-center py-8">
              <p className="text-gray-500">No pulse tabs found matching "{searchTerm}".</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
