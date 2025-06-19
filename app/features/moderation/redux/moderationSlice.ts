import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { type Report, type BlockedKeyword, ModerationState, SortOption, FilterOption, KeywordDialogState, ReportReason } from '@/app/features/moderation/types';
import { LucideIcon, ShieldAlert, MessageSquare, Flag, AlertTriangle } from 'lucide-react';

export const reasonConfig: Record<ReportReason, {
  label: string;
  description: string;
  icon: LucideIcon;
  color: {
    bg: string;
    text: string;
  };
}> = {
  spam: {
    label: 'Spam',
    description: 'Unsolicited or repetitive content',
    icon: MessageSquare,
    color: { bg: 'bg-orange-50', text: 'text-orange-700' },
  },
  harassment: {
    label: 'Harassment',
    description: 'Targeted abuse or bullying',
    icon: ShieldAlert,
    color: { bg: 'bg-red-50', text: 'text-red-700' },
  },
  hate_speech: {
    label: 'Hate Speech',
    description: 'Discriminatory or hateful content',
    icon: AlertTriangle,
    color: { bg: 'bg-red-50', text: 'text-red-700' },
  },
  inappropriate: {
    label: 'Inappropriate',
    description: 'Content violating community standards',
    icon: Flag,
    color: { bg: 'bg-yellow-50', text: 'text-yellow-700' },
  },
  violence: {
    label: 'Violence',
    description: 'Violent or graphic content',
    icon: AlertTriangle,
    color: { bg: 'bg-red-50', text: 'text-red-700' },
  },
  copyright: {
    label: 'Copyright',
    description: 'Copyright infringement',
    icon: Flag,
    color: { bg: 'bg-blue-50', text: 'text-blue-700' },
  },
  misinformation: {
    label: 'Misinformation',
    description: 'False or misleading information',
    icon: AlertTriangle,
    color: { bg: 'bg-purple-50', text: 'text-purple-700' },
  },
  other: {
    label: 'Other',
    description: 'Other violation',
    icon: Flag,
    color: { bg: 'bg-gray-50', text: 'text-gray-700' },
  },
};

export const mockReports: Report[] = [
  {
    id: 'REP001',
    contentType: 'post',
    contentId: 'POST123',
    contentPreview: 'This is a potentially inappropriate post content...',
    reason: 'inappropriate',
    details: 'Contains offensive language',
    reporters: [{
      id: 'USR789',
      name: 'Sarah Johnson',
      reportedAt: '2024-03-20T10:30:00Z',
    },
    {
      id: 'USR790',
      name: 'Mike Wilson',
      reportedAt: '2024-03-20T10:35:00Z',
    },
    {
      id: 'USR791',
      name: 'Emma Davis',
      reportedAt: '2024-03-20T10:40:00Z',
    }],
    reportedAt: '2024-03-20T10:30:00Z',
    status: 'pending',
    aiModerated: {
      decision: 'flagged',
      confidence: 0.89,
      detectedKeywords: ['offensive_term_1', 'offensive_term_2'],
      timestamp: '2024-03-20T10:31:00Z',
    },
  },
  {
    id: 'REP002',
    contentType: 'comment',
    contentId: 'CMT456',
    contentPreview: 'This comment contains potential hate speech...',
    reason: 'hate_speech',
    reporters: [{
      id: 'USR456',
      name: 'Mike Wilson',
      reportedAt: '2024-03-20T09:15:00Z',
    }],
    reportedAt: '2024-03-20T09:15:00Z',
    status: 'needs_review',
    aiModerated: {
      decision: 'needs_review',
      confidence: 0.65,
      timestamp: '2024-03-20T09:16:00Z',
    },
  },
];

export const mockBlockedKeywords: BlockedKeyword[] = [
  {
    id: 'KW001',
    pattern: 'offensive_term_1',
    category: 'Hate Speech',
    severity: 'high',
    action: 'block',
    createdBy: 'USR005',
    createdAt: '2024-03-15T08:00:00Z',
    active: true,
  },
  {
    id: 'KW002',
    pattern: 'offensive_term_2',
    category: 'Harassment',
    severity: 'medium',
    action: 'review',
    createdBy: 'USR005',
    createdAt: '2024-03-16T10:30:00Z',
    active: true,
  },
];

