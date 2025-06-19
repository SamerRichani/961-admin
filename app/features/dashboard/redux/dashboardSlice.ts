import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DashboardState, TimePeriod, Metric, ContentData, CreatorData, RegionData } from '../types';

const mockMetrics: Metric[] = [
  {
    title: 'Active Now',
    value: '1.8K',
    change: '+24.3%',
    positive: true,
  },
  {
    title: 'Pending Reports',
    value: '23',
    change: '+5.2%',
    positive: false,
  },
  {
    title: 'Daily Active Users',
    value: '24.5K',
    change: '+12.5%',
    positive: true,
  },
  {
    title: 'Weekly Active Users',
    value: '145.2K',
    change: '+8.2%',
    positive: true,
  },
  {
    title: 'Monthly Active Users',
    value: '573.8K',
    change: '+15.3%',
    positive: true,
  },
  {
    title: 'Avg. Time Spent',
    value: '32m 45s',
    change: '+5.7%',
    positive: true,
  }
];

const initialState: DashboardState = {
  timePeriod: 'today',
  activeUsers: {
    rightNow: 1800,
    lastTenMinutes: 2100,
  },
  chartData: [
    { hour: '00:00', users: 1200, posts: 85 },
    { hour: '03:00', users: 800, posts: 45 },
    { hour: '06:00', users: 1500, posts: 95 },
    { hour: '09:00', users: 2800, posts: 180 },
    { hour: '12:00', users: 3500, posts: 250 },
    { hour: '15:00', users: 4200, posts: 320 },
    { hour: '18:00', users: 3800, posts: 280 },
    { hour: '21:00', users: 2500, posts: 150 },
  ],
  engagementData: [
    { type: 'Comments', count: 45000 },
    { type: 'Likes', count: 125000 },
    { type: 'Shares', count: 28000 },
    { type: 'Saves', count: 15000 },
  ],
  periodMetrics: {
    today: {
      revenue: 12400,
      installs: 89300,
      newPosts: 1200,
      newUsers: 2500,
    },
    yesterday: {
      revenue: 11800,
      installs: 85000,
      newPosts: 1150,
      newUsers: 2300,
    },
    '7day': {
      revenue: 89600,
      installs: 452000,
      newPosts: 8500,
      newUsers: 18500,
    },
    '30day': {
      revenue: 384000,
      installs: 1850000,
      newPosts: 35000,
      newUsers: 75000,
    },
    '90day': {
      revenue: 4250000,
      installs: 22500000,
      newPosts: 420000,
      newUsers: 850000,
    }
  },
  topContent: [
    { views: 45000, growth: 15.5, title: "Content Title 1" },
    { views: 38000, growth: 12.3, title: "Content Title 2" },
    { views: 32000, growth: 8.7, title: "Content Title 3" },
  ],
  topCreators: [
    { earned: 3500, growth: 18.2, name: "Creator Name 1" },
    { earned: 2800, growth: 14.5, name: "Creator Name 2" },
    { earned: 2200, growth: 10.8, name: "Creator Name 3" },
  ],
  regions: [
    { name: "Beirut", users: 25000, growth: 7.5 },
    { name: "Mount Lebanon", users: 18000, growth: 6.8 },
    { name: "North Lebanon", users: 12000, growth: 5.2 },
  ]
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setTimePeriod: (state, action: PayloadAction<TimePeriod>) => {
      state.timePeriod = action.payload;
    },
    updateActiveUsers: (state, action: PayloadAction<{ rightNow: number; lastTenMinutes: number }>) => {
      state.activeUsers = action.payload;
    },
    setTopContent: (state, action: PayloadAction<ContentData[]>) => {
      state.topContent = action.payload;
    },
    setTopCreators: (state, action: PayloadAction<CreatorData[]>) => {
      state.topCreators = action.payload;
    },
    updateRegions: (state, action: PayloadAction<RegionData[]>) => {
      state.regions = action.payload;
    },
  },
});

export const { 
  setTimePeriod, 
  updateActiveUsers, 
  setTopContent, 
  setTopCreators,
  updateRegions 
} = dashboardSlice.actions;
export { mockMetrics };
export default dashboardSlice.reducer; 