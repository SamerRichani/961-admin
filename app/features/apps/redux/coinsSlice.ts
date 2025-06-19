import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CoinsState, CoinPackage, CustomAmount } from '@/app/features/apps/types';

const initialState: CoinsState = {
  packages: [],
  customAmount: {
    minAmount: 100,
    maxAmount: 10000,
    pricePerCoin: 0.01,
  },
  isDialogOpen: false,
  editingPackage: null,
  newPackage: {
    name: '',
    description: '',
    coins: 100,
    price: 0.99,
    isPopular: false,
    isBestValue: false,
  },
};

const coinsSlice = createSlice({
  name: 'coins',
  initialState,
  reducers: {
    setPackages: (state, action: PayloadAction<CoinPackage[]>) => {
      state.packages = action.payload;
    },
    setCustomAmount: (state, action: PayloadAction<CustomAmount>) => {
      state.customAmount = action.payload;
    },
    setIsDialogOpen: (state, action: PayloadAction<boolean>) => {
      state.isDialogOpen = action.payload;
    },
    setEditingPackage: (state, action: PayloadAction<CoinPackage | null>) => {
      state.editingPackage = action.payload;
    },
    setNewPackage: (state, action: PayloadAction<Partial<CoinPackage>>) => {
      state.newPackage = action.payload;
    },
    updatePackage: (state, action: PayloadAction<{ id: string; updates: Partial<CoinPackage> }>) => {
      const { id, updates } = action.payload;
      state.packages = state.packages.map(p =>
        p._id === id ? { ...p, ...updates } : p
      );
    },
    addPackage: (state, action: PayloadAction<CoinPackage>) => {
      const newPackage = {
        ...action.payload,
        _id: action.payload._id || Date.now().toString(),
      };
      state.packages.push(newPackage);
    },
    deletePackage: (state, action: PayloadAction<string>) => {
      state.packages = state.packages.filter(p => p._id !== action.payload);
    },
    resetNewPackage: (state) => {
      state.newPackage = {
        name: '',
        description: '',
        coins: 100,
        price: 0.99,
        isPopular: false,
        isBestValue: false,
      };
    },
  },
});

export const {
  setPackages,
  setCustomAmount,
  setIsDialogOpen,
  setEditingPackage,
  setNewPackage,
  updatePackage,
  addPackage,
  deletePackage,
  resetNewPackage,
} = coinsSlice.actions;

export default coinsSlice.reducer; 