import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  SupportState,
  type Ticket,
  type TopicCategory,
  type Template,
} from "@/app/features/support/type";

const initialState: SupportState = {
  selectedTicket: null,
  searchQuery: "",
  ticketType: "all",
  selectedTopics: [],
  showPending: false,
  templates: [],
  newMessage: "",
  newNote: "",
  activeTab: "templates",
  isTemplateDialogOpen: false,
  editingTemplate: null,
};

const supportSlice = createSlice({
  name: "support",
  initialState,
  reducers: {
    setSelectedTicket: (state, action: PayloadAction<Ticket | null>) => {
      state.selectedTicket = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setTicketType: (
      state,
      action: PayloadAction<"all" | "chat" | "ticket">
    ) => {
      state.ticketType = action.payload;
    },
    setSelectedTopics: (state, action: PayloadAction<TopicCategory[]>) => {
      state.selectedTopics = action.payload;
    },
    setShowPending: (state, action: PayloadAction<boolean>) => {
      state.showPending = action.payload;
    },
    setTemplates: (state, action: PayloadAction<Template[]>) => {
      state.templates = action.payload;
    },
    setNewMessage: (state, action: PayloadAction<string>) => {
      state.newMessage = action.payload;
    },
    setNewNote: (state, action: PayloadAction<string>) => {
      state.newNote = action.payload;
    },
    setActiveTab: (state, action: PayloadAction<"notes" | "templates">) => {
      state.activeTab = action.payload;
    },
    setTemplateDialogOpen: (state, action: PayloadAction<boolean>) => {
      state.isTemplateDialogOpen = action.payload;
    },
    setEditingTemplate: (state, action: PayloadAction<Template | null>) => {
      state.editingTemplate = action.payload;
    },
    updateTicket: (
      state,
      action: PayloadAction<{ ticketId: string; updates: Partial<Ticket> }>
    ) => {
      if (state.selectedTicket?.id === action.payload.ticketId) {
        state.selectedTicket = {
          ...state.selectedTicket,
          ...action.payload.updates,
        };
      }
    },
    addTemplate: (
      state,
      action: PayloadAction<{ title: string; message: string }>
    ) => {
      state.templates.push({
        id: Math.random().toString(36).substr(2, 9),
        editable: true,
        ...action.payload,
      });
    },
    updateTemplate: (
      state,
      action: PayloadAction<{ id: string; title: string; message: string }>
    ) => {
      const template = state.templates.find((t) => t.id === action.payload.id);
      if (template) {
        template.title = action.payload.title;
        template.message = action.payload.message;
      }
    },
    deleteTemplate: (state, action: PayloadAction<string>) => {
      state.templates = state.templates.filter((t) => t.id !== action.payload);
    },
  },
});

export const {
  setSelectedTicket,
  setSearchQuery,
  setTicketType,
  setSelectedTopics,
  setShowPending,
  setTemplates,
  setNewMessage,
  setNewNote,
  setActiveTab,
  setTemplateDialogOpen,
  setEditingTemplate,
  updateTicket,
  addTemplate,
  updateTemplate,
  deleteTemplate,
} = supportSlice.actions;

export default supportSlice.reducer;
