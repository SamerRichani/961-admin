import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserDemographicsState, LocationData, DeviceData, UserProfileData } from '../types';

const initialState: UserDemographicsState = {
  locationData: [
    {
      country: 'Lebanon',
      users: 450000,
      regions: [
        {
          name: 'Mount Lebanon',
          users: 150000,
          cities: [
            { name: 'Jounieh', users: 45000 },
            { name: 'Jbeil', users: 35000 },
            { name: 'Broummana', users: 25000 },
            { name: 'Aley', users: 25000 },
            { name: 'Other', users: 20000 }
          ]
        },
        {
          name: 'Beirut',
          users: 120000,
          cities: [
            { name: 'Ashrafieh', users: 35000 },
            { name: 'Hamra', users: 30000 },
            { name: 'Downtown', users: 25000 },
            { name: 'Verdun', users: 20000 },
            { name: 'Other', users: 10000 }
          ]
        },
        {
          name: 'North Lebanon',
          users: 80000,
          cities: [
            { name: 'Tripoli', users: 40000 },
            { name: 'Zgharta', users: 15000 },
            { name: 'Batroun', users: 15000 },
            { name: 'Other', users: 10000 }
          ]
        },
        {
          name: 'South Lebanon',
          users: 50000,
          cities: [
            { name: 'Sidon', users: 25000 },
            { name: 'Tyre', users: 15000 },
            { name: 'Other', users: 10000 }
          ]
        },
        {
          name: 'Bekaa',
          users: 50000,
          cities: [
            { name: 'Zahle', users: 20000 },
            { name: 'Baalbek', users: 15000 },
            { name: 'Other', users: 15000 }
          ]
        }
      ]
    },
    { country: 'UAE', users: 250000 },
    { country: 'KSA', users: 150000 },
    { country: 'Qatar', users: 100000 },
    { country: 'Other', users: 50000 },
  ],
  deviceData: {
    platform: [
      { name: 'Mobile', value: 65 },
      { name: 'Web', value: 35 },
    ],
    mobile: [
      {
        name: 'iOS',
        value: 55,
        details: [
          { model: 'iPhone 14', share: 25 },
          { model: 'iPhone 13', share: 20 },
          { model: 'iPhone 12', share: 10 },
        ]
      },
      {
        name: 'Android',
        value: 45,
        details: [
          { model: 'Samsung S23', share: 20 },
          { model: 'Samsung S22', share: 15 },
          { model: 'Other Android', share: 10 },
        ]
      },
    ],
    browser: [
      { name: 'Chrome', value: 45, icon: 'Chrome' },
      { name: 'Safari', value: 35, icon: 'Safari' },
      { name: 'Firefox', value: 15, icon: 'Firefox' },
      { name: 'Other', value: 5, icon: 'Globe2' },
    ],
  },
  cellProviders: [
    { name: 'Touch', users: 250000, percentage: 55 },
    { name: 'Alfa', users: 200000, percentage: 45 },
  ],
  internetProviders: [
    { name: 'Ogero', users: 150000, percentage: 40 },
    { name: 'IDM', users: 100000, percentage: 25 },
    { name: 'Terranet', users: 75000, percentage: 20 },
    { name: 'Sodetel', users: 50000, percentage: 15 },
  ],
  userProfileData: {
    gender: [
      { name: 'Male', value: 60 },
      { name: 'Female', value: 40 },
    ],
    ageGroups: [
      { age: '18-24', value: 25 },
      { age: '25-34', value: 35 },
      { age: '35-44', value: 20 },
      { age: '45-54', value: 15 },
      { age: '55+', value: 5 },
    ],
    languages: [
      { name: 'Arabic', value: 60 },
      { name: 'English', value: 30 },
      { name: 'French', value: 10 },
    ],
    interests: [
      { name: 'Food & Dining', value: 22 },
      { name: 'Entertainment', value: 18 },
      { name: 'Shopping', value: 15 },
      { name: 'Travel', value: 12 },
      { name: 'Fashion', value: 10 },
      { name: 'Technology', value: 8 },
      { name: 'Sports', value: 6 },
      { name: 'Health & Fitness', value: 5 },
      { name: 'Education', value: 4 },
    ],
  },
};

export const userDemographicsSlice = createSlice({
  name: 'userDemographics',
  initialState,
  reducers: {
    updateLocationData: (state, action: PayloadAction<LocationData[]>) => {
      state.locationData = action.payload;
    },
    updateDeviceData: (state, action: PayloadAction<DeviceData>) => {
      state.deviceData = action.payload;
    },
    updateCellProviders: (state, action: PayloadAction<Array<{ name: string; users: number; percentage: number }>>) => {
      state.cellProviders = action.payload;
    },
    updateInternetProviders: (state, action: PayloadAction<Array<{ name: string; users: number; percentage: number }>>) => {
      state.internetProviders = action.payload;
    },
    updateUserProfileData: (state, action: PayloadAction<UserProfileData>) => {
      state.userProfileData = action.payload;
    },
  },
});

export const {
  updateLocationData,
  updateDeviceData,
  updateCellProviders,
  updateInternetProviders,
  updateUserProfileData,
} = userDemographicsSlice.actions;

export default userDemographicsSlice.reducer; 