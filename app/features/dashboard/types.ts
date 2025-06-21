export type TimePeriod = 'today' | 'yesterday' | '7day' | '30day' | '90day';

export interface PeriodMetrics {
  revenue: number;
  installs: number;
  newPosts: number;
  newUsers: number;
}

export interface DashboardState {
  timePeriod: TimePeriod;
  activeUsers: {
    rightNow: number;
    lastTenMinutes: number;
  };
  chartData: Array<{
    hour: string;
    users: number;
    posts: number;
  }>;
  engagementData: Array<{
    type: string;
    count: number;
  }>;
  periodMetrics: {
    [key in TimePeriod]: PeriodMetrics;
  };
  topContent: Array<ContentData>;
  topCreators: Array<CreatorData>;
  regions: Array<RegionData>;
}

export interface Metric {
  title: string;
  value: string;
  change: string;
  positive: boolean;
}

export interface ContentData {
  views: number;
  growth: number;
  title: string;
  creator: string;
}

export interface CreatorData {
  earned: number;
  growth: number;
  name: string;
}

export interface RegionData {
  name: string;
  users: number;
  growth: number;
}