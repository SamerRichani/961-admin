import { Wallet } from 'lucide-react';

export interface App {
  id: string;
  name: string;
  description: string;
  icon: typeof Wallet;
  enabled: boolean;
  comingSoon: boolean;
  showInMore: boolean;
  order: number;
  link?: string;
}

export interface AppsState {
  apps: App[];
  search: string;
  viewMode: 'mobile' | 'web';
  activeTab: 'apps' | 'reorder';
  reorderTab: 'home' | 'app';
  editingApp: App | null;
  isDialogOpen: boolean;
}

export const initialAppState: AppsState = {
  apps: [],
  search: '',
  viewMode: 'mobile',
  activeTab: 'apps',
  reorderTab: 'app',
  editingApp: null,
  isDialogOpen: false,
};

export interface HealthCenter {
  _id: string;
  name: string;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  createdAt: string;
  __v: number;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  idVerified: boolean;
  role: string;
  isSuspended: boolean;
  suspensionReason?: string;
  suspendedAt?: string;
}

export interface SuspendedUser {
  _id: string;
  id: string;
  userId: string;
  type: string;
  reason: string;
  isActive: boolean;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
  suspendedAt: string;
  __v: number;
  user: User;
}

export interface BloodState {
  activeTab: 'centers' | 'suspended';
  isAddCenterOpen: boolean;
  isAddSuspendedOpen: boolean;
  newUsername: string;
  suspensionReason: string;
  healthCenters: HealthCenter[];
  suspendedUsers: SuspendedUser[];
  search: string;
}

export const initialBloodState: BloodState = {
  activeTab: 'centers',
  isAddCenterOpen: false,
  isAddSuspendedOpen: false,
  newUsername: '',
  suspensionReason: '',
  healthCenters: [],
  suspendedUsers: [],
  search: '',
};

export interface CoinPackage {
  _id: string;
  name: string;
  description: string;
  coins: number;
  price: number;
  isPopular?: boolean;
  isBestValue?: boolean;
}

export interface CustomAmount {
  minAmount: number;
  maxAmount: number;
  pricePerCoin: number;
}

export interface CoinsState {
  packages: CoinPackage[];
  customAmount: CustomAmount;
  isDialogOpen: boolean;
  editingPackage: CoinPackage | null;
  newPackage: Partial<CoinPackage>;
}

export interface EarningRule {
  id: string;
  action: string;
  points: number;
  category: 'deals' | 'merch' | 'blood' | 'other';
  enabled: boolean;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  points: number;
  validityDays?: number;
  enabled: boolean;
  isLimited?: boolean;
  endDate?: string;
}

export interface PointsSettings {
  // Earn Settings
  conversionRate: number;
  earningRules: EarningRule[];
  
  // Expiration Rules
  expirationEnabled: boolean;
  expirationPeriod: number;
  expirationNotificationDays: number;
  
  // Redemption Settings
  rewards: Reward[];
}

export interface PointsState extends PointsSettings {
  isDialogOpen: boolean;
  isRedeemDialogOpen: boolean;
  editingRule: EarningRule | null;
  newRule: Partial<EarningRule>;
  newReward: Partial<Reward>;
  activeTab: 'earn' | 'expire' | 'redeem';
  isDeleteDialogOpen: boolean;
  rewardToDelete: string | null;
}

export interface CoinData {
  customAmount: {
    minAmount: number;
    maxAmount: number;
    pricePerCoin: number;
  };
  packages: Array<{
    name: string;
    description: string;
    coins: number;
    price: number;
    isPopular: boolean;
    isBestValue: boolean;
    _id: string;
  }>;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface PointsData {
  _id: string;
  conversionRate: number;
  earningRules: Array<{
    id: string;
    action: string;
    points: number;
    category: string;
    enabled: boolean;
    _id: string;
  }>;
  expirationEnabled: boolean;
  expirationPeriod: number;
  expirationNotificationDays: number;
  rewards: Array<{
    id: string;
    name: string;
    description: string;
    points: number;
    validityDays: number;
    enabled: boolean;
    isLimited: boolean;
    _id: string;
  }>;
  createdAt: string;
  updatedAt: string;
  __v: number;
}