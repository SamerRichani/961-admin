import { HealthCenter, SuspendedUser, initialBloodState } from '@/app/features/apps/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const bloodSlice = createSlice({
  name: 'blood',
  initialState: initialBloodState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<'centers' | 'suspended'>) => {
      state.activeTab = action.payload;
    },
    setIsAddCenterOpen: (state, action: PayloadAction<boolean>) => {
      state.isAddCenterOpen = action.payload;
    },
    setIsAddSuspendedOpen: (state, action: PayloadAction<boolean>) => {
      state.isAddSuspendedOpen = action.payload;
    },
    setNewUsername: (state, action: PayloadAction<string>) => {
      state.newUsername = action.payload;
    },
    setSuspensionReason: (state, action: PayloadAction<string>) => {
      state.suspensionReason = action.payload;
    },
    setHealthCenters: (state, action: PayloadAction<HealthCenter[]>) => {
      state.healthCenters = action.payload;
    },
    setSuspendedUsers: (state, action: PayloadAction<SuspendedUser[]>) => {
      state.suspendedUsers = action.payload;
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
    addHealthCenter: (state, action: PayloadAction<Partial<HealthCenter>>) => {
      const newCenter: HealthCenter = {
        id: `HC${Date.now()}`,
        name: action.payload.name!,
        location: action.payload.location!,
        coordinates: action.payload.coordinates!,
        createdAt: new Date().toISOString()
      };
      state.healthCenters.push(newCenter);
    },
    addSuspendedUser: (state) => {
      const newSuspendedUser: SuspendedUser = {
        id: `SU${Date.now()}`,
        username: state.newUsername,
        suspendedAt: new Date().toISOString(),
        reason: state.suspensionReason
      };
      state.suspendedUsers.push(newSuspendedUser);
      state.newUsername = '';
      state.suspensionReason = '';
    },
    removeSuspendedUser: (state, action: PayloadAction<string>) => {
      state.suspendedUsers = state.suspendedUsers.filter(user => user.id !== action.payload);
    },
    resetForms: (state) => {
      state.newUsername = '';
      state.suspensionReason = '';
    },
  },
});

export const {
  setActiveTab,
  setIsAddCenterOpen,
  setIsAddSuspendedOpen,
  setNewUsername,
  setSuspensionReason,
  setHealthCenters,
  setSuspendedUsers,
  setSearch,
  addHealthCenter,
  addSuspendedUser,
  removeSuspendedUser,
  resetForms,
} = bloodSlice.actions;

export default bloodSlice.reducer; 