import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FlexSettings } from '../types';

const initialState: FlexSettings = {
  // Task Settings
  minTasksPerBlock: 5,
  maxTasksPerBlock: 15,
  maxActiveBlocks: 3,
  maxDailyTasks: 50,
  taskTimeout: 30,
  
  // Cost Settings
  costPerTask: 5,
  costPerCashTask: 7,
  bonusThreshold: 100,
  bonusAmount: 20,
  
  // Performance Settings
  autoDisableThreshold: 3,
  warningThreshold: 2,
  minAcceptanceRate: 80,
  minCompletionRate: 90,
  
  // Verification Settings
  qrVerificationEnabled: true,
  photoVerificationEnabled: true,
  signatureRequired: true,
  idVerificationRequired: true,
  cashVerificationRequired: true,
  returnVerificationRequired: true,
  stationVerificationRequired: true,
  
  // System Settings
  registrationEnabled: true,
  autoAssignEnabled: true,
  notificationsEnabled: true,
  trackingInterval: 5,
  maxRetryAttempts: 3,
  autoReassignTimeout: 15,
  blockAssignmentWindow: 30,
  
  // Location Settings
  maxRadius: 10,
  locationUpdateInterval: 5,
  geofencingEnabled: true,
  stationCheckInRequired: true,
  stationCheckOutRequired: true,
  maxTaskRadius: 5,
  routeOptimizationEnabled: true,
};

const flexSettingsSlice = createSlice({
  name: 'flexSettings',
  initialState,
  reducers: {
    updateSettings: (state, action: PayloadAction<Partial<FlexSettings>>) => {
      Object.assign(state, action.payload);
    },
    resetSettings: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const {
  updateSettings,
  resetSettings,
} = flexSettingsSlice.actions;

export default flexSettingsSlice.reducer; 