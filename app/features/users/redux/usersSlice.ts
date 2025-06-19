import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  UsersState,
  type User,
  type UserRole,
} from "@/app/features/users/types";

const initialState: UsersState = {
  users: [],
  filteredUsers: [],
  selectedUser: null,
  isDialogOpen: false,
  moderatingUser: null,
  isModerationOpen: false,
  search: "",
  page: 1,
  totalPages: 1,
  activeTab: "users",
  teamSearch: "",
  isLoading: false,
  error: null,
  // Form state
  formFullName: "",
  formUsername: "",
  formRole: "user" as UserRole,
  formAvatarUrl: undefined,
  formGender: "male",
  formBirthdate: "",
  // Moderation form state
  moderationActionType: "warn",
  moderationDuration: 1,
  moderationReason: "",
  moderationNotification: "",
  moderationHideExisting: false,
  moderationPreventNew: false,
  moderationShowBanConfirm: false,
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
      state.filteredUsers = action.payload;
    },
    setFilteredUsers: (state, action: PayloadAction<User[]>) => {
      state.filteredUsers = action.payload;
    },
    setSelectedUser: (state, action: PayloadAction<User | null>) => {
      state.selectedUser = action.payload;
    },
    setIsDialogOpen: (state, action: PayloadAction<boolean>) => {
      state.isDialogOpen = action.payload;
    },
    setModeratingUser: (state, action: PayloadAction<User | null>) => {
      state.moderatingUser = action.payload;
    },
    setIsModerationOpen: (state, action: PayloadAction<boolean>) => {
      state.isModerationOpen = action.payload;
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setTotalPages: (state, action: PayloadAction<number>) => {
      state.totalPages = action.payload;
    },
    setActiveTab: (state, action: PayloadAction<"users" | "team">) => {
      state.activeTab = action.payload;
    },
    setTeamSearch: (state, action: PayloadAction<string>) => {
      state.teamSearch = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    // Form actions
    setFormFullName: (state, action: PayloadAction<string>) => {
      state.formFullName = action.payload;
    },
    setFormUsername: (state, action: PayloadAction<string>) => {
      state.formUsername = action.payload;
    },
    setFormRole: (state, action: PayloadAction<UserRole>) => {
      state.formRole = action.payload;
    },
    setFormAvatarUrl: (state, action: PayloadAction<string | undefined>) => {
      state.formAvatarUrl = action.payload;
    },
    setFormGender: (
      state,
      action: PayloadAction<"male" | "female" | "other">
    ) => {
      state.formGender = action.payload;
    },
    setFormBirthdate: (state, action: PayloadAction<string>) => {
      state.formBirthdate = action.payload;
    },
    // Moderation form actions
    setModerationActionType: (
      state,
      action: PayloadAction<"suspend" | "ban" | "warn">
    ) => {
      state.moderationActionType = action.payload;
    },
    setModerationDuration: (state, action: PayloadAction<number>) => {
      state.moderationDuration = action.payload;
    },
    setModerationReason: (state, action: PayloadAction<string>) => {
      state.moderationReason = action.payload;
    },
    setModerationNotification: (state, action: PayloadAction<string>) => {
      state.moderationNotification = action.payload;
    },
    setModerationHideExisting: (state, action: PayloadAction<boolean>) => {
      state.moderationHideExisting = action.payload;
    },
    setModerationPreventNew: (state, action: PayloadAction<boolean>) => {
      state.moderationPreventNew = action.payload;
    },
    setModerationShowBanConfirm: (state, action: PayloadAction<boolean>) => {
      state.moderationShowBanConfirm = action.payload;
    },
    // Reset actions
    resetForm: (state) => {
      state.formFullName = "";
      state.formUsername = "";
      state.formRole = "user" as UserRole;
      state.formAvatarUrl = undefined;
      state.formGender = "male";
      state.formBirthdate = "";
    },
    resetModerationForm: (state) => {
      state.moderationActionType = "warn";
      state.moderationDuration = 1;
      state.moderationReason = "";
      state.moderationNotification = "";
      state.moderationHideExisting = false;
      state.moderationPreventNew = false;
      state.moderationShowBanConfirm = false;
    },
    initializeForm: (state, action: PayloadAction<User>) => {
      state.formFullName = action.payload.fullName;
      state.formUsername = action.payload.username;
      state.formRole = action.payload.role;
      state.formAvatarUrl = action.payload.avatarUrl;
      state.formGender = action.payload.gender || "male";
      state.formBirthdate = action.payload.birthdate || "";
    },
  },
});

export const {
  setUsers,
  setFilteredUsers,
  setSelectedUser,
  setIsDialogOpen,
  setModeratingUser,
  setIsModerationOpen,
  setSearch,
  setPage,
  setTotalPages,
  setActiveTab,
  setTeamSearch,
  setLoading,
  setError,
  setFormFullName,
  setFormUsername,
  setFormRole,
  setFormAvatarUrl,
  setFormGender,
  setFormBirthdate,
  setModerationActionType,
  setModerationDuration,
  setModerationReason,
  setModerationNotification,
  setModerationHideExisting,
  setModerationPreventNew,
  setModerationShowBanConfirm,
  resetForm,
  resetModerationForm,
  initializeForm,
} = usersSlice.actions;

export default usersSlice.reducer;
