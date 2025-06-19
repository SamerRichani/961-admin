import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { type Flexer } from '@/app/features/flex/types';
import { FlexersState } from '../types';
const initialState: FlexersState = {
  flexers: [
    {
      id: 'FLX001',
      name: 'John Smith',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&q=90',
      status: 'active',
      rating: 4.8,
      totalBlocks: 250,
      completedTasks: 1250,
      failedTasks: 12,
      totalEarnings: 12500,
      avgBlockTime: '3h 45m',
      cashAccuracy: 99.8
    },
    {
      id: 'FLX002',
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&q=90',
      status: 'active',
      rating: 4.9,
      totalBlocks: 180,
      completedTasks: 900,
      failedTasks: 5,
      totalEarnings: 9000,
      avgBlockTime: '3h 30m',
      cashAccuracy: 100
    },
    {
      id: 'FLX003',
      name: 'Michael Chen',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&h=96&q=90',
      status: 'inactive',
      rating: 4.5,
      totalBlocks: 120,
      completedTasks: 600,
      failedTasks: 8,
      totalEarnings: 6000,
      avgBlockTime: '4h 15m',
      cashAccuracy: 99.5
    }
  ],
  selectedFlexer: null,
  moderateFlexer: null,
  banFlexer: null
};

const flexersSlice = createSlice({
  name: 'flexers',
  initialState,
  reducers: {
    setSelectedFlexer: (state, action: PayloadAction<Flexer | null>) => {
      state.selectedFlexer = action.payload;
    },
    setModerateFlexer: (state, action: PayloadAction<Flexer | null>) => {
      state.moderateFlexer = action.payload;
    },
    setBanFlexer: (state, action: PayloadAction<Flexer | null>) => {
      state.banFlexer = action.payload;
    },
    moderateFlexer: (state, action: PayloadAction<{ flexerId: string; restrictions: { noCashTasks: boolean; noCashOnDelivery: boolean; reason: string } }>) => {
      const flexer = state.flexers.find(f => f.id === action.payload.flexerId);
      if (flexer) {
        // Apply moderation restrictions
        console.log('Moderating flexer:', flexer.id, action.payload.restrictions);
      }
      state.moderateFlexer = null;
    },
    banFlexer: (state, action: PayloadAction<{ flexerId: string; reason: string }>) => {
      const flexer = state.flexers.find(f => f.id === action.payload.flexerId);
      if (flexer) {
        // Apply ban
        console.log('Banning flexer:', flexer.id, action.payload.reason);
      }
      state.banFlexer = null;
    }
  }
});

export const {
  setSelectedFlexer,
  setModerateFlexer,
  setBanFlexer,
  moderateFlexer,
  banFlexer
} = flexersSlice.actions;

export default flexersSlice.reducer; 