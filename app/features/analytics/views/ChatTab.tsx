"use client";

import React, { useState } from 'react';
import { Search, ChevronUp, ChevronDown, MessageSquare, DollarSign, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface ChatTabProps {
  timePeriod: string;
  getAdjustedValue: (baseValue: number, period: string) => number;
  getAdjustedPercentage: (basePercentage: string, period: string) => string;
}

type SortField = 'category' | 'queries' | 'avgResponseTime';
type SortDirection = 'asc' | 'desc';

const ChatTab: React.FC<ChatTabProps> = ({ 
  timePeriod, 
  getAdjustedValue,
  getAdjustedPercentage
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('queries');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const getResponseTime = (baseTime: number, period: string) => {
    return (baseTime * (period === 'today' ? 1 : period === '7days' ? 0.95 : 0.9)).toFixed(1);
  };

  const queryCategories = [
    { category: 'Looking for restaurants', queries: 89400, avgResponseTime: 1.2 },
    { category: 'Looking for deals', queries: 76200, avgResponseTime: 0.8 },
    { category: 'Weather', queries: 65800, avgResponseTime: 0.5 },
    { category: 'Booking a ride', queries: 54300, avgResponseTime: 1.1 },
    { category: 'News updates', queries: 42100, avgResponseTime: 1.8 },
    { category: 'Finding services', queries: 38700, avgResponseTime: 2.1 },
    { category: 'Product recommendations', queries: 34500, avgResponseTime: 1.6 },
    { category: 'Travel planning', queries: 29800, avgResponseTime: 1.4 },
    { category: 'Recipe suggestions', queries: 26400, avgResponseTime: 1.0 },
    { category: 'Learning & education', queries: 22100, avgResponseTime: 2.3 },
    { category: 'Shopping assistance', queries: 19600, avgResponseTime: 1.3 },
    { category: 'Local information', queries: 16800, avgResponseTime: 1.7 }
  ];

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredAndSortedCategories = queryCategories
    .filter(category => 
      category.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let aValue: number | string;
      let bValue: number | string;

      switch (sortField) {
        case 'category':
          aValue = a.category;
          bValue = b.category;
          break;
        case 'queries':
          aValue = getAdjustedValue(a.queries, timePeriod);
          bValue = getAdjustedValue(b.queries, timePeriod);
          break;
        case 'avgResponseTime':
          aValue = parseFloat(getResponseTime(a.avgResponseTime, timePeriod));
          bValue = parseFloat(getResponseTime(b.avgResponseTime, timePeriod));
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
      {/* AI Chat Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Replace with CompactMetricCard when implemented */}
        <div className="bg-white rounded-lg shadow p-4 flex flex-col items-start">
          <div className="flex items-center mb-2"><MessageSquare className="w-5 h-5 mr-2" /><span className="font-semibold">Messages</span></div>
          <div className="text-2xl font-bold">{`${(getAdjustedValue(516200, timePeriod) / 1000).toFixed(1)}K`}</div>
          <div className="text-sm text-green-600">{getAdjustedPercentage('+32.4%', timePeriod)} <span className="text-gray-500">from previous period</span></div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 flex flex-col items-start">
          <div className="flex items-center mb-2"><DollarSign className="w-5 h-5 mr-2" /><span className="font-semibold">Revenue</span></div>
          <div className="text-2xl font-bold">{`$${(getAdjustedValue(112400, timePeriod) / 1000).toFixed(1)}K`}</div>
          <div className="text-sm text-green-600">{getAdjustedPercentage('+28.7%', timePeriod)} <span className="text-gray-500">from previous period</span></div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 flex flex-col items-start">
          <div className="flex items-center mb-2"><Clock className="w-5 h-5 mr-2" /><span className="font-semibold">Avg Response Time</span></div>
          <div className="text-2xl font-bold">{`${getResponseTime(1.3, timePeriod)}s`}</div>
          <div className="text-sm text-green-600">{getAdjustedPercentage('-12.4%', timePeriod)} <span className="text-gray-500">from previous period</span></div>
        </div>
      </div>

      {/* Query Categories Table */}
      <Card>
        <CardContent className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Query Categories</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search query categories..."
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
                    onClick={() => handleSort('category')}
                  >
                    <div className="flex items-center space-x-2">
                      <span>Category</span>
                      <SortIcon field="category" />
                    </div>
                  </th>
                  <th 
                    className="text-right py-3 px-4 font-semibold text-gray-700 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handleSort('queries')}
                  >
                    <div className="flex items-center justify-end space-x-2">
                      <MessageSquare className="w-4 h-4" />
                      <SortIcon field="queries" />
                    </div>
                  </th>
                  <th 
                    className="text-right py-3 px-4 font-semibold text-gray-700 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handleSort('avgResponseTime')}
                  >
                    <div className="flex items-center justify-end space-x-2">
                      <Clock className="w-4 h-4" />
                      <SortIcon field="avgResponseTime" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedCategories.map((category, index) => (
                  <tr 
                    key={category.category} 
                    className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                    }`}
                  >
                    <td className="py-4 px-4">
                      <span className="font-medium text-gray-900">{category.category}</span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="font-normal text-gray-900">
                        {(getAdjustedValue(category.queries, timePeriod) / 1000).toFixed(1)}K
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="font-normal text-gray-900">
                        {getResponseTime(category.avgResponseTime, timePeriod)}s
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* No results message */}
          {filteredAndSortedCategories.length === 0 && searchTerm && (
            <div className="text-center py-8">
              <p className="text-gray-500">No query categories found matching "{searchTerm}".</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatTab; 