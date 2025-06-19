import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { VATSection } from '../type';

interface VATState {
  period: string;
  activeTab: VATSection;
  periods: any[];
  loading: boolean;
  error: string | null;
}

const initialState: VATState = {
  period: 'Q1',
  activeTab: 'summary',
  periods: [],
  loading: false,
  error: null,
};

const vatSlice = createSlice({
  name: 'vat',
  initialState,
  reducers: {
    setPeriod: (state, action: PayloadAction<string>) => {
      state.period = action.payload;
    },
    setActiveTab: (state, action: PayloadAction<VATSection>) => {
      state.activeTab = action.payload;
    },
    setPeriods: (state, action: PayloadAction<any[]>) => {
      state.periods = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setPeriod, setActiveTab, setPeriods, setLoading, setError } = vatSlice.actions;
export default vatSlice.reducer;
