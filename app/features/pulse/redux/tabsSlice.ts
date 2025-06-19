import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Tab {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  keywords: string[];
  isSeasonal: boolean;
  isPaused: boolean;
  isAd?: boolean;
  advertiser?: {
    name: string;
    logo: string;
  };
  startDate?: string;
  endDate?: string;
  seasonalDates?: {
    startDate: string;
    endDate: string;
  };
  metrics: {
    views: number;
    clicks: number;
    timeSpent: number;
    shares: number;
    saves: number;
  };
  content: {
    total: number;
    types: {
      articles: number;
      videos: number;
      photos: number;
    };
  };
}

interface TabsState {
  tabs: Tab[];
  isDialogOpen: boolean;
  editingTab: Tab | null;
}

const initialState: TabsState = {
  tabs: [],
  isDialogOpen: false,
  editingTab: null,
};

const tabsSlice = createSlice({
  name: 'tabs',
  initialState,
  reducers: {
    setDialogOpen: (state, action: PayloadAction<boolean>) => {
      state.isDialogOpen = action.payload;
    },
    setEditingTab: (state, action: PayloadAction<Tab | null>) => {
      state.editingTab = action.payload;
    },
    addTab: (state, action: PayloadAction<Omit<Tab, 'id' | 'metrics' | 'content'>>) => {
      const newTab: Tab = {
        id: `tab${Date.now()}`,
        ...action.payload,
        metrics: {
          views: 0,
          clicks: 0,
          timeSpent: 0,
          shares: 0,
          saves: 0
        },
        content: {
          total: 0,
          types: {
            articles: 0,
            videos: 0,
            photos: 0
          }
        }
      };
      state.tabs.push(newTab);
    },
    updateTab: (state, action: PayloadAction<{ id: string; data: Omit<Tab, 'id' | 'metrics' | 'content'> }>) => {
      const index = state.tabs.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.tabs[index] = {
          ...state.tabs[index],
          ...action.payload.data
        };
      }
    },
    deleteTab: (state, action: PayloadAction<string>) => {
      state.tabs = state.tabs.filter(t => t.id !== action.payload);
    },
    setTabs: (state, action: PayloadAction<Tab[]>) => {
      state.tabs = action.payload;
    },
    reorderTabs: (state, action: PayloadAction<Tab[]>) => {
      state.tabs = action.payload;
    },
  },
});

export const {
  setDialogOpen,
  setEditingTab,
  addTab,
  updateTab,
  deleteTab,
  setTabs,
  reorderTabs,
} = tabsSlice.actions;

export default tabsSlice.reducer; 