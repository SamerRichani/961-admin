import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CreatorContentState, type ContentItem, type SortField } from '@/app/features/pulse/type';

const initialState: CreatorContentState = {
  content: [],
  search: '',
  sortField: 'views',
  sortDirection: 'desc',
  loading: false,
  error: null,
};

const creatorContentSlice = createSlice({
  name: 'creatorContent',
  initialState,
  reducers: {
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
    setSortField: (state, action: PayloadAction<SortField>) => {
      state.sortField = action.payload;
    },
    setSortDirection: (state, action: PayloadAction<'asc' | 'desc'>) => {
      state.sortDirection = action.payload;
    },
    setContent: (state, action: PayloadAction<ContentItem[]>) => {
      state.content = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    toggleShadowban: (state, action: PayloadAction<string>) => {
      const content = state.content.find(item => item.id === action.payload);
      if (content) {
        content.isShadowbanned = !content.isShadowbanned;
      }
    },
    toggleDemonetize: (state, action: PayloadAction<string>) => {
      const content = state.content.find(item => item.id === action.payload);
      if (content) {
        content.isDemonetized = !content.isDemonetized;
      }
    },
  },
});

export const {
  setSearch,
  setSortField,
  setSortDirection,
  setContent,
  setLoading,
  setError,
  toggleShadowban,
  toggleDemonetize,
} = creatorContentSlice.actions;

export default creatorContentSlice.reducer; 