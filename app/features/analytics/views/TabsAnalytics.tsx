"use client";

import React, { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useAppSelector } from "@/redux/hooks";

// Helper for value adjustment
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

// Helper for time spent adjustment
function getTimeSpent(baseTime: string, period: string) {
  const timeMap = {
    '12m 34s': { today: '12m 34s', '7days': '13m 45s', default: '15m 12s' },
    '18m 45s': { today: '18m 45s', '7days': '19m 32s', default: '21m 18s' },
    '25m 12s': { today: '25m 12s', '7days': '26m 45s', default: '28m 32s' },
    '8m 23s': { today: '8m 23s', '7days': '9m 15s', default: '10m 45s' },
    '14m 56s': { today: '14m 56s', '7days': '15m 32s', default: '16m 45s' },
    '3m 45s': { today: '3m 45s', '7days': '4m 12s', default: '4m 56s' },
  };
  const timeData = timeMap[baseTime as keyof typeof timeMap];
  if (!timeData) return baseTime;
  return timeData[period as keyof typeof timeData] || timeData.default;
}

function getTimeInSeconds(timeString: string) {
  const [minutes, seconds] = timeString.replace('m ', '').replace('s', '').split(' ');
  return parseInt(minutes) * 60 + parseInt(seconds);
}

const sections = [
  { name: 'News', users: 245800, revenue: 34500, timeSpent: '12m 34s' },
  { name: '961+', users: 156200, revenue: 45800, timeSpent: '18m 45s' },
  { name: 'Pulse', users: 189400, revenue: 28900, timeSpent: '25m 12s' },
  { name: 'Blood', users: 89200, revenue: 12400, timeSpent: '8m 23s' },
  { name: 'Jobs', users: 67800, revenue: 15600, timeSpent: '14m 56s' },
  { name: 'Weather', users: 234500, revenue: 8900, timeSpent: '3m 45s' },
];

type SortField = 'name' | 'users' | 'revenue' | 'timeSpent';
type SortDirection = 'asc' | 'desc';

export function TabsAnalytics() {
  const { timeRange } = useAppSelector((state) => state.analytics);
  const timePeriod = timeRange === "day" ? "today" : timeRange === "week" ? "7days" : timeRange === "month" ? "30days" : timeRange;
  const [sortField, setSortField] = useState<SortField>('users');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedSections = [...sections].sort((a, b) => {
    let aValue: number;
    let bValue: number;
    switch (sortField) {
      case 'name':
        return sortDirection === 'asc' 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      case 'users':
        aValue = getAdjustedValue(a.users, timePeriod);
        bValue = getAdjustedValue(b.users, timePeriod);
        break;
      case 'revenue':
        aValue = getAdjustedValue(a.revenue, timePeriod);
        bValue = getAdjustedValue(b.revenue, timePeriod);
        break;
      case 'timeSpent':
        aValue = getTimeInSeconds(getTimeSpent(a.timeSpent, timePeriod));
        bValue = getTimeInSeconds(getTimeSpent(b.timeSpent, timePeriod));
        break;
      default:
        return 0;
    }
    return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
  });

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <div className="w-4 h-4" />;
    }
    return sortDirection === 'asc' ? 
      <ChevronUp className="w-4 h-4" /> : 
      <ChevronDown className="w-4 h-4" />;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th 
                    className="text-left py-3 px-4 font-semibold text-gray-700 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center space-x-2">
                      <span>Section</span>
                      <SortIcon field="name" />
                    </div>
                  </th>
                  <th 
                    className="text-right py-3 px-4 font-semibold text-gray-700 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handleSort('users')}
                  >
                    <div className="flex items-center justify-end space-x-2">
                      <span>Users</span>
                      <SortIcon field="users" />
                    </div>
                  </th>
                  <th 
                    className="text-right py-3 px-4 font-semibold text-gray-700 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handleSort('revenue')}
                  >
                    <div className="flex items-center justify-end space-x-2">
                      <span>Revenue</span>
                      <SortIcon field="revenue" />
                    </div>
                  </th>
                  <th 
                    className="text-right py-3 px-4 font-semibold text-gray-700 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handleSort('timeSpent')}
                  >
                    <div className="flex items-center justify-end space-x-2">
                      <span>Time Spent</span>
                      <SortIcon field="timeSpent" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedSections.map((section, index) => (
                  <tr 
                    key={section.name} 
                    className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                    }`}
                  >
                    <td className="py-4 px-4">
                      <span className="font-medium text-gray-900">{section.name}</span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="font-normal text-gray-900">
                        {getAdjustedValue(section.users, timePeriod).toLocaleString()}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="font-normal text-gray-900">
                        ${getAdjustedValue(section.revenue, timePeriod).toLocaleString()}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="font-normal text-gray-900">
                        {getTimeSpent(section.timeSpent, timePeriod)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
