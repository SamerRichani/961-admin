// Deprecated: Navigation slice is no longer used. Navigation is now handled by Next.js routing.

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Page = 
  | 'dashboard'
  | 'finance'
  | 'finance/revenue'
  | 'finance/receivables'
  | 'finance/payables'
  | 'finance/wallets'
  | 'finance/transactions'
  | 'finance/vat'
  | 'pulse'
  | 'pulse/creators'
  | 'pulse/creators/[id]'
  | 'pulse/creators/content'
  | 'pulse/content'
  | 'pulse/tabs'
  | 'pulse/engagement'
  | 'apps'
  | 'apps/blood'
  | 'apps/coins'
  | 'apps/points'
  | 'apps/events'
  | 'flex'
  | 'flex/flexers'
  | 'flex/applications'
  | 'flex/blocks'
  | 'flex/tasks'
  | 'flex/stations'
  | 'flex/pricing'
  | 'flex/settings'
  | 'investor'
  | 'investor/directory'
  | 'investor/updates'
  | 'investor/polls'
  | 'investor/data'
  | 'moderation'
  | 'support'
  | 'users'
  | 'users/[id]'
  | 'analytics'
  | 'analytics/overview'
  | 'analytics/user'
  | 'analytics/revenue'
  | 'analytics/apps'
  | 'analytics/content'
  | 'analytics/tabs'
  | 'analytics/content/[id]';

interface NavigationState {
  currentPage: Page;
  contentId?: string;
  userId?: string;
  creatorId?: string;
}

const initialState: NavigationState = {
  currentPage: 'dashboard',
};

const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<Page>) => {
      state.currentPage = action.payload;
    },
    setContentId: (state, action: PayloadAction<string>) => {
      state.contentId = action.payload;
    },
    setUserId: (state, action: PayloadAction<string | undefined>) => {
      state.userId = action.payload;
    },
    setCreatorId: (state, action: PayloadAction<string>) => {
      state.creatorId = action.payload;
    },
  },
});

export const { setPage, setContentId, setUserId, setCreatorId } = navigationSlice.actions;
export default navigationSlice.reducer; 