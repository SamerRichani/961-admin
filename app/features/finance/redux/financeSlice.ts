import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  FinanceState,
  type RevenueData,
  type TimeRange,
} from "@/app/features/finance/type";
import { RevenueStream } from "./revenueChartsSlice";

const initialState: FinanceState = {
  timeRange: "monthly",
  revenueData: [],
  revenueStreams: [],
  topCreators: [],
  topPlaces: [],
  topAdvertisers: [],
};

const financeSlice = createSlice({
  name: "finance",
  initialState,
  reducers: {
    setTimeRange: (state, action: PayloadAction<TimeRange>) => {
      state.timeRange = action.payload;
    },
    setRevenueData: (state, action: PayloadAction<RevenueData[]>) => {
      state.revenueData = action.payload;
    },
    setRevenueStreams: (state, action: PayloadAction<RevenueStream[]>) => {
      state.revenueStreams = action.payload;
    },
    setTopCreators: (
      state,
      action: PayloadAction<FinanceState["topCreators"]>
    ) => {
      state.topCreators = action.payload;
    },
    setTopPlaces: (state, action: PayloadAction<FinanceState["topPlaces"]>) => {
      state.topPlaces = action.payload;
    },
    setTopAdvertisers: (
      state,
      action: PayloadAction<FinanceState["topAdvertisers"]>
    ) => {
      state.topAdvertisers = action.payload;
    },
  },
});

export const {
  setTimeRange,
  setRevenueData,
  setRevenueStreams,
  setTopCreators,
  setTopPlaces,
  setTopAdvertisers,
} = financeSlice.actions;

export default financeSlice.reducer;
