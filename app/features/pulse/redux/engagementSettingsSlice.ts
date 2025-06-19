import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CommentSettings, Reaction, Gift, EngagementSettingsState } from '../type';

const initialState: EngagementSettingsState = {
  commentSettings: {
    freeCommentsLimit: 0,
    additionalCommentPrice: 0,
    investorCommentAllowance: 0,
    restrictionsEnabled: false,
  },
  reactions: [],
  gifts: [],
  isDirty: false,
  isAddReactionOpen: false,
  newReaction: { emoji: '', name: '', price: 5 },
  isGiftDialogOpen: false,
  editingGift: null,
  newGift: {
    name: '',
    description: '',
    price: 100,
    image: undefined,
    imagePreview: '',
    enabled: true,
    isLimited: false,
  },
};

const engagementSettingsSlice = createSlice({
  name: 'engagementSettings',
  initialState,
  reducers: {
    setCommentSettings: (state, action: PayloadAction<Partial<CommentSettings>>) => {
      state.commentSettings = { ...state.commentSettings, ...action.payload };
      state.isDirty = true;
    },
    setReactions: (state, action: PayloadAction<Reaction[]>) => {
      state.reactions = action.payload;
      state.isDirty = true;
    },
    setGifts: (state, action: PayloadAction<Gift[]>) => {
      state.gifts = action.payload;
      state.isDirty = true;
    },
    setIsDirty: (state, action: PayloadAction<boolean>) => {
      state.isDirty = action.payload;
    },
    setIsAddReactionOpen: (state, action: PayloadAction<boolean>) => {
      state.isAddReactionOpen = action.payload;
    },
    setNewReaction: (state, action: PayloadAction<Partial<typeof initialState.newReaction>>) => {
      state.newReaction = { ...state.newReaction, ...action.payload };
    },
    setIsGiftDialogOpen: (state, action: PayloadAction<boolean>) => {
      state.isGiftDialogOpen = action.payload;
    },
    setEditingGift: (state, action: PayloadAction<Gift | null>) => {
      state.editingGift = action.payload;
    },
    setNewGift: (state, action: PayloadAction<Partial<Gift>>) => {
      state.newGift = { ...state.newGift, ...action.payload };
    },
    resetNewGift: (state) => {
      state.newGift = initialState.newGift;
    },
    saveSettings: (state) => {
      // TODO: Implement API call to save settings
      state.isDirty = false;
    },
  },
});

export const {
  setCommentSettings,
  setReactions,
  setGifts,
  setIsDirty,
  setIsAddReactionOpen,
  setNewReaction,
  setIsGiftDialogOpen,
  setEditingGift,
  setNewGift,
  resetNewGift,
  saveSettings,
} = engagementSettingsSlice.actions;

export default engagementSettingsSlice.reducer; 