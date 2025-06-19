import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CreatorsState, type Creator } from '@/app/features/pulse/type';

const initialState: CreatorsState = {
  creators: [],
  search: '',
};

const creatorsSlice = createSlice({
  name: 'creators',
  initialState,
  reducers: {
    setCreators: (state, action: PayloadAction<Creator[]>) => {
      state.creators = action.payload;
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
  },
});

export const {
  setCreators,
  setSearch,
} = creatorsSlice.actions;

export default creatorsSlice.reducer; 