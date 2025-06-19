import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PricingRates } from '../types';

const initialState: PricingRates = {
  base: 5,
  perKm: 0.5,

  // Region-based pricing (with Beirut as base)
  regions: [
    { name: "Beirut", multiplier: 1.0 },
    { name: "Mount Lebanon", multiplier: 1.2 },
    { name: "North Lebanon", multiplier: 1.3 },
    { name: "South Lebanon", multiplier: 1.3 },
    { name: "Bekaa", multiplier: 1.4 },
  ],

  // Peak Season pricing
  peakSeasons: [
    {
      name: "Black Friday",
      startDate: "2024-11-25",
      endDate: "2024-11-30",
      percentage: 25,
    },
    {
      name: "Christmas",
      startDate: "2024-12-20",
      endDate: "2024-12-26",
      percentage: 30,
    },
  ],

  // Business rates
  businessBaseMultiplier: 0.9,
  businessVolumeDiscounts: [
    { minVolume: 100, discount: 0.05 },
    { minVolume: 500, discount: 0.1 },
    { minVolume: 1000, discount: 0.15 },
  ],

  // Urgent delivery
  urgentDeliveryMultiplier: 2.0,
  urgentMaxDistance: 10,
  urgentTimeWindow: 60,
};

const flexPricingSlice = createSlice({
  name: 'flexPricing',
  initialState,
  reducers: {
    updateRates: (state, action: PayloadAction<Partial<PricingRates>>) => {
      Object.assign(state, action.payload);
    },
    resetRates: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const {
  updateRates,
  resetRates,
} = flexPricingSlice.actions;

export default flexPricingSlice.reducer; 