import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SharesState, Wave } from '../types';

const initialState: SharesState = {
  totalShares: 0,
  currentPrice: 0,
  waves: [],
  editingWave: null,
  editedWave: null,
};

export const sharesSlice = createSlice({
  name: 'shares',
  initialState,
  reducers: {
    setTotalShares: (state, action: PayloadAction<number>) => {
      state.totalShares = action.payload;
    },
    setCurrentPrice: (state, action: PayloadAction<number>) => {
      state.currentPrice = action.payload;
    },
    setWaves: (state, action: PayloadAction<Wave[]>) => {
      state.waves = action.payload;
    },
    addWave: (state, action: PayloadAction<Wave>) => {
      state.waves.push(action.payload);
    },
    removeWave: (state, action: PayloadAction<number>) => {
      state.waves = state.waves.filter((_, index) => index !== action.payload);
    },
    setEditingWave: (state, action: PayloadAction<number | null>) => {
      state.editingWave = action.payload;
      state.editedWave = action.payload !== null ? state.waves[action.payload] : null;
    },
    setEditedWave: (state, action: PayloadAction<Wave | null>) => {
      state.editedWave = action.payload;
    },
    saveWaveEdit: (state) => {
      if (state.editingWave !== null && state.editedWave !== null) {
        state.waves[state.editingWave] = state.editedWave;
        state.editingWave = null;
        state.editedWave = null;
      }
    },
  },
});

export const {
  setTotalShares,
  setCurrentPrice,
  setWaves,
  addWave,
  removeWave,
  setEditingWave,
  setEditedWave,
  saveWaveEdit,
} = sharesSlice.actions;

export default sharesSlice.reducer; 