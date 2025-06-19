import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PointsState } from '../types';
import { EarningRule } from '../types';
import { PointsSettings } from '@/app/features/apps/types';
import { Reward } from '../types';

const initialState: PointsState = {
  // Earn Settings
  conversionRate: 0.01,
  earningRules: [],
  
  // Expiration Rules
  expirationEnabled: false,
  expirationPeriod: 365,
  expirationNotificationDays: 30,
  
  // Redemption Settings
  rewards: [],

  // UI State
  isDialogOpen: false,
  isRedeemDialogOpen: false,
  editingRule: null,
  newRule: {},
  newReward: {},
  activeTab: 'earn',
  isDeleteDialogOpen: false,
  rewardToDelete: null,
};

const pointsSlice = createSlice({
  name: 'points',
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<'earn' | 'expire' | 'redeem'>) => {
      state.activeTab = action.payload;
    },
    setIsDialogOpen: (state, action: PayloadAction<boolean>) => {
      state.isDialogOpen = action.payload;
    },
    setIsRedeemDialogOpen: (state, action: PayloadAction<boolean>) => {
      state.isRedeemDialogOpen = action.payload;
    },
    setEditingRule: (state, action: PayloadAction<EarningRule | null>) => {
      state.editingRule = action.payload;
    },
    setNewRule: (state, action: PayloadAction<Partial<EarningRule>>) => {
      state.newRule = action.payload;
    },
    setNewReward: (state, action: PayloadAction<Partial<Reward>>) => {
      state.newReward = { ...state.newReward, ...action.payload };
    },
    resetNewReward: (state) => {
      state.newReward = {
        name: '',
        description: '',
        points: 1000,
        validityDays: undefined,
        enabled: true,
        isLimited: false,
        endDate: undefined
      };
    },
    updateSettings: (state, action: PayloadAction<Partial<PointsSettings>>) => {
      Object.assign(state, action.payload);
    },
    updateEarningRule: (state, action: PayloadAction<{ id: string; updates: Partial<EarningRule> }>) => {
      const { id, updates } = action.payload;
      state.earningRules = state.earningRules.map(rule =>
        rule.id === id ? { ...rule, ...updates } : rule
      );
    },
    addEarningRule: (state, action: PayloadAction<EarningRule>) => {
      state.earningRules.push(action.payload);
    },
    deleteEarningRule: (state, action: PayloadAction<string>) => {
      state.earningRules = state.earningRules.filter(rule => rule.id !== action.payload);
    },
    resetNewRule: (state) => {
      state.newRule = {
        action: '',
        points: 100,
        category: 'other',
        enabled: true
      };
    },
    setIsDeleteDialogOpen: (state, action: PayloadAction<boolean>) => {
      state.isDeleteDialogOpen = action.payload;
    },
    setRewardToDelete: (state, action: PayloadAction<string | null>) => {
      state.rewardToDelete = action.payload;
    },
    openDeleteDialog: (state, action: PayloadAction<string>) => {
      state.isDeleteDialogOpen = true;
      state.rewardToDelete = action.payload;
    },
    closeDeleteDialog: (state) => {
      state.isDeleteDialogOpen = false;
      state.rewardToDelete = null;
    },
  }
});

export const {
  setActiveTab,
  setIsDialogOpen,
  setIsRedeemDialogOpen,
  setEditingRule,
  setNewRule,
  setNewReward,
  resetNewReward,
  updateSettings,
  updateEarningRule,
  addEarningRule,
  deleteEarningRule,
  resetNewRule,
  setIsDeleteDialogOpen,
  setRewardToDelete,
  openDeleteDialog,
  closeDeleteDialog,
} = pointsSlice.actions;

export default pointsSlice.reducer;