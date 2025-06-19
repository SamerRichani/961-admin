import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Update, UpdatesState, Comment } from '../types';

const initialState: UpdatesState = {
  updates: [],
  newUpdate: '',
  selectedImageUrl: null,
};

export const updatesSlice = createSlice({
  name: 'updates',
  initialState,
  reducers: {
    setUpdates: (state, action: PayloadAction<Update[]>) => {
      state.updates = action.payload;
    },
    addUpdate: (state, action: PayloadAction<Update>) => {
      state.updates.unshift(action.payload);
    },
    removeUpdate: (state, action: PayloadAction<string>) => {
      state.updates = state.updates.filter(update => update.id !== action.payload);
    },
    setNewUpdate: (state, action: PayloadAction<string>) => {
      state.newUpdate = action.payload;
    },
    setSelectedImageUrl: (state, action: PayloadAction<string | null>) => {
      state.selectedImageUrl = action.payload;
    },
    addLike: (state, action: PayloadAction<string>) => {
      const update = state.updates.find(u => u.id === action.payload);
      if (update) {
        update.likes += 1;
      }
    },
    addComment: (state, action: PayloadAction<{ updateId: string; comment: Comment }>) => {
      const update = state.updates.find(u => u.id === action.payload.updateId);
      if (update) {
        update.comments.push(action.payload.comment);
      }
    },
    deleteComment: (state, action: PayloadAction<{ updateId: string; commentId: string }>) => {
      const update = state.updates.find(u => u.id === action.payload.updateId);
      if (update) {
        update.comments = update.comments.filter(comment => comment.id !== action.payload.commentId);
      }
    },
    resetNewUpdate: (state) => {
      state.newUpdate = '';
      state.selectedImageUrl = null;
    },
  },
});

export const {
  setUpdates,
  addUpdate,
  removeUpdate,
  setNewUpdate,
  setSelectedImageUrl,
  addLike,
  addComment,
  deleteComment,
  resetNewUpdate,
} = updatesSlice.actions;

export default updatesSlice.reducer; 