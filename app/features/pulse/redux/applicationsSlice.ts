import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { type Creator, initialState } from '@/app/features/pulse/type';

const applicationsSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {
    setApplications: (state, action: PayloadAction<Creator[]>) => {
      state.applications = action.payload;
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
    approveApplication: (state, action: PayloadAction<{ id: string; updates?: { desiredUsername: string; topics: string[] } }>) => {
      const index = state.applications.findIndex(app => app._id === action.payload.id);
      if (index !== -1) {
        const application = state.applications[index];
        if (action.payload.updates) {
          application.application = {
            ...application.application!,
            desiredUsername: action.payload.updates.desiredUsername,
            topics: action.payload.updates.topics,
          };
        }
        // Here you would typically make an API call to approve the application
        // For now, we'll just remove it from the list
        state.applications = state.applications.filter(app => app._id !== action.payload.id);
      }
    },
    rejectApplication: (state, action: PayloadAction<string>) => {
      // Here you would typically make an API call to reject the application
      // For now, we'll just remove it from the list
      state.applications = state.applications.filter(app => app._id !== action.payload);
    },
  },
});

export const {
  setApplications,
  setSearch,
  approveApplication,
  rejectApplication,
} = applicationsSlice.actions;

export default applicationsSlice.reducer; 