const initialState: ModerationState = {
  reports: [],
  keywords: [],
  selectedReport: null,
  search: '',
  activeTab: 'reports',
  sortBy: 'most_reports',
  filterBy: 'all',
  keywordDialog: {
    isOpen: false,
    editingKeyword: null,
    form: {
      pattern: '',
      category: '',
      severity: 'medium',
      action: 'flag',
    },
  },
};

const moderationSlice = createSlice({
  name: 'moderation',
  initialState,
  reducers: {
    setReports: (state, action: PayloadAction<Report[]>) => {
      state.reports = action.payload;
    },
    setKeywords: (state, action: PayloadAction<BlockedKeyword[]>) => {
      state.keywords = action.payload;
    },
    setSelectedReport: (state, action: PayloadAction<Report | null>) => {
      state.selectedReport = action.payload;
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
    setActiveTab: (state, action: PayloadAction<'reports' | 'keywords'>) => {
      state.activeTab = action.payload;
    },
    setSortBy: (state, action: PayloadAction<SortOption>) => {
      state.sortBy = action.payload;
    },
    setFilterBy: (state, action: PayloadAction<FilterOption>) => {
      state.filterBy = action.payload;
    },
    addKeyword: (state, action: PayloadAction<BlockedKeyword>) => {
      state.keywords.push(action.payload);
    },
    updateKeyword: (state, action: PayloadAction<{ id: string; updates: Partial<BlockedKeyword> }>) => {
      const { id, updates } = action.payload;
      const keyword = state.keywords.find(k => k.id === id);
      if (keyword) {
        Object.assign(keyword, updates);
      }
    },
    toggleKeyword: (state, action: PayloadAction<{ id: string; active: boolean }>) => {
      const { id, active } = action.payload;
      const keyword = state.keywords.find(k => k.id === id);
      if (keyword) {
        keyword.active = active;
      }
    },
    deleteKeyword: (state, action: PayloadAction<string>) => {
      state.keywords = state.keywords.filter(k => k.id !== action.payload);
    },
    handleReportAction: (state, action: PayloadAction<{ reportId: string; action: 'approve' | 'reject'; note?: string }>) => {
      const { reportId, action: reportAction, note } = action.payload;
      const report = state.reports.find(r => r.id === reportId);
      if (report) {
        report.status = reportAction === 'approve' ? 'approved' : 'rejected';
        if (note) {
          report.moderationNote = note;
        }
      }
      state.selectedReport = null;
    },
    // Keyword Dialog Actions
    openKeywordDialog: (state, action: PayloadAction<BlockedKeyword | null>) => {
      state.keywordDialog.isOpen = true;
      state.keywordDialog.editingKeyword = action.payload;
      if (action.payload) {
        state.keywordDialog.form = {
          pattern: action.payload.pattern,
          category: action.payload.category,
          severity: action.payload.severity,
          action: action.payload.action,
        };
      } else {
        state.keywordDialog.form = {
          pattern: '',
          category: '',
          severity: 'medium',
          action: 'flag',
        };
      }
    },
    closeKeywordDialog: (state) => {
      state.keywordDialog.isOpen = false;
      state.keywordDialog.editingKeyword = null;
      state.keywordDialog.form = {
        pattern: '',
        category: '',
        severity: 'medium',
        action: 'flag',
      };
    },
    updateKeywordForm: (state, action: PayloadAction<Partial<KeywordDialogState>>) => {
      state.keywordDialog.form = {
        ...state.keywordDialog.form,
        ...action.payload,
      };
    },
  },
});

export const {
  setReports,
  setKeywords,
  setSelectedReport,
  setSearch,
  setActiveTab,
  setSortBy,
  setFilterBy,
  addKeyword,
  updateKeyword,
  toggleKeyword,
  deleteKeyword,
  handleReportAction,
  openKeywordDialog,
  closeKeywordDialog,
  updateKeywordForm,
} = moderationSlice.actions;

export default moderationSlice.reducer; 