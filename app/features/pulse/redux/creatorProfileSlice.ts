import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import type { AppDispatch, RootState } from "@/redux/store";
import type { Creator } from "@/app/features/pulse/type";

interface CreatorProfileState {
  selectedCreator: Creator | null;
  loading: boolean;
  error: string | null;
  moderationAction: string;
  moderationDuration: number;
  moderationReason: string;
  boostLevel: number;
  boostDuration: number;
  isModerateOpen: boolean;
  isBoostOpen: boolean;
  revenueMetrics: Array<{
    label: string;
    thisMonth: number;
    thisYear: number;
    allTime: number;
    change: number;
  }>;
  revenueData: Array<{
    month: string;
    ads: number;
    bookings: number;
    deals: number;
  }>;
  audienceData: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  ageData: Array<{
    age: string;
    value: number;
  }>;
  genderData: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}

const initialState: CreatorProfileState = {
  selectedCreator: null,
  loading: false,
  error: null,
  moderationAction: "",
  moderationDuration: 7,
  moderationReason: "",
  boostLevel: 0,
  boostDuration: 7,
  isModerateOpen: false,
  isBoostOpen: false,
  revenueMetrics: [],
  revenueData: [],
  audienceData: [],
  ageData: [],
  genderData: [],
};

interface ModerationPayload {
  creatorId: string;
  action: string;
  duration: number;
  reason: string;
}

interface BoostPayload {
  creatorId: string;
  level: number;
  duration: number;
}

export const applyModeration = createAsyncThunk<
  Creator,
  ModerationPayload,
  { dispatch: AppDispatch; state: RootState }
>("creatorProfile/applyModeration", async (payload) => {
  const response = await fetch(
    `http://localhost:3001/api/pulse/creators/${payload.creatorId}/moderation`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: payload.action,
        duration: payload.duration,
        reason: payload.reason,
      }),
    }
  );
  if (!response.ok) {
    throw new Error('Failed to apply moderation');
  }
  return response.json();
});

export const applyBoost = createAsyncThunk<
  Creator,
  BoostPayload,
  { dispatch: AppDispatch; state: RootState }
>("creatorProfile/applyBoost", async (payload) => {
  const response = await fetch(
    `http://localhost:3001/api/pulse/creators/${payload.creatorId}/boost`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        level: payload.level,
        duration: payload.duration,
      }),
    }
  );
  if (!response.ok) {
    throw new Error('Failed to apply boost');
  }
  return response.json();
});

export const removeBoost = createAsyncThunk<
  Creator,
  string,
  { dispatch: AppDispatch; state: RootState }
>("creatorProfile/removeBoost", async (creatorId) => {
  const response = await fetch(
    `http://localhost:3001/api/pulse/creators/${creatorId}/boost`,
    {
      method: 'DELETE',
    }
  );
  if (!response.ok) {
    throw new Error('Failed to remove boost');
  }
  return response.json();
});

export const removeModeration = createAsyncThunk<
  Creator,
  string,
  { dispatch: AppDispatch; state: RootState }
>("creatorProfile/removeModeration", async (creatorId) => {
  const response = await fetch(
    `http://localhost:3001/api/pulse/creators/${creatorId}/moderation`,
    {
      method: 'DELETE',
    }
  );
  if (!response.ok) {
    throw new Error('Failed to remove moderation');
  }
  return response.json();
});

export const removeModerationCase = createAsyncThunk<
  Creator,
  { creatorId: string; index: number },
  { dispatch: AppDispatch; state: RootState }
>("creatorProfile/removeModerationCase", async ({ creatorId, index }) => {
  const response = await fetch(
    `http://localhost:3001/api/pulse/creators/${creatorId}/moderate/case`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ index }),
    }
  );
  if (!response.ok) {
    throw new Error('Failed to remove moderation case');
  }
  return response.json();
});

const creatorProfileSlice = createSlice({
  name: "creatorProfile",
  initialState,
  reducers: {
    setModerationAction: (state, action: PayloadAction<string>) => {
      state.moderationAction = action.payload;
    },
    setModerationDuration: (state, action: PayloadAction<number>) => {
      state.moderationDuration = action.payload;
    },
    setModerationReason: (state, action: PayloadAction<string>) => {
      state.moderationReason = action.payload;
    },
    setBoostLevel: (state, action: PayloadAction<number>) => {
      state.boostLevel = action.payload;
    },
    setBoostDuration: (state, action: PayloadAction<number>) => {
      state.boostDuration = action.payload;
    },
    setModerateOpen: (state, action: PayloadAction<boolean>) => {
      state.isModerateOpen = action.payload;
    },
    setBoostOpen: (state, action: PayloadAction<boolean>) => {
      state.isBoostOpen = action.payload;
    },
    setSelectedCreator: (state, action: PayloadAction<Creator>) => {
      state.selectedCreator = action.payload;
    },
    resetModerationState: (state) => {
      state.moderationAction = "";
      state.moderationDuration = 7;
      state.moderationReason = "";
      state.isModerateOpen = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(applyModeration.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyModeration.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCreator = action.payload;
        state.moderationAction = "";
        state.moderationDuration = 7;
        state.moderationReason = "";
        state.isModerateOpen = false;
      })
      .addCase(applyModeration.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to apply moderation";
      })
      .addCase(applyBoost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyBoost.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCreator = action.payload;
      })
      .addCase(applyBoost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to apply boost";
      })
      .addCase(removeBoost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeBoost.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCreator = action.payload;
      })
      .addCase(removeBoost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to remove boost";
      })
      .addCase(removeModeration.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeModeration.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCreator = action.payload;
      })
      .addCase(removeModeration.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to remove moderation";
      })
      .addCase(removeModerationCase.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeModerationCase.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCreator = action.payload;
      })
      .addCase(removeModerationCase.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to remove moderation case";
      });
  },
});

export const {
  setModerationAction,
  setModerationDuration,
  setModerationReason,
  setBoostLevel,
  setBoostDuration,
  setModerateOpen,
  setBoostOpen,
  setSelectedCreator,
  resetModerationState,
} = creatorProfileSlice.actions;

export default creatorProfileSlice.reducer; 