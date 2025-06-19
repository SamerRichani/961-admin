import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  type TimeRange,
  type FilterState,
  type AnalyticsState,
  type LiveMetricsData,
  type MetricType,
  type SortField,
  type PostType,
  type RowsPerPage,
} from "@/app/features/analytics/types";

const initialFilters: FilterState = {
  dateRange: "all",
  postTypes: [],
  creators: [],
  minViews: 0,
  minRevenue: 0,
  minEngagement: 0,
};

const initialState: AnalyticsState = {
  timeRange: "month",
  activeTab: "live",
  search: "",
  sortField: "views",
  sortDirection: "desc",
  selectedApp: null,
  selectedTab: null,
  viewType: "daily",
  dealsPeriod: "month",
  isDemonetized: false,
  isShadowbanned: false,
  // Content Performance initial states
  contentSearch: "",
  selectedMetric: "views",
  contentSortField: "publishedAt",
  contentSortOrder: "desc",
  contentFilters: initialFilters,
  rowsPerPage: 25,
  selectedCreator: null,
  selectedType: null,
  liveMetrics: {
    activeUsers: 0,
    webSessions: 0,
    mobileSessions: 0,
    revenueToday: 0,
    adRevenue: 0,
    coinRevenue: 0,
    commerceRevenue: 0,
    subscriptionRevenue: 0,
    installations: 0,
    uninstalls: 0,
    topContent: [],
    activeByCountry: [],
  },
};

export const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {
    setTimeRange: (state, action: PayloadAction<TimeRange>) => {
      state.timeRange = action.payload;
    },
    setActiveTab: (state, action: PayloadAction<string>) => {
      state.activeTab = action.payload;
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
    setSortField: (state, action: PayloadAction<string>) => {
      state.sortField = action.payload;
    },
    setSortDirection: (state, action: PayloadAction<"asc" | "desc">) => {
      state.sortDirection = action.payload;
    },
    setSelectedApp: (state, action: PayloadAction<any | null>) => {
      state.selectedApp = action.payload;
    },
    setSelectedTab: (state, action: PayloadAction<any | null>) => {
      state.selectedTab = action.payload;
    },
    setViewType: (
      state,
      action: PayloadAction<
        "daily" | "weekly" | "monthly" | "quarterly" | "ytd" | "last12"
      >
    ) => {
      state.viewType = action.payload;
    },
    setDealsPeriod: (
      state,
      action: PayloadAction<"day" | "week" | "month" | "quarter" | "year">
    ) => {
      state.dealsPeriod = action.payload;
    },
    setDemonetized: (state, action: PayloadAction<boolean>) => {
      state.isDemonetized = action.payload;
    },
    setShadowbanned: (state, action: PayloadAction<boolean>) => {
      state.isShadowbanned = action.payload;
    },
    setContentSearch: (state, action: PayloadAction<string>) => {
      state.contentSearch = action.payload;
    },
    setSelectedMetric: (state, action: PayloadAction<MetricType>) => {
      state.selectedMetric = action.payload;
    },
    setContentSortField: (state, action: PayloadAction<SortField>) => {
      state.contentSortField = action.payload;
    },
    setContentSortOrder: (state, action: PayloadAction<"asc" | "desc">) => {
      state.contentSortOrder = action.payload;
    },
    setContentFilters: (state, action: PayloadAction<FilterState>) => {
      state.contentFilters = action.payload;
    },
    setRowsPerPage: (state, action: PayloadAction<RowsPerPage>) => {
      state.rowsPerPage = action.payload;
    },
    setSelectedCreator: (state, action: PayloadAction<string | null>) => {
      state.selectedCreator = action.payload;
    },
    setSelectedType: (state, action: PayloadAction<PostType | null>) => {
      state.selectedType = action.payload;
    },
    resetAnalytics: (state) => {
      return initialState;
    },
    updateLiveMetrics: (state, action: PayloadAction<LiveMetricsData>) => {
      state.liveMetrics = action.payload;
    },
  },
});

export const {
  setTimeRange,
  setActiveTab,
  setSearch,
  setSortField,
  setSortDirection,
  setSelectedApp,
  setSelectedTab,
  setViewType,
  setDealsPeriod,
  setDemonetized,
  setShadowbanned,
  setContentSearch,
  setSelectedMetric,
  setContentSortField,
  setContentSortOrder,
  setContentFilters,
  setRowsPerPage,
  setSelectedCreator,
  setSelectedType,
  resetAnalytics,
  updateLiveMetrics,
} = analyticsSlice.actions;

export default analyticsSlice.reducer;
