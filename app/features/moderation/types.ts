import { type LucideIcon, Flag, MessageSquare, User, Bot, AlertTriangle, ShieldAlert } from 'lucide-react';

export type ReportReason = 
  | 'spam'
  | 'harassment'
  | 'hate_speech'
  | 'inappropriate'
  | 'violence'
  | 'copyright'
  | 'misinformation'
  | 'other';

export type ContentType = 'post' | 'comment' | 'user' | 'message';
export type ModStatus = 'pending' | 'approved' | 'rejected' | 'needs_review';
export type AIDecision = 'flagged' | 'clean' | 'needs_review';

export interface Report {
  id: string;
  contentType: ContentType;
  contentId: string;
  contentPreview: string;
  reason: ReportReason;
  details?: string;
  moderationNote?: string;
  reporters: Array<{
    id: string;
    name: string;
    reportedAt: string;
  }>;
  reportedAt: string;
  status: ModStatus;
  aiModerated?: {
    decision: AIDecision;
    confidence: number;
    detectedKeywords?: string[];
    timestamp: string;
  };
}

export interface BlockedKeyword {
  id: string;
  pattern: string;
  category: string;
  severity: 'low' | 'medium' | 'high';
  action: 'flag' | 'block' | 'review';
  createdBy: string;
  createdAt: string;
  active: boolean;
}



export const statusColors: Record<ModStatus, { bg: string; text: string }> = {
  pending: { bg: 'bg-yellow-50', text: 'text-yellow-700' },
  approved: { bg: 'bg-green-50', text: 'text-green-700' },
  rejected: { bg: 'bg-red-50', text: 'text-red-700' },
  needs_review: { bg: 'bg-blue-50', text: 'text-blue-700' },
};



export type SortOption = 'newest' | 'oldest' | 'most_reports' | 'least_reports';
export type FilterOption = 'all' | 'ai_flagged' | 'user_reported';

export interface KeywordDialogState {
  pattern: string;
  category: string;
  severity: 'low' | 'medium' | 'high';
  action: 'flag' | 'block' | 'review';
}

export interface ModerationState {
  reports: Report[];
  keywords: BlockedKeyword[];
  selectedReport: Report | null;
  search: string;
  activeTab: 'reports' | 'keywords';
  sortBy: SortOption;
  filterBy: FilterOption;
  keywordDialog: {
    isOpen: boolean;
    editingKeyword: BlockedKeyword | null;
    form: KeywordDialogState;
  };
}