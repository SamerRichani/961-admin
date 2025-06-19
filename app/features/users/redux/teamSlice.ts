import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { type TeamMember } from "@/app/features/users/types";

const initialState = {
  teamMembers: [] as TeamMember[],
  search: "",
  removingMember: null as TeamMember | null,
  isLoading: false,
  error: null as string | null,
};

const teamSlice = createSlice({
  name: "team",
  initialState,
  reducers: {
    setTeamMembers: (state, action: PayloadAction<TeamMember[]>) => {
      state.teamMembers = action.payload;
    },
    addTeamMember: (state, action: PayloadAction<TeamMember>) => {
      state.teamMembers.push(action.payload);
    },
    removeTeamMember: (state, action: PayloadAction<string>) => {
      state.teamMembers = state.teamMembers.filter(
        (member) => member._id !== action.payload
      );
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
    setRemovingMember: (state, action: PayloadAction<TeamMember | null>) => {
      state.removingMember = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setTeamMembers,
  addTeamMember,
  removeTeamMember,
  setSearch,
  setRemovingMember,
  setLoading,
  setError,
} = teamSlice.actions;

export default teamSlice.reducer;
