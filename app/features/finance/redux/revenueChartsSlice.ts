import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface RevenueDataPoint {
  month: string;
  revenue: number;
}

export interface RevenueStream {
  name: string;
  amount: number;
  value: number;
}

export interface RevenueChartsState {
  revenueData: RevenueDataPoint[];
  revenueStreams: RevenueStream[];
  loading: boolean;
  error: string | null;
}

const mockRevenueData: RevenueDataPoint[] = [
  { month: "Jan", revenue: 120000 },
  { month: "Feb", revenue: 150000 },
  { month: "Mar", revenue: 180000 },
  { month: "Apr", revenue: 160000 },
  { month: "May", revenue: 200000 },
  { month: "Jun", revenue: 220000 },
  { month: "Jul", revenue: 250000 },
  { month: "Aug", revenue: 280000 },
  { month: "Sep", revenue: 300000 },
  { month: "Oct", revenue: 320000 },
  { month: "Nov", revenue: 350000 },
  { month: "Dec", revenue: 380000 },
];

const mockRevenueStreams: RevenueStream[] = [
  { name: "Deals", amount: 1200000, value: 40 },
  { name: "Subscriptions", amount: 900000, value: 30 },
  { name: "Advertising", amount: 600000, value: 20 },
  { name: "Other", amount: 300000, value: 10 },
];

const initialState: RevenueChartsState = {
  revenueData: [],
  revenueStreams: [],
  loading: false,
  error: null,
};

const revenueChartsSlice = createSlice({
  name: "revenueCharts",
  initialState,
  reducers: {
    setRevenueData: (state, action: PayloadAction<RevenueDataPoint[]>) => {
      state.revenueData = action.payload;
    },
    setRevenueStreams: (state, action: PayloadAction<RevenueStream[]>) => {
      state.revenueStreams = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    initializeMockData: (state) => {
      state.revenueData = mockRevenueData;
      state.revenueStreams = mockRevenueStreams;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setRevenueData,
  setRevenueStreams,
  setLoading,
  setError,
  initializeMockData,
} = revenueChartsSlice.actions;

export default revenueChartsSlice.reducer;
