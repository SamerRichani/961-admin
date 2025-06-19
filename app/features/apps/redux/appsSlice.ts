import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { type App, initialAppState } from "@/app/features/apps/types";

export const appsSlice = createSlice({
  name: "apps",
  initialState: initialAppState,
  reducers: {
    setApps: (state, action: PayloadAction<App[]>) => {
      state.apps = action.payload;
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
    setViewMode: (state, action: PayloadAction<"mobile" | "web">) => {
      state.viewMode = action.payload;
    },
    setActiveTab: (state, action: PayloadAction<"apps" | "reorder">) => {
      state.activeTab = action.payload;
    },
    setReorderTab: (state, action: PayloadAction<"home" | "app">) => {
      state.reorderTab = action.payload;
    },
    setEditingApp: (state, action: PayloadAction<App | null>) => {
      state.editingApp = action.payload;
    },
    setIsDialogOpen: (state, action: PayloadAction<boolean>) => {
      state.isDialogOpen = action.payload;
    },
    updateApp: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<App> }>
    ) => {
      const { id, updates } = action.payload;
      const appIndex = state.apps.findIndex((app) => app.id === id);
      if (appIndex !== -1) {
        state.apps[appIndex] = { ...state.apps[appIndex], ...updates };
      }
    },
    addApp: (state, action: PayloadAction<Partial<App>>) => {
      const newApp: App = {
        id: Date.now().toString(),
        name: action.payload.name!,
        description: action.payload.description!,
        icon: action.payload.icon!,
        enabled: true,
        comingSoon: false,
        showInMore: false,
        order: state.apps.length,
        link: action.payload.link,
      };
      state.apps.push(newApp);
    },
    toggleAppSetting: (
      state,
      action: PayloadAction<{ id: string; setting: keyof App }>
    ) => {
      const { id, setting } = action.payload;
      const appIndex = state.apps.findIndex((app) => app.id === id);
      if (appIndex !== -1) {
        state.apps[appIndex] = {
          ...state.apps[appIndex],
          [setting]: !state.apps[appIndex][setting],
        };
      }
    },
    reorderApps: (
      state,
      action: PayloadAction<{ sourceId: string; targetId: string }>
    ) => {
      const { sourceId, targetId } = action.payload;
      const sourceIndex = state.apps.findIndex((app) => app.id === sourceId);
      const targetIndex = state.apps.findIndex((app) => app.id === targetId);

      if (sourceIndex !== -1 && targetIndex !== -1) {
        const [movedApp] = state.apps.splice(sourceIndex, 1);
        state.apps.splice(targetIndex, 0, movedApp);

        // Update order property for all apps
        state.apps.forEach((app, index) => {
          app.order = index;
        });
      }
    },
  },
});

export const {
  setApps,
  setSearch,
  setViewMode,
  setActiveTab,
  setReorderTab,
  setEditingApp,
  setIsDialogOpen,
  updateApp,
  addApp,
  toggleAppSetting,
  reorderApps,
} = appsSlice.actions;

export default appsSlice.reducer;
