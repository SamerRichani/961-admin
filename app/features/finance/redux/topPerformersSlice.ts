import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface TopCreator {
  _id: string;
  name: string;
  totalRevenue: number;
  revenueCount: number;
  averageRevenuePerUser: number;
  totalActiveUsers: number;
}

export interface TopLocation {
  _id: {
    country: string;
    region: string;
    city: string;
  };
  totalRevenue: number;
  revenueCount: number;
  averageRevenuePerUser: number;
  totalActiveUsers: number;
}

export interface TopAdvertiser {
  _id: string;
  name: string;
  totalRevenue: number;
  revenueCount: number;
  averageRevenuePerUser: number;
  totalActiveUsers: number;
}

interface TopPerformersState {
  topCreators: TopCreator[];
  topLocations: TopLocation[];
  topAdvertisers: TopAdvertiser[];
  loading: boolean;
  error: string | null;
}

const mockTopCreators: TopCreator[] = [
  {
    _id: "CR001",
    name: "Sarah Johnson",
    totalRevenue: 50000,
    revenueCount: 12.5,
    averageRevenuePerUser: 12.5,
    totalActiveUsers: 12.5,
  },
  {
    _id: "CR002",
    name: "Michael Chen",
    totalRevenue: 45000,
    revenueCount: 11.25,
    averageRevenuePerUser: 11.25,
    totalActiveUsers: 11.25,
  },
  {
    _id: "CR003",
    name: "Emma Davis",
    totalRevenue: 42000,
    revenueCount: 10.5,
    averageRevenuePerUser: 10.5,
    totalActiveUsers: 10.5,
  },
];

const mockTopLocations: TopLocation[] = [
  {
    _id: {
      country: "Lebanon",
      region: "Beirut",
      city: "Beirut",
    },
    totalRevenue: 75000,
    revenueCount: 15,
    averageRevenuePerUser: 15,
    totalActiveUsers: 15,
  },
  {
    _id: {
      country: "Lebanon",
      region: "Jounieh",
      city: "Jounieh",
    },
    totalRevenue: 65000,
    revenueCount: 13,
    averageRevenuePerUser: 13,
    totalActiveUsers: 13,
  },
  {
    _id: {
      country: "Lebanon",
      region: "Faraya",
      city: "Faraya",
    },
    totalRevenue: 55000,
    revenueCount: 11,
    averageRevenuePerUser: 11,
    totalActiveUsers: 11,
  },
];

const mockTopAdvertisers: TopAdvertiser[] = [
  {
    _id: "AD001",
    name: "Tech Solutions Inc",
    totalRevenue: 85000,
    revenueCount: 17,
    averageRevenuePerUser: 17,
    totalActiveUsers: 17,
  },
  {
    _id: "AD002",
    name: "Fashion Boutique",
    totalRevenue: 75000,
    revenueCount: 15,
    averageRevenuePerUser: 15,
    totalActiveUsers: 15,
  },
  {
    _id: "AD003",
    name: "Restaurant Chain",
    totalRevenue: 65000,
    revenueCount: 13,
    averageRevenuePerUser: 13,
    totalActiveUsers: 13,
  },
];

const initialState: TopPerformersState = {
  topCreators: [],
  topLocations: [],
  topAdvertisers: [],
  loading: false,
  error: null,
};

const topPerformersSlice = createSlice({
  name: "topPerformers",
  initialState,
  reducers: {
    setTopCreators: (state, action: PayloadAction<TopCreator[]>) => {
      state.topCreators = action.payload;
    },
    setTopLocations: (state, action: PayloadAction<TopLocation[]>) => {
      state.topLocations = action.payload;
    },
    setTopAdvertisers: (state, action: PayloadAction<TopAdvertiser[]>) => {
      state.topAdvertisers = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    initializeMockData: (state) => {
      state.topCreators = mockTopCreators;
      state.topLocations = mockTopLocations;
      state.topAdvertisers = mockTopAdvertisers;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setTopCreators,
  setTopLocations,
  setTopAdvertisers,
  setLoading,
  setError,
  initializeMockData,
} = topPerformersSlice.actions;

export default topPerformersSlice.reducer;
