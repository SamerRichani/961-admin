"use client";

import React, { useState } from 'react';
import { Filter, Search, ChevronUp, ChevronDown, Eye, Send, DollarSign, ChevronLeft, ChevronRight, Heart, Users, Clock, Calendar, Check, Play, FileText, List, Image, HelpCircle, Copy, BarChart3, Newspaper } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAppSelector } from '@/redux/hooks';

type SortField = 'type' | 'avgViews' | 'avgShares' | 'avgRevenue';
type ContentSortField = 'title' | 'date' | 'views' | 'shares' | 'revenue' | 'engagement' | 'creatorEarning' | 'creator' | 'completion';
type SortDirection = 'asc' | 'desc';

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

const contentTypes = [
  { type: 'Videos', count: 12450, avgViews: 45200, avgShares: 1240, avgRevenue: 890 },
  { type: 'Articles', count: 8920, avgViews: 28500, avgShares: 890, avgRevenue: 450 },
  { type: 'Photos', count: 23450, avgViews: 18900, avgShares: 560, avgRevenue: 230 },
  { type: 'Quizzes', count: 1250, avgViews: 34500, avgShares: 1890, avgRevenue: 670 },
  { type: 'Carousels', count: 890, avgViews: 52300, avgShares: 2100, avgRevenue: 980 },
  { type: 'Polls', count: 2340, avgViews: 29800, avgShares: 1120, avgRevenue: 540 },
  { type: 'Listicles', count: 1680, avgViews: 41200, avgShares: 1560, avgRevenue: 780 },
];

const contentPerformance = [
  { title: 'Lebanon Travel Guide 2024', creator: 'Michael Chen', date: '6/19/2025', views: 838300, shares: 91100, revenue: 151400, engagement: 17.2, creatorEarning: 15300, completion: 7.3, type: 'Article' },
  { title: 'Lebanese Fashion Trends', creator: 'Alex Thompson', date: '6/19/2025', views: 1760000, shares: 98800, revenue: 179900, engagement: 21.6, creatorEarning: 84900, completion: 7.5, type: 'Video' },
  { title: 'Lebanese Fashion Trends', creator: 'Sarah Johnson', date: '6/3/2025', views: 654700, shares: 29800, revenue: 330000, engagement: 12.7, creatorEarning: 7800, completion: 3.8, type: 'Article' },
  { title: 'Top 10 Hidden Gems in Lebanon', creator: 'Michael Chen', date: '5/22/2025', views: 1490000, shares: 65300, revenue: 287200, engagement: 5.4, creatorEarning: 73400, completion: 14.4, type: 'Listicle' },
  { title: 'Lebanese Fashion Trends', creator: 'Emma Davis', date: '6/11/2025', views: 1810000, shares: 205500, revenue: 337100, engagement: 10.7, creatorEarning: 96600, completion: 6.4, type: 'Video' },
  { title: 'Modern Lebanese Architecture', creator: 'Maria Garcia', date: '5/25/2025', views: 434100, shares: 37700, revenue: 208200, engagement: 7.2, creatorEarning: 12600, completion: 9.0, type: 'Article' },
  { title: 'Lebanese Fashion Trends', creator: 'Sarah Johnson', date: '6/11/2025', views: 1960000, shares: 148200, revenue: 690000, engagement: 23.0, creatorEarning: 57000, completion: 13.3, type: 'Video' },
  { title: 'Top 10 Hidden Gems in Lebanon', creator: 'Maria Garcia', date: '5/28/2025', views: 1720000, shares: 63400, revenue: 862100, engagement: 10.9, creatorEarning: 68000, completion: 2.2, type: 'Listicle' },
  { title: 'Lebanese Tech Startups', creator: 'Alex Thompson', date: '6/13/2025', views: 1660000, shares: 187800, revenue: 861800, engagement: 18.8, creatorEarning: 94400, completion: 8.8, type: 'Article' },
  { title: 'Lebanese Music Festivals', creator: 'Alex Thompson', date: '5/22/2025', views: 839200, shares: 62800, revenue: 210500, engagement: 7.9, creatorEarning: 15800, completion: 14.0, type: 'Video' },
  { title: 'Beirut Street Food Guide', creator: 'Emma Davis', date: '6/15/2025', views: 1250000, shares: 89400, revenue: 445600, engagement: 15.3, creatorEarning: 42300, completion: 11.2, type: 'Article' },
  { title: 'Lebanese Wine Culture', creator: 'Michael Chen', date: '6/8/2025', views: 567800, shares: 34200, revenue: 189700, engagement: 9.8, creatorEarning: 18900, completion: 6.7, type: 'Video' },
  { title: 'Traditional Lebanese Crafts', creator: 'Sarah Johnson', date: '5/30/2025', views: 892400, shares: 56700, revenue: 298500, engagement: 12.4, creatorEarning: 28700, completion: 8.9, type: 'Article' },
  { title: 'Lebanese Diaspora Stories', creator: 'Maria Garcia', date: '6/5/2025', views: 1340000, shares: 112300, revenue: 523800, engagement: 16.7, creatorEarning: 67200, completion: 9.5, type: 'Video' },
  { title: 'Baalbek Historical Tour', creator: 'Alex Thompson', date: '5/18/2025', views: 723500, shares: 45600, revenue: 234900, engagement: 8.9, creatorEarning: 21400, completion: 12.8, type: 'Article' },
  { title: 'Lebanese Cooking Masterclass', creator: 'Emma Davis', date: '6/12/2025', views: 1890000, shares: 156700, revenue: 678900, engagement: 22.1, creatorEarning: 89300, completion: 15.6, type: 'Video' },
  { title: 'Cedar Forest Conservation', creator: 'Michael Chen', date: '5/25/2025', views: 445600, shares: 28900, revenue: 167800, engagement: 6.8, creatorEarning: 14200, completion: 7.4, type: 'Article' },
  { title: 'Lebanese Business Opportunities', creator: 'Sarah Johnson', date: '6/9/2025', views: 1120000, shares: 78400, revenue: 389200, engagement: 13.5, creatorEarning: 45600, completion: 10.3, type: 'Video' },
];

export default function ContentPerformance() {
  const { timeRange } = useAppSelector((state) => state.analytics);
  const timePeriod = timeRange === 'day' ? 'today' : timeRange === 'week' ? '7days' : timeRange === 'month' ? '30days' : timeRange;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [showFilter, setShowFilter] = useState(false);
  const [sortField, setSortField] = useState<SortField>('avgViews');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [contentSortField, setContentSortField] = useState<ContentSortField>('views');
  const [contentSortDirection, setContentSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleContentSort = (field: ContentSortField) => {
    if (contentSortField === field) {
      setContentSortDirection(contentSortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setContentSortField(field);
      setContentSortDirection('desc');
    }
    setCurrentPage(1);
  };

  const sortedContentTypes = [...contentTypes].sort((a, b) => {
    let aValue: number | string;
    let bValue: number | string;
    switch (sortField) {
      case 'type':
        aValue = a.type;
        bValue = b.type;
        break;
      case 'avgViews':
        aValue = getAdjustedValue(a.avgViews, timePeriod);
        bValue = getAdjustedValue(b.avgViews, timePeriod);
        break;
      case 'avgShares':
        aValue = getAdjustedValue(a.avgShares, timePeriod);
        bValue = getAdjustedValue(b.avgShares, timePeriod);
        break;
      case 'avgRevenue':
        aValue = getAdjustedValue(a.avgRevenue, timePeriod);
        bValue = getAdjustedValue(b.avgRevenue, timePeriod);
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

  const sortedContent = [...contentPerformance].sort((a, b) => {
    let aValue: number | string;
    let bValue: number | string;
    switch (contentSortField) {
      case 'title':
        aValue = a.title;
        bValue = b.title;
        break;
      case 'creator':
        aValue = a.creator;
        bValue = b.creator;
        break;
      case 'date':
        aValue = new Date(a.date).getTime();
        bValue = new Date(b.date).getTime();
        break;
      case 'views':
        aValue = getAdjustedValue(a.views, timePeriod);
        bValue = getAdjustedValue(b.views, timePeriod);
        break;
      case 'shares':
        aValue = getAdjustedValue(a.shares, timePeriod);
        bValue = getAdjustedValue(b.shares, timePeriod);
        break;
      case 'revenue':
        aValue = getAdjustedValue(a.revenue, timePeriod);
        bValue = getAdjustedValue(b.revenue, timePeriod);
        break;
      case 'engagement':
        aValue = a.engagement;
        bValue = b.engagement;
        break;
      case 'creatorEarning':
        aValue = getAdjustedValue(a.creatorEarning, timePeriod);
        bValue = getAdjustedValue(b.creatorEarning, timePeriod);
        break;
      case 'completion':
        aValue = a.completion;
        bValue = b.completion;
        break;
      default:
        return 0;
    }
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return contentSortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    return contentSortDirection === 'asc' 
      ? (aValue as number) - (bValue as number) 
      : (bValue as number) - (aValue as number);
  });

  const filteredContent = sortedContent.filter(content => {
    const matchesSearch = content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         content.creator.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(content.type);
    return matchesSearch && matchesType;
  });

  // Update pagination with filtered content
  const filteredTotalPages = Math.ceil(filteredContent.length / itemsPerPage);
  const filteredStartIndex = (currentPage - 1) * itemsPerPage;
  const filteredEndIndex = filteredStartIndex + itemsPerPage;
  const currentFilteredContent = filteredContent.slice(filteredStartIndex, filteredEndIndex);

  const toggleTypeFilter = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSelectedTypes([]);
    setSearchTerm('');
    setCurrentPage(1);
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <div className="w-3 h-3" />;
    }
    return sortDirection === 'asc' ? 
      <ChevronUp className="w-3 h-3" /> : 
      <ChevronDown className="w-3 h-3" />;
  };

  const ContentSortIcon = ({ field }: { field: ContentSortField }) => {
    if (contentSortField !== field) {
      return <div className="w-3 h-3" />;
    }
    return contentSortDirection === 'asc' ? 
      <ChevronUp className="w-3 h-3" /> : 
      <ChevronDown className="w-3 h-3" />;
  };

  const getContentTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'videos': 
      case 'video':
        return <Play className="w-4 h-4 text-orange-500" />;
      case 'articles':
      case 'article':
        return <FileText className="w-4 h-4 text-blue-500" />;
      case 'listicles':
      case 'listicle':
        return <List className="w-4 h-4 text-purple-500" />;
      case 'news':
        return <Newspaper className="w-4 h-4 text-red-500" />;
      case 'photos':
        return <Image className="w-4 h-4 text-green-500" />;
      case 'quizzes':
        return <HelpCircle className="w-4 h-4 text-yellow-500" />;
      case 'carousels':
        return <Copy className="w-4 h-4 text-indigo-500" />;
      case 'polls':
        return <BarChart3 className="w-4 h-4 text-pink-500" />;
      default: 
        return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Content Types Performance Table */}
      <Card>
        <CardContent className="p-4">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th 
                    className="text-left py-2 px-3 font-medium text-gray-600 text-sm cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handleSort('type')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Type</span>
                      <SortIcon field="type" />
                    </div>
                  </th>
                  <th 
                    className="text-right py-2 px-3 font-medium text-gray-600 text-sm cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handleSort('avgViews')}
                  >
                    <div className="flex items-center justify-end space-x-1">
                      <Eye className="w-3 h-3" />
                      <SortIcon field="avgViews" />
                    </div>
                  </th>
                  <th 
                    className="text-right py-2 px-3 font-medium text-gray-600 text-sm cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handleSort('avgShares')}
                  >
                    <div className="flex items-center justify-end space-x-1">
                      <Send className="w-3 h-3" />
                      <SortIcon field="avgShares" />
                    </div>
                  </th>
                  <th 
                    className="text-right py-2 px-3 font-medium text-gray-600 text-sm cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handleSort('avgRevenue')}
                  >
                    <div className="flex items-center justify-end space-x-1">
                      <DollarSign className="w-3 h-3" />
                      <SortIcon field="avgRevenue" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedContentTypes.map((content, index) => (
                  <tr 
                    key={content.type} 
                    className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                    }`}
                  >
                    <td className="py-2 px-3">
                      <div className="flex items-center space-x-2">
                        <div className="flex-shrink-0">
                          {getContentTypeIcon(content.type)}
                        </div>
                        <span className="text-sm font-medium text-gray-900">{content.type}</span>
                      </div>
                    </td>
                    <td className="py-2 px-3 text-right">
                      <span className="text-sm text-gray-900">
                        {getAdjustedValue(content.avgViews, timePeriod).toLocaleString()}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-right">
                      <span className="text-sm text-gray-900">
                        {getAdjustedValue(content.avgShares, timePeriod).toLocaleString()}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-right">
                      <span className="text-sm text-gray-900">
                        ${getAdjustedValue(content.avgRevenue, timePeriod).toLocaleString()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      {/* Content Performance Table */}
      <Card>
        <CardContent className="p-6">
          {/* Search and Filters */}
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by title, creator, URL or keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="relative">
              <Button 
                variant="outline" 
                className="flex items-center space-x-2"
                onClick={() => setShowFilter(!showFilter)}
              >
                <Filter className="w-4 h-4" />
                <span>Filter</span>
                {selectedTypes.length > 0 && (
                  <span className="ml-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {selectedTypes.length}
                  </span>
                )}
              </Button>
              {/* Filter Dropdown */}
              {showFilter && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-gray-900">Filter by Type</h3>
                      {selectedTypes.length > 0 && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={clearFilters}
                          className="text-xs"
                        >
                          Clear all
                        </Button>
                      )}
                    </div>
                    <div className="space-y-2">
                      {['Video', 'Article', 'Listicle'].map((type) => (
                        <label key={type} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedTypes.includes(type)}
                            onChange={() => toggleTypeFilter(type)}
                            className="rounded border-gray-300 text-red-500 focus:ring-red-500"
                          />
                          <div className="flex items-center space-x-2">
                            {getContentTypeIcon(type)}
                            <span className="text-sm text-gray-700">{type}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* Active Filters */}
          {(selectedTypes.length > 0 || searchTerm) && (
            <div className="flex items-center space-x-2 mb-4 p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Active filters:</span>
              {searchTerm && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                  Search: "{searchTerm}"
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              )}
              {selectedTypes.map(type => (
                <span key={type} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                  {type}
                  <button 
                    onClick={() => toggleTypeFilter(type)}
                    className="ml-1 text-red-600 hover:text-red-800"
                  >
                    ×
                  </button>
                </span>
              ))}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearFilters}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Clear all
              </Button>
            </div>
          )}
          {filteredContent.length === 0 && (searchTerm || selectedTypes.length > 0) && (
            <div className="text-center py-8">
              <p className="text-gray-500">No content found matching your filters.</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearFilters}
                className="mt-2"
              >
                Clear filters
              </Button>
            </div>
          )}
          {filteredContent.length > 0 && (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th 
                        className="text-left py-3 px-4 font-medium text-gray-600 text-sm cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => handleContentSort('title')}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Content</span>
                          <ContentSortIcon field="title" />
                        </div>
                      </th>
                      <th 
                        className="text-center py-3 px-4 font-medium text-gray-600 text-sm cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => handleContentSort('date')}
                      >
                        <div className="flex items-center justify-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <ContentSortIcon field="date" />
                        </div>
                      </th>
                      <th 
                        className="text-center py-3 px-4 font-medium text-gray-600 text-sm cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => handleContentSort('views')}
                      >
                        <div className="flex items-center justify-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <ContentSortIcon field="views" />
                        </div>
                      </th>
                      <th 
                        className="text-center py-3 px-4 font-medium text-gray-600 text-sm cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => handleContentSort('shares')}
                      >
                        <div className="flex items-center justify-center space-x-1">
                          <Send className="w-4 h-4" />
                          <ContentSortIcon field="shares" />
                        </div>
                      </th>
                      <th 
                        className="text-center py-3 px-4 font-medium text-gray-600 text-sm cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => handleContentSort('revenue')}
                      >
                        <div className="flex items-center justify-center space-x-1">
                          <DollarSign className="w-4 h-4" />
                          <ContentSortIcon field="revenue" />
                        </div>
                      </th>
                      <th 
                        className="text-center py-3 px-4 font-medium text-gray-600 text-sm cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => handleContentSort('creatorEarning')}
                      >
                        <div className="flex items-center justify-center space-x-1">
                          <span>C$</span>
                          <ContentSortIcon field="creatorEarning" />
                        </div>
                      </th>
                      <th 
                        className="text-center py-3 px-4 font-medium text-gray-600 text-sm cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => handleContentSort('engagement')}
                      >
                        <div className="flex items-center justify-center space-x-1">
                          <Heart className="w-4 h-4" />
                          <ContentSortIcon field="engagement" />
                        </div>
                      </th>
                      <th 
                        className="text-center py-3 px-4 font-medium text-gray-600 text-sm cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => handleContentSort('creator')}
                      >
                        <div className="flex items-center justify-center space-x-1">
                          <Users className="w-4 h-4" />
                          <ContentSortIcon field="creator" />
                        </div>
                      </th>
                      <th 
                        className="text-center py-3 px-4 font-medium text-gray-600 text-sm cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => handleContentSort('completion')}
                      >
                        <div className="flex items-center justify-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <ContentSortIcon field="completion" />
                        </div>
                      </th>
                      <th className="text-center py-3 px-4 font-medium text-gray-600 text-sm">
                        <Check className="w-4 h-4 mx-auto" />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentFilteredContent.map((content, index) => (
                      <tr 
                        key={`${content.title}-${content.creator}-${index}`}
                        className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                        }`}
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <div className="flex-shrink-0">
                              {getContentTypeIcon(content.type)}
                            </div>
                            <div>
                              <div 
                                className="font-medium text-gray-900 text-sm cursor-pointer hover:text-blue-600 transition-colors"
                                onClick={() => {
                                  // Handle post click - navigate to post
                                  console.log('Navigate to post:', content.title);
                                }}
                              >
                                {content.title}
                              </div>
                              <div 
                                className="text-xs text-gray-500 cursor-pointer hover:text-blue-600 transition-colors"
                                onClick={() => {
                                  // Handle creator click - navigate to creator profile
                                  console.log('Navigate to creator:', content.creator);
                                }}
                              >
                                {content.creator}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center text-sm text-gray-900">
                          {content.date}
                        </td>
                        <td className="py-3 px-4 text-center text-sm text-gray-900">
                          {(getAdjustedValue(content.views, timePeriod) / 1000).toFixed(1)}k
                        </td>
                        <td className="py-3 px-4 text-center text-sm text-gray-900">
                          {(getAdjustedValue(content.shares, timePeriod) / 1000).toFixed(1)}k
                        </td>
                        <td className="py-3 px-4 text-center text-sm text-gray-900">
                          ${(getAdjustedValue(content.revenue, timePeriod) / 1000).toFixed(1)}k
                        </td>
                        <td className="py-3 px-4 text-center text-sm text-gray-900">
                          ${(getAdjustedValue(content.creatorEarning, timePeriod) / 1000).toFixed(1)}k
                        </td>
                        <td className="py-3 px-4 text-center text-sm text-gray-900">
                          {content.engagement}%
                        </td>
                        <td className="py-3 px-4 text-center text-sm text-gray-900">
                          {content.creator}
                        </td>
                        <td className="py-3 px-4 text-center text-sm text-gray-900">
                          {content.completion}%
                        </td>
                        <td className="py-3 px-4 text-center text-sm text-gray-900">
                          66.{Math.floor(Math.random() * 10)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Pagination */}
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-500">
                  Showing {filteredStartIndex + 1} to {Math.min(filteredEndIndex, filteredContent.length)} of {filteredContent.length} results
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="flex items-center space-x-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </Button>
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(5, filteredTotalPages) }, (_, i) => {
                      let pageNum;
                      if (filteredTotalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= filteredTotalPages - 2) {
                        pageNum = filteredTotalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                          className="w-8 h-8 p-0"
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, filteredTotalPages))}
                    disabled={currentPage === filteredTotalPages}
                    className="flex items-center space-x-1"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
