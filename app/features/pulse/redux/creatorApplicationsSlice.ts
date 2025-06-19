import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { type Creator } from '@/app/features/pulse/type';

interface CreatorApplicationsState {
  applications: Creator[];
  search: string;
  expandedId: string | null;
  approvalDialog: Creator | null;
  loading: boolean;
  error: string | null;
}

const initialState: CreatorApplicationsState = {
  applications: [],
  search: '',
  expandedId: null,
  approvalDialog: null,
  loading: false,
  error: null,
};

export const approveCreator = createAsyncThunk(
  'creatorApplications/approve',
  async ({ id, updates }: { id: string; updates?: { desiredUsername: string; topics: string[] } }) => {
    const response = await fetch(`http://localhost:3001/api/pulse/creators/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'active', ...updates })
    });
    if (!response.ok) throw new Error('Failed to approve creator');
    return response.json();
  }
);

export const rejectCreator = createAsyncThunk(
  'creatorApplications/reject',
  async (id: string) => {
    const response = await fetch(`http://localhost:3001/api/pulse/creators/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'rejected' })
    });
    if (!response.ok) throw new Error('Failed to reject creator');
    return response.json();
  }
);

const creatorApplicationsSlice = createSlice({
  name: 'creatorApplications',
  initialState,
  reducers: {
    setApplications: (state, action: PayloadAction<Creator[]>) => {
      state.applications = action.payload;
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
    setExpandedId: (state, action: PayloadAction<string | null>) => {
      state.expandedId = action.payload;
    },
    setApprovalDialog: (state, action: PayloadAction<Creator | null>) => {
      state.approvalDialog = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(approveCreator.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(approveCreator.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.applications.findIndex(app => app._id === action.payload._id);
        if (index !== -1) {
          state.applications[index] = action.payload;
        }
        state.approvalDialog = null;
      })
      .addCase(approveCreator.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to approve creator';
      })
      .addCase(rejectCreator.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rejectCreator.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.applications.findIndex(app => app._id === action.payload._id);
        if (index !== -1) {
          state.applications[index] = action.payload;
        }
      })
      .addCase(rejectCreator.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to reject creator';
      });
  },
});

export const {
  setApplications,
  setSearch,
  setExpandedId,
  setApprovalDialog,
} = creatorApplicationsSlice.actions;

export default creatorApplicationsSlice.reducer; 