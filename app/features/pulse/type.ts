import { type LucideIcon, Star, Heart, Eye, DollarSign, Users } from 'lucide-react';

export type CreatorStatus = 'active' | 'pending' | 'rejected';

export interface Creator {
  _id: string;
  name: string;
  username: string;
  avatarUrl: string;
  bio: string;
  category: string;
  status: 'active' | 'pending' | 'rejected';
  joinDate: string;
  metrics: {
    views: number;
    engagements: number;
    earnings: number;
    followers: number;
  };
  liveMetrics?: {
    activeUsers: number;
    webSessions: number;
    mobileSessions: number;
    revenueToday: number;
    adRevenue: number;
    coinRevenue: number;
    commerceRevenue: number;
    subscriptionRevenue: number;
    installations: number;
    uninstalls: number;
    topContent: Array<{
      contentId: string;
      title: string;
      views: number;
      _id: string;
    }>;
    activeByCountry: Array<{
      country: string;
      count: number;
      _id: string;
    }>;
  };
  engagementMetrics?: {
    averageWatchTime: number;
    completionRate: number;
    commentRate: number;
    shareRate: number;
    likeRate: number;
    subscriberGrowth: number;
  };
  contentMetrics?: Array<{
    contentId: string;
    title: string;
    type: string;
    views: number;
    engagement: number;
    shares: number;
    watchTime: number;
    publishedAt: string;
    url: string;
    _id: string;
  }>;
  historicalMetrics?: Array<{
    date: string;
    views: number;
    engagements: number;
    revenue: number;
    newFollowers: number;
    activeUsers: number;
    _id: string;
  }>;
  application?: {
    submittedAt: string;
    phone: string;
    email: string;
    country: string;
    targetAudience: string;
    topics: string[];
    contentFormats: string[];
    desiredUsername?: string;
    website?: string;
    sampleVideos?: string[];
    experience: string;
    portfolio: string;
    socialLinks: {
      instagram?: string;
      tiktok?: string;
      youtube?: string;
    };
    reason: string;
  };
  revenueMetrics: Array<{
    label: string;
    thisMonth: number;
    thisYear: number;
    allTime: number;
    change: number;
  }>;
  revenueData: Array<{
    month: string;
    ads: number;
    bookings: number;
    deals: number;
  }>;
  audienceData: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  ageData: Array<{
    age: string;
    value: number;
  }>;
  genderData: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  isDemonetized: boolean;
  isShadowbanned: boolean;
  moderationHistory: Array<{
    action: string;
    duration: number;
    reason: string;
    date: string;
  }>;
  boostHistory: Array<{
    level: number;
    duration: number;
    startDate: string;
    endDate: string;
  }>;
  currentBoost?: {
    level: number;
    startDate: string;
    endDate: string;
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export const metricConfig = {
  followers: {
    icon: Users,
    label: 'Followers',
  },
  views: {
    icon: Eye,
    label: 'Views',
  },
  engagements: {
    icon: Heart,
    label: 'Engagements',
  },
  earnings: {
    icon: DollarSign,
    label: 'Earnings',
  },
};

export const mockCreators: Creator[] = [
  {
    _id: 'CR001',
    name: 'Sarah Johnson',
    username: 'sarahj',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&q=90',
    bio: 'Food and lifestyle content creator, sharing the best of Lebanese cuisine',
    category: 'Food & Dining',
    status: 'active',
    joinDate: '2024-01-15',
    metrics: {
      views: 1250000,
      engagements: 85000,
      earnings: 12500,
      followers: 125000,
    },
    revenueMetrics: [],
    revenueData: [],
    audienceData: [],
    ageData: [],
    genderData: [],
    isDemonetized: false,
    isShadowbanned: false,
    moderationHistory: [],
    boostHistory: [],
    createdAt: '2024-01-15T00:00:00.000Z',
    updatedAt: '2024-01-15T00:00:00.000Z',
    __v: 0
  },
  {
    _id: 'CR002',
    name: 'Michael Chen',
    username: 'mikechen',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&h=96&q=90',
    bio: 'Tech enthusiast and gadget reviewer',
    category: 'Technology',
    status: 'active',
    joinDate: '2024-02-01',
    metrics: {
      views: 980000,
      engagements: 62000,
      earnings: 9800,
      followers: 98000,
    },
    revenueMetrics: [],
    revenueData: [],
    audienceData: [],
    ageData: [],
    genderData: [],
    isDemonetized: false,
    isShadowbanned: false,
    moderationHistory: [],
    boostHistory: [],
    createdAt: '2024-02-01T00:00:00.000Z',
    updatedAt: '2024-02-01T00:00:00.000Z',
    __v: 0
  },
  {
    _id: 'APP001',
    name: 'Emma Davis',
    username: 'emmad',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&q=90',
    bio: 'Fashion and beauty content creator',
    category: 'Fashion',
    status: 'pending',
    joinDate: '2024-03-15',
    metrics: {
      views: 50000,
      engagements: 3500,
      earnings: 0,
      followers: 15000,
    },
    revenueMetrics: [],
    revenueData: [],
    audienceData: [],
    ageData: [],
    genderData: [],
    isDemonetized: false,
    isShadowbanned: false,
    moderationHistory: [],
    boostHistory: [],
    application: {
      socialLinks: {
        instagram: '@emmad.style',
        tiktok: '@emmad.fashion',
        youtube: 'https://youtube.com/emmad'
      },
      submittedAt: '2024-03-15T10:30:00Z',
      phone: '+1 (555) 123-4567',
      email: 'emma@example.com',
      country: 'Lebanon',
      targetAudience: 'Lebanon and Diaspora',
      topics: ['Fashion', 'Beauty', 'Lifestyle'],
      contentFormats: ['video', 'image', 'article'],
      experience: '3 years of content creation on Instagram and TikTok',
      portfolio: 'https://portfolio.emmadavis.com',
      reason: 'I want to share my passion for fashion and help others discover their personal style.',
      sampleVideos: []
    },
    createdAt: '2024-03-15T00:00:00.000Z',
    updatedAt: '2024-03-15T00:00:00.000Z',
    __v: 0
  },
  {
    _id: 'APP002',
    name: 'Chris',
    username: 'emmadssss',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&q=90',
    bio: 'Fashion and beauty content creator',
    category: 'Fashion',
    status: 'pending',
    joinDate: '2024-03-15',
    metrics: {
      views: 50000,
      engagements: 3500,
      earnings: 0,
      followers: 15000,
    },
    revenueMetrics: [],
    revenueData: [],
    audienceData: [],
    ageData: [],
    genderData: [],
    isDemonetized: false,
    isShadowbanned: false,
    moderationHistory: [],
    boostHistory: [],
    application: {
      socialLinks: {
        instagram: '@emmad.style',
        tiktok: '@emmad.fashion',
        youtube: 'https://youtube.com/emmad'
      },
      submittedAt: '2024-03-15T10:30:00Z',
      phone: '+1 (555) 123-4567',
      email: 'emma@example.com',
      country: 'Lebanon',
      targetAudience: 'Lebanon and Diaspora',
      topics: ['Fashion', 'Beauty', 'Lifestyle'],
      contentFormats: ['video', 'image', 'article'],
      experience: '3 years of content creation on Instagram and TikTok',
      portfolio: 'https://portfolio.emmadavis.com',
      reason: 'I want to share my passion for fashion and help others discover their personal style.',
      sampleVideos: []
    },
    createdAt: '2024-03-15T00:00:00.000Z',
    updatedAt: '2024-03-15T00:00:00.000Z',
    __v: 0
  },
];


export interface ApplicationsState {
  applications: Creator[];
  search: string;
}

export const initialState: ApplicationsState = {
  applications: [],
  search: '',
};


export type ContentType = 'video' | 'article' | 'photo';
export type ReachLevel = 'low' | 'medium' | 'high' | 'viral';
export type ContentStatus = 'published' | 'flagged' | 'under_review';

export interface Content {
  id: string;
  title: string;
  type: ContentType;
  views: number;
  engagement: number;
  shares: number;
  revenue: number;
  reach: ReachLevel;
  reachScore: number;
  publishedAt: string;
  creator: {
    id: string;
    name: string;
    avatar: string;
  };
  status: ContentStatus;
  isDemonetized?: boolean;
  isShadowbanned?: boolean;
  flags?: {
    reason: string;
    count: number;
  };
  currentBoost?: {
    level: number;
    duration: number;
    startDate: string;
    endDate: string;
  };
  boostHistory?: Array<{
    level: number;
    duration: number;
    startDate: string;
    endDate: string;
    _id: string;
  }>;
}

export interface ContentState {
  content: Content[];
  search: string;
  selectedType: ContentType | 'all';
  selectedReach: ReachLevel | 'all';
  reachSliders: Record<string, number>;
  loading: boolean;
  error: string | null;
}

export interface CreatorApplicationsState {
  applications: Creator[];
  search: string;
  expandedId: string | null;
  approvalDialog: Creator | null;
}

export interface ContentItem {
  id: string;
  title: string;
  thumbnail: string;
  views: number;
  engagement: number;
  shares: number;
  adRevenue: number;
  commerceRevenue: number;
  publishedAt: string;
  isShadowbanned?: boolean;
  isDemonetized?: boolean;
}

export type SortField = 'views' | 'engagement' | 'shares' | 'adRevenue' | 'commerceRevenue';

export interface CreatorContentState {
  content: ContentItem[];
  search: string;
  sortField: SortField;
  sortDirection: 'asc' | 'desc';
  loading: boolean;
  error: string | null;
}

export interface RevenueMetric {
  label: string;
  thisMonth: number;
  thisYear: number;
  allTime: number;
  change: number;
}

export interface RevenueData {
  month: string;
  ads: number;
  bookings: number;
  deals: number;
}

export interface AudienceData {
  name: string;
  value: number;
  color: string;
}

export interface AgeData {
  age: string;
  value: number;
}

export interface GenderData {
  name: string;
  value: number;
  color: string;
}

export interface CreatorProfileState {
  selectedCreator: Creator | null;
  revenueMetrics: Array<{
    label: string;
    thisMonth: number;
    thisYear: number;
    allTime: number;
    change: number;
  }>;
  revenueData: Array<{
    month: string;
    ads: number;
    bookings: number;
    deals: number;
  }>;
  audienceData: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  ageData: Array<{
    age: string;
    value: number;
  }>;
  genderData: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  isModerateOpen: boolean;
  isBoostOpen: boolean;
  moderationAction: string;
  moderationDuration: number;
  moderationReason: string;
  boostLevel: number;
  boostDuration: number;
}

export interface CreatorsState {
  creators: Creator[];
  search: string;
}

export interface CommentSettings {
  freeCommentsLimit: number;
  additionalCommentPrice: number;
  investorCommentAllowance: number;
  restrictionsEnabled: boolean;
}

export interface Reaction {
  _id: string;
  emoji: string;
  name: string;
  isPaid: boolean;
  price: number;
  enabled: boolean;
  isDefault?: boolean;
}

export interface Gift {
  _id: string;
  name: string;
  description: string;
  price: number;
  image?: File;
  imagePreview?: string;
  enabled: boolean;
  isLimited?: boolean;
  endDate?: string;
}

export interface EngagementSettingsState {
  commentSettings: CommentSettings;
  reactions: Reaction[];
  gifts: Gift[];
  isDirty: boolean;
  isAddReactionOpen: boolean;
  newReaction: {
    emoji: string;
    name: string;
    price: number;
  };
  isGiftDialogOpen: boolean;
  editingGift: Gift | null;
  newGift: Partial<Gift>;
}