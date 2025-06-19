import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AnalyticsState, GenderData, AgeData, LocationData } from '../types';

const initialState: AnalyticsState = {
  genderData: [
    { id: "male", value: 60, fill: "#FF0000" },
    { id: "female", value: 35, fill: "#FF0000" },
    { id: "other", value: 5, fill: "#FF0000" },
  ],
  ageData: [
    { range: "18-24", value: 15 },
    { range: "25-34", value: 30 },
    { range: "35-44", value: 25 },
    { range: "45-54", value: 20 },
    { range: "55+", value: 10 },
  ],
  locationData: [
    { country: 'Lebanon', value: 45, fill: '#FF0000' },
    { country: 'UAE', value: 20, fill: '#FF0000' },
    { country: 'Saudi Arabia', value: 15, fill: '#FF0000' },
    { country: 'Qatar', value: 12, fill: '#FF0000' },
    { country: 'Other', value: 8, fill: '#FF0000' },
  ],
  genderConfig: {
    value: {
      label: "Percentage",
    },
    male: {
      label: "Male",
      color: "hsl(var(--chart-1))",
    },
    female: {
      label: "Female",
      color: "hsl(var(--chart-2))",
    },
    other: {
      label: "Other",
      color: "hsl(var(--chart-3))",
    },
  },
  ageConfig: {
    value: {
      label: "Percentage",
      color: "hsl(var(--chart-1))",
    },
    label: {
      color: "hsl(var(--background))",
    },
  },
  locationConfig: {
    value: {
      label: 'Investors',
    },
    Lebanon: {
      label: 'Lebanon',
      color: '#FF0000',
    },
    UAE: {
      label: 'UAE',
      color: '#FF3333',
    },
    'Saudi Arabia': {
      label: 'Saudi Arabia',
      color: '#FF6666',
    },
    Qatar: {
      label: 'Qatar',
      color: '#FF9999',
    },
    Other: {
      label: 'Other',
      color: '#FFCCCC',
    },
  },
};

export const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    setGenderData: (state, action: PayloadAction<GenderData[]>) => {
      state.genderData = action.payload;
    },
    setAgeData: (state, action: PayloadAction<AgeData[]>) => {
      state.ageData = action.payload;
    },
    setLocationData: (state, action: PayloadAction<LocationData[]>) => {
      state.locationData = action.payload;
    },
    updateGenderData: (state, action: PayloadAction<{ id: string; value: number }>) => {
      const index = state.genderData.findIndex(d => d.id === action.payload.id);
      if (index !== -1) {
        state.genderData[index].value = action.payload.value;
      }
    },
    updateAgeData: (state, action: PayloadAction<{ range: string; value: number }>) => {
      const index = state.ageData.findIndex(d => d.range === action.payload.range);
      if (index !== -1) {
        state.ageData[index].value = action.payload.value;
      }
    },
    updateLocationData: (state, action: PayloadAction<{ country: string; value: number }>) => {
      const index = state.locationData.findIndex(d => d.country === action.payload.country);
      if (index !== -1) {
        state.locationData[index].value = action.payload.value;
      }
    },
  },
});

export const {
  setGenderData,
  setAgeData,
  setLocationData,
  updateGenderData,
  updateAgeData,
  updateLocationData,
} = analyticsSlice.actions;

export default analyticsSlice.reducer; 