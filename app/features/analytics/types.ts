export type TimeRange = "day" | "week" | "month" | "quarter" | "year" | "all";

export type MetricType = "views" | "revenue";
export type SortField =
  | "views"
  | "shares"
  | "revenue"
  | "engagementRate"
  | "newUsers"
  | "ctr"
  | "avgWatchTime"
  | "completionRate"
  | "publishedAt";
export type PostType = "article" | "video" | "listicle" | "quiz" | "poll";
export type RowsPerPage = 25 | 50 | 100;

export interface FilterState {
  dateRange: string;
  postTypes: PostType[];
  creators: string[];
  minViews: number;
  minRevenue: number;
  minEngagement: number;
}

export interface LiveMetricsData {
  activeUsers: number;
  webSessions: number;
  mobileSessions: number;
  revenueToday: number;
  adRevenue: number;
  coinRevenue: number;
  commerceRevenue: number;
  subscriptionRevenue: number;
  installations: number;
  uninstalls: number;
  topContent: Array<{
    title: string;
    views: number;
    type: "video" | "article" | "stream";
  }>;
  activeByCountry: Array<{
    country: string;
    users: number;
  }>;
}

export interface AnalyticsState {
  timeRange: TimeRange;
  activeTab: string;
  search: string;
  sortField: string;
  sortDirection: "asc" | "desc";
  selectedApp: any | null;
  selectedTab: any | null;
  viewType: "daily" | "weekly" | "monthly" | "quarterly" | "ytd" | "last12";
  dealsPeriod: "day" | "week" | "month" | "quarter" | "year";
  isDemonetized: boolean;
  isShadowbanned: boolean;
  // Content Performance states
  contentSearch: string;
  selectedMetric: MetricType;
  contentSortField: SortField;
  contentSortOrder: "asc" | "desc";
  contentFilters: FilterState;
  rowsPerPage: RowsPerPage;
  selectedCreator: string | null;
  selectedType: PostType | null;
  liveMetrics: LiveMetricsData;
}

export interface RevenueData {
  month: string;
  current: number;
  previous: number;
  users: number;
  revenuePerUser: number;
}

export interface RevenueSource {
  name: string;
  value: number;
  icon: string;
}

export interface City {
  name: string;
  revenue?: number;
  users?: number;
}

export interface Region {
  name: string;
  revenue?: number;
  users?: number;
  cities: City[];
}

export interface Location {
  country: string;
  revenue?: number;
  percentage?: number;
  users?: number;
  regions?: Region[];
}

export interface SubscriptionType {
  type: string;
  members: number;
  revenue: number;
}

export interface PeriodData {
  revenue: number;
  newSubs: number;
  retention: number;
  churn: number;
}

export interface DealsMembershipData {
  periods: {
    day: PeriodData;
    week: PeriodData;
    month: PeriodData;
    quarter: PeriodData;
    year: PeriodData;
  };
  totalMembers: number;
  activeMembers: number;
  subscriptionTypes: SubscriptionType[];
}

export interface RevenueAnalyticsState {
  monthlyTrends: RevenueData[];
  revenueSourceData: RevenueSource[];
  revenueByLocation: Location[];
  dealsMembershipData: DealsMembershipData;
}

export interface LocationData {
  country: string;
  users: number;
  regions?: Region[];
}

export interface DeviceData {
  platform: Array<{
    name: string;
    value: number;
  }>;
  mobile: Array<{
    name: string;
    value: number;
    details: Array<{
      model: string;
      share: number;
    }>;
  }>;
  browser: Array<{
    name: string;
    value: number;
    icon: string;
  }>;
}

export interface UserProfileData {
  gender: Array<{
    name: string;
    value: number;
  }>;
  ageGroups: Array<{
    age: string;
    value: number;
  }>;
  languages: Array<{
    name: string;
    value: number;
  }>;
  interests: Array<{
    name: string;
    value: number;
  }>;
}

export interface UserDemographicsState {
  locationData: LocationData[];
  deviceData: DeviceData;
  cellProviders: Array<{
    name: string;
    users: number;
    percentage: number;
  }>;
  internetProviders: Array<{
    name: string;
    users: number;
    percentage: number;
  }>;
  userProfileData: UserProfileData;
}

// Types for Miniapps section
export interface ServiceMetric {
  label: string;
  value: number;
  unit?: string;
  trend?: string;
}

export interface Service {
  id: string;
  name: string;
  metrics: {
    primaryMetric: ServiceMetric;
    secondaryMetrics: ServiceMetric[];
  };
}

export interface AnalyticsTabProps {
  timePeriod: string;
  getAdjustedValue: (baseValue: number, period: string) => number;
  getAdjustedPercentage: (trend: string, period: string) => string;
}
