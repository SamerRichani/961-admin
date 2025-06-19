"use client"

import { useNavigation } from '@/hooks/useNavigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Eye, Heart, Send, Clock, Play, Shield } from 'lucide-react';
import { formatMoney, formatNumber } from '@/lib/format';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setDemonetized, setShadowbanned } from '@/app/features/analytics/redux/analyticsSlice';

const COLORS = ['#FF0000', '#FF3333', '#FF6666', '#FF9999', '#FFCCCC'];

// Mock data for the content details
const mockContentData = {
  id: '1',
  title: 'Best Lebanese Street Food Tour',
  thumbnail: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=800&h=400&fit=crop',
  url: 'https://example.com/post/1',
  creator: {
    id: 'creator-1',
    name: 'Sarah Johnson',
  },
  publishedAt: '2024-03-15T10:00:00Z',
  metrics: {
    views: 250000,
    engagement: 45000,
    shares: 12000,
    watchTime: 450000, // in seconds
    avgWatchTime: 180, // in seconds
    completionRate: 85, // percentage
    revenue: {
      total: 4300,
      breakdown: {
        ads: 2500,
        boost: 800,
        commerce: 600,
        deals: 400
      }
    },
    creatorEarnings: 2150,
  },
  hourlyData: Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    views: Math.floor(Math.random() * 5000 + 2000),
    engagement: Math.floor(Math.random() * 1000 + 500),
  })),
  demographics: {
    age: [
      { group: '18-24', value: 35 },
      { group: '25-34', value: 40 },
      { group: '35-44', value: 15 },
      { group: '45-54', value: 7 },
      { group: '55+', value: 3 },
    ],
    location: [
      { name: 'Lebanon', value: 45 },
      { name: 'UAE', value: 25 },
      { name: 'KSA', value: 15 },
      { name: 'Qatar', value: 10 },
      { name: 'Other', value: 5 },
    ],
    gender: [
      { name: 'Male', value: 55 },
      { name: 'Female', value: 45 },
    ],
  },
  referrers: [
    { source: 'Direct', sessions: 85000 },
    { source: 'Search', sessions: 65000 },
    { source: 'Social', sessions: 45000 },
    { source: 'Email', sessions: 25000 },
    { source: 'Other', sessions: 15000 },
  ],
};

