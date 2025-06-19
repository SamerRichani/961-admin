import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { type ContentState, type ContentType, type ReachLevel } from '@/app/features/pulse/type';

const initialState: ContentState = {
  content: [],
  search: '',
  selectedType: 'all',
  selectedReach: 'all',
  reachSliders: {},
  loading: false,
  error: null,
};

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
    setSelectedType: (state, action: PayloadAction<ContentType | 'all'>) => {
      state.selectedType = action.payload;
    },
    setSelectedReach: (state, action: PayloadAction<ReachLevel | 'all'>) => {
      state.selectedReach = action.payload;
    },
    setReachSlider: (state, action: PayloadAction<{ contentId: string; value: number }>) => {
      state.reachSliders[action.payload.contentId] = action.payload.value;
    },
    toggleDemonetize: (state, action: PayloadAction<string>) => {
      const content = state.content.find(item => item.id === action.payload);
      if (content) {
        content.isDemonetized = !content.isDemonetized;
      }
    },
    toggleShadowban: (state, action: PayloadAction<string>) => {
      const content = state.content.find(item => item.id === action.payload);
      if (content) {
        content.isShadowbanned = !content.isShadowbanned;
      }
    },
    setContent: (state, action: PayloadAction<ContentState['content']>) => {
      state.content = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    deleteContent: (state, action: PayloadAction<string>) => {
      state.content = state.content.filter(item => item.id !== action.payload);
    },
    boostContent: (state, action: PayloadAction<{ id: string; level: number; duration: number }>) => {
      const content = state.content.find(item => item.id === action.payload.id);
      if (content) {
        content.currentBoost = {
          level: action.payload.level,
          duration: action.payload.duration,
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + action.payload.duration * 24 * 60 * 60 * 1000).toISOString()
        };
      }
    },
  },
});

export const {
  setSearch,
  setSelectedType,
  setSelectedReach,
  setReachSlider,
  toggleDemonetize,
  toggleShadowban,
  setContent,
  setLoading,
  setError,
  deleteContent,
  boostContent,
} = contentSlice.actions;

export default contentSlice.reducer; 