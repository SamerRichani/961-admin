import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RevenueAnalyticsState, RevenueData, RevenueSource, Location, DealsMembershipData } from '../types';

const initialState: RevenueAnalyticsState = {
  monthlyTrends: [
    { month: 'Jan', current: 120000, previous: 100000, users: 15000, revenuePerUser: 8.0 },
    { month: 'Feb', current: 135000, previous: 110000, users: 16500, revenuePerUser: 8.2 },
    { month: 'Mar', current: 150000, previous: 120000, users: 18000, revenuePerUser: 8.3 },
    { month: 'Apr', current: 145000, previous: 125000, users: 17500, revenuePerUser: 8.3 },
    { month: 'May', current: 155000, previous: 130000, users: 18500, revenuePerUser: 8.4 },
    { month: 'Jun', current: 160000, previous: 135000, users: 19000, revenuePerUser: 8.4 },
  ],
  revenueSourceData: [
    { name: 'Advertising', value: 320000, icon: 'CreditCard' },
    { name: 'Coins Purchases', value: 200000, icon: 'Coins' },
    { name: 'Merch Sales', value: 160000, icon: 'ShoppingBag' },
    { name: 'Logistics', value: 110000, icon: 'Package' },
    { name: 'Deals Memberships', value: 80000, icon: 'DollarSign' },
  ],
  revenueByLocation: [
    { 
      country: 'Lebanon',
      revenue: 720000,
      percentage: 60,
      regions: [
        {
          name: 'Mount Lebanon',
          revenue: 240000,
          cities: [
            { name: 'Jounieh', revenue: 80000 },
            { name: 'Jbeil', revenue: 60000 },
            { name: 'Broummana', revenue: 50000 },
            { name: 'Aley', revenue: 50000 }
          ]
        },
        {
          name: 'Beirut',
          revenue: 200000,
          cities: [
            { name: 'Ashrafieh', revenue: 60000 },
            { name: 'Hamra', revenue: 50000 },
            { name: 'Downtown', revenue: 50000 },
            { name: 'Verdun', revenue: 40000 }
          ]
        },
        {
          name: 'North Lebanon',
          revenue: 140000,
          cities: [
            { name: 'Tripoli', revenue: 70000 },
            { name: 'Zgharta', revenue: 35000 },
            { name: 'Batroun', revenue: 35000 }
          ]
        },
        {
          name: 'South Lebanon',
          revenue: 80000,
          cities: [
            { name: 'Sidon', revenue: 45000 },
            { name: 'Tyre', revenue: 35000 }
          ]
        },
        {
          name: 'Bekaa',
          revenue: 60000,
          cities: [
            { name: 'Zahle', revenue: 35000 },
            { name: 'Baalbek', revenue: 25000 }
          ]
        }
      ]
    },
    { country: 'UAE', revenue: 300000, percentage: 25 },
    { country: 'KSA', revenue: 120000, percentage: 10 },
    { country: 'Qatar', revenue: 60000, percentage: 5 }
  ],
  dealsMembershipData: {
    periods: {
      day: { revenue: 25000, newSubs: 150, retention: 92.5, churn: 7.5 },
      week: { revenue: 175000, newSubs: 850, retention: 91.2, churn: 8.8 },
      month: { revenue: 750000, newSubs: 3500, retention: 89.5, churn: 10.5 },
      quarter: { revenue: 2250000, newSubs: 9500, retention: 88.2, churn: 11.8 },
      year: { revenue: 9000000, newSubs: 35000, retention: 85.5, churn: 14.5 }
    },
    totalMembers: 125000,
    activeMembers: 112500,
    subscriptionTypes: [
      { type: 'Monthly', members: 75000, revenue: 3750000 },
      { type: 'Yearly', members: 50000, revenue: 5250000 }
    ]
  }
};

const revenueAnalyticsSlice = createSlice({
  name: 'revenueAnalytics',
  initialState,
  reducers: {
    updateMonthlyTrends: (state, action: PayloadAction<RevenueData[]>) => {
      state.monthlyTrends = action.payload;
    },
    updateRevenueSourceData: (state, action: PayloadAction<RevenueSource[]>) => {
      state.revenueSourceData = action.payload;
    },
    updateRevenueByLocation: (state, action: PayloadAction<Location[]>) => {
      state.revenueByLocation = action.payload;
    },
    updateDealsMembershipData: (state, action: PayloadAction<DealsMembershipData>) => {
      state.dealsMembershipData = action.payload;
    }
  }
});

export const {
  updateMonthlyTrends,
  updateRevenueSourceData,
  updateRevenueByLocation,
  updateDealsMembershipData
} = revenueAnalyticsSlice.actions;

export default revenueAnalyticsSlice.reducer; 