export function ContentDetails({ id }: { id: string }) {
  const navigate = useNavigation();
  const content = mockContentData; // In a real app, fetch based on id
  const dispatch = useAppDispatch();
  const { isDemonetized, isShadowbanned } = useAppSelector((state) => state.analytics);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-[2000px] mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate.navigate('/analytics')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Analytics
        </Button>

        {/* Header */}
        <Card className="p-6 mb-8">
          <div className="flex items-start gap-6">
            <div className="relative w-64 h-36 bg-gray-200 rounded-lg overflow-hidden">
              <img src={content.thumbnail} alt={content.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Play className="h-12 w-12 text-white opacity-75" />
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-2">
                <a 
                  href={content.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-[#FF0000]"
                >
                  {content.title}
                </a>
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <span 
                  className="text-[#FF0000] hover:text-[#CC0000] cursor-pointer"
                  onClick={() => navigate.navigate(`/pulse/creators/${content.creator.id}`)}
                >
                  {content.creator.name}
                </span>
                <span>•</span>
                <span>{new Date(content.publishedAt).toLocaleDateString()}</span>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-gray-400" />
                  <span className="font-medium">{formatNumber(content.metrics.views)} views</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-gray-400" />
                  <span className="font-medium">{formatNumber(content.metrics.engagement)} engagements</span>
                </div>
                <div className="flex items-center gap-2">
                  <Send className="h-4 w-4 text-gray-400" />
                  <span className="font-medium">{formatNumber(content.metrics.shares)} shares</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="font-medium">{Math.round(content.metrics.watchTime / 60)} minutes watched</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Shield className="h-4 w-4 mr-2" />
                    Moderate
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem 
                    onClick={() => dispatch(setDemonetized(!isDemonetized))}
                    className="text-red-600"
                  >
                    {isDemonetized ? 'Remonetize' : 'Demonetize'}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => dispatch(setShadowbanned(!isShadowbanned))}
                    className="text-red-600"
                  >
                    {isShadowbanned ? 'Remove Shadowban' : 'Shadowban'}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </Card>

        {/* Revenue Overview */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-6">Revenue Breakdown</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="text-sm text-gray-500">Total Revenue</div>
                <div className="text-2xl font-bold">{formatMoney(content.metrics.revenue.total)}</div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Ads</span>
                    <span className="font-medium">{formatMoney(content.metrics.revenue.breakdown.ads)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Boost</span>
                    <span className="font-medium">{formatMoney(content.metrics.revenue.breakdown.boost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Commerce</span>
                    <span className="font-medium">{formatMoney(content.metrics.revenue.breakdown.commerce)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Deals</span>
                    <span className="font-medium">{formatMoney(content.metrics.revenue.breakdown.deals)}</span>
                  </div>
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Creator Earnings</div>
                <div className="text-2xl font-bold">{formatMoney(content.metrics.creatorEarnings)}</div>
                <div className="mt-2 text-sm text-gray-500 space-y-1">
                  {((content.metrics.creatorEarnings / content.metrics.revenue.total) * 100).toFixed(1)}% of total revenue
                  <div className="flex justify-between">
                    <span>Revenue per view</span>
                    <span>{formatMoney(content.metrics.revenue.total / content.metrics.views)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Earnings per view</span>
                    <span>{formatMoney(content.metrics.creatorEarnings / content.metrics.views)}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-6">Watch Time Metrics</h2>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <div className="text-sm text-gray-500">Total Watch Time</div>
                <div className="text-2xl font-bold">{Math.round(content.metrics.watchTime / 60)}m</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Avg Watch Time</div>
                <div className="text-2xl font-bold">{Math.round(content.metrics.avgWatchTime)}s</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Completion Rate</div>
                <div className="text-2xl font-bold">{content.metrics.completionRate}%</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Performance Over Time */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-900">
              Content Performance
            </h3>
            <div className="text-sm text-gray-500">
              Total Posts: {formatNumber(284500)}
            </div>
          </div>
          
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { type: 'Videos', count: 550000 },
                  { type: 'Articles', count: 450000 },
                  { type: 'Photos', count: 350000 },
                  { type: 'Quizzes', count: 250000 },
                  { type: 'Polls', count: 200000 },
                  { type: 'Listicles', count: 150000 },
                ]}
                layout="vertical"
                margin={{ top: 0, right: 30, bottom: 0, left: 80 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis
                  type="number"
                  axisLine={true}
                  tickLine={true}
                  fontSize={12}
                  tickFormatter={(value) => formatNumber(value)}
                  domain={[0, 600000]}
                  ticks={[0, 150000, 300000, 450000, 600000]}
                />
                <YAxis
                  dataKey="type"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  width={80}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  formatter={(value: number) => [formatNumber(value), "Count"]}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    padding: '8px'
                  }}
                />
                <Bar
                  dataKey="count"
                  fill="#FF0000"
                  radius={[0, 4, 4, 0]}
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Performance Over Time */}
        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-semibold">
              Performance Over Time
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 sm:mb-6">
            <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
              <div className="text-xs sm:text-sm text-gray-500">
                Total Views
              </div>
              <div className="text-xl sm:text-2xl font-bold">
                {content.hourlyData.reduce((sum, hour) => sum + hour.views, 0).toLocaleString()}
              </div>
            </div>
            <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
              <div className="text-xs sm:text-sm text-gray-500">
                Total Engagement
              </div>
              <div className="text-xl sm:text-2xl font-bold">
                {content.hourlyData.reduce((sum, hour) => sum + hour.engagement, 0).toLocaleString()}
              </div>
            </div>
            <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
              <div className="text-xs sm:text-sm text-gray-500">
                Engagement Rate
              </div>
              <div className="text-xl sm:text-2xl font-bold text-emerald-600">
                {((content.hourlyData.reduce((sum, hour) => sum + hour.engagement, 0) / 
                  content.hourlyData.reduce((sum, hour) => sum + hour.views, 0)) * 100).toFixed(1)}%
              </div>
            </div>
          </div>

          <div className="h-[250px] sm:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={content.hourlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="hour"
                  scale="auto"
                  padding={{ left: 10, right: 10 }}
                  allowDecimals={false}
                  axisLine={true}
                  tickLine={true}
                  fontSize={12}
                />
                <YAxis 
                  yAxisId="left"
                  axisLine={true}
                  tickLine={true}
                  fontSize={12}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  axisLine={true}
                  tickLine={true}
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    padding: '8px'
                  }}
                />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="views"
                  name="Views"
                  stroke="#FF0000"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="engagement"
                  name="Engagement"
                  stroke="#FF6666"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Demographics and Traffic Sources */}
        <div className="grid grid-cols-2 gap-8">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-6">Demographics</h2>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-500">Age Distribution</h3>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-[#FF0000]" />
                    <span className="text-sm text-gray-500">Male {content.demographics.gender[0].value}%</span>
                    <div className="h-3 w-3 rounded-full bg-[#FF6666]" />
                    <span className="text-sm text-gray-500">Female {content.demographics.gender[1].value}%</span>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={content.demographics.age} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis 
                      type="number"
                      allowDecimals={false}
                      scale="auto"
                      padding={{ left: 0, right: 0 }}
                    />
                    <YAxis dataKey="group" type="category" width={60} />
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Bar dataKey="value" fill="#FF0000" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-8">
                <h3 className="text-sm font-medium text-gray-500 mb-4">Location Distribution</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={content.demographics.location}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {content.demographics.location.map((entry, index) => (
                        <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-6">Traffic Sources & Referrers</h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={content.referrers}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="source"
                  scale="band"
                  padding={{ left: 10, right: 10 }}
                  allowDecimals={false}
                />
                <YAxis />
                <Tooltip formatter={(value) => formatNumber(value as number)} />
                <Bar dataKey="sessions" fill="#FF0000" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-5 gap-4">
              {content.referrers.map((referrer) => (
                <div key={referrer.source} className="text-center">
                  <div className="text-sm text-gray-500">{referrer.source}</div>
                  <div className="font-medium">{formatNumber(referrer.sessions)}</div>
                  <div className="text-xs text-gray-500">
                    {((referrer.sessions / content.metrics.views) * 100).toFixed(1)}%
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}