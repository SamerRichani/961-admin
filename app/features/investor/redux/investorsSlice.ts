import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { InvestorsState, Investor } from '../types';

const initialState: InvestorsState = {
  investors: [
    {
      id: '1',
      name: 'John Smith',
      totalShares: 1000,
      averagePrice: 12.5,
      totalInvestment: 12500,
      joinDate: '2024-01-15T00:00:00Z',
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      totalShares: 2500,
      averagePrice: 11.8,
      totalInvestment: 29500,
      joinDate: '2024-02-01T00:00:00Z',
    },
    {
      id: '3',
      name: 'Michael Brown',
      totalShares: 500,
      averagePrice: 13.2,
      totalInvestment: 6600,
      joinDate: '2024-02-15T00:00:00Z',
    },
  ],
  search: '',
  sortField: 'name',
  sortDirection: 'asc',
};

export const investorsSlice = createSlice({
  name: 'investors',
  initialState,
  reducers: {
    setInvestors: (state, action: PayloadAction<Investor[]>) => {
      state.investors = action.payload;
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
    setSortField: (state, action: PayloadAction<'name' | 'shares' | 'investment' | 'joinDate'>) => {
      if (state.sortField === action.payload) {
        state.sortDirection = state.sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        state.sortField = action.payload;
        state.sortDirection = 'asc';
      }
    },
    addInvestor: (state, action: PayloadAction<Investor>) => {
      state.investors.push(action.payload);
    },
    updateInvestor: (state, action: PayloadAction<Investor>) => {
      const index = state.investors.findIndex(i => i.id === action.payload.id);
      if (index !== -1) {
        state.investors[index] = action.payload;
      }
    },
    removeInvestor: (state, action: PayloadAction<string>) => {
      state.investors = state.investors.filter(i => i.id !== action.payload);
    },
  },
});

export const {
  setInvestors,
  setSearch,
  setSortField,
  addInvestor,
  updateInvestor,
  removeInvestor,
} = investorsSlice.actions;

export default investorsSlice.reducer; 