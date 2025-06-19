import { type LucideIcon, DollarSign, ShoppingBag, Coins, Package, CreditCard, Users, Star, Building, CircleDollarSign, ArrowLeft, ArrowUpRight, UserCog, Settings, User, Building2, Server } from 'lucide-react';

export type RevenueSource = 'advertising' | 'coins' | 'merch' | 'logistics' | 'deals';
export type TimeRange = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'ytd' | 'last_12_months';

export interface RevenueData {
  date: string;
  advertising: number;
  coins: number;
  merch: number;
  logistics: number;
  deals: number;
}

export interface RevenueMetrics {
  totalRevenue: number;
  activeDeals: number;
  changePercentage: number;
}

export const revenueSourceConfig: Record<RevenueSource, {
  label: string;
  icon: LucideIcon;
  color: {
    light: string;
    dark: string;
  };
}> = {
  advertising: {
    label: 'Advertising',
    icon: CreditCard,
    color: { light: '#FF0000', dark: '#CC0000' },
  },
  coins: {
    label: 'Coin Purchases',
    icon: Coins,
    color: { light: '#FF3333', dark: '#CC3333' },
  },
  merch: {
    label: 'Merch Sales',
    icon: ShoppingBag,
    color: { light: '#FF6666', dark: '#CC6666' },
  },
  logistics: {
    label: 'Logistics',
    icon: Package,
    color: { light: '#FF9999', dark: '#CC9999' },
  },
  deals: {
    label: 'Deals Memberships',
    icon: DollarSign,
    color: { light: '#FFCCCC', dark: '#CCCCCC' },
  },
};

export const mockRevenueData: RevenueData[] = [
  {
    date: '2024-01-01',
    advertising: 25000,
    coins: 15000,
    merch: 12000,
    logistics: 8000,
    deals: 5000,
  },
  {
    date: '2024-02-01',
    advertising: 28000,
    coins: 18000,
    merch: 14000,
    logistics: 9000,
    deals: 6000,
  },
  {
    date: '2024-03-01',
    advertising: 32000,
    coins: 20000,
    merch: 16000,
    logistics: 11000,
    deals: 8000,
  },
];


export interface RevenueStream {
  name: string;
  value: number;
  amount: number;
}

export interface FinanceState {
  timeRange: TimeRange;
  revenueData: RevenueData[];
  revenueStreams: RevenueStream[];
  topCreators: Array<{
    id: string;
    name: string;
    avatar: string;
    revenue: number;
    percentage: number;
  }>;
  topPlaces: Array<{
    id: string;
    name: string;
    location: string;
    revenue: number;
    percentage: number;
    transactions: number;
  }>;
  topAdvertisers: Array<{
    id: string;
    name: string;
    spend: number;
    percentage: number;
  }>;
}

export type PayableType = 'agent' | 'creator' | 'business';
export type PayableStatus = 'pending' | 'ready' | 'picked_up' | 'paid';
export type PaymentMethod = 'whish' | 'cash_delivery' | 'office_pickup';

export interface Payable {
  id: string;
  type: PayableType;
  entityId: string;
  entityName: string;
  amount: number;
  dueDate: string;
  status: PayableStatus;
  paymentMethod: PaymentMethod;
  description?: string;
  paymentDetails?: {
    readyDate?: string;
    pickedUpDate?: string;
    paidDate?: string;
    collectorName?: string;
    reference?: string;
  };
}

export const payableConfig: Record<PayableType, {
  label: string;
  icon: LucideIcon;
  color: {
    bg: string;
    text: string;
  };
}> = {
  agent: {
    label: 'Agent',
    icon: Users,
    color: { bg: 'bg-green-50', text: 'text-green-700' },
  },
  creator: {
    label: 'Creator',
    icon: Star,
    color: { bg: 'bg-purple-50', text: 'text-purple-700' },
  },
  business: {
    label: 'Business',
    icon: Building,
    color: { bg: 'bg-blue-50', text: 'text-blue-700' },
  },
};

export const statusColors: Record<PayableStatus, { bg: string; text: string }> = {
  pending: { bg: 'bg-yellow-50', text: 'text-yellow-700' },
  ready: { bg: 'bg-blue-50', text: 'text-blue-700' },
  picked_up: { bg: 'bg-purple-50', text: 'text-purple-700' },
  paid: { bg: 'bg-green-50', text: 'text-green-700' },
};

export type ReceivableType = 'advertiser' | 'agent' | 'other';
export type ReceivableStatus = 'pending' | 'overdue' | 'partially_paid' | 'pending_pickup' | 'picked_up' | 'delivered' | 'confirmed';

export interface Receivable {
  id: string;
  type: ReceivableType;
  entityId: string;
  entityName: string;
  amount: number;
  dueDate: string;
  invoiceDate: string;
  invoiceNumber?: string;
  status: ReceivableStatus;
  description?: string;
  cashCollection?: {
    status: 'pending_pickup' | 'picked_up' | 'delivered' | 'confirmed';
    collectorName?: string;
    pickupDate?: string;
    deliveryDate?: string;
    confirmationDate?: string;
    notes?: string;
  };
  paymentHistory: Array<{
    id: string;
    date: string;
    amount: number;
    method: string;
    reference?: string;
  }>;
}

export const receivableConfig: Record<ReceivableType, {
  label: string;
  icon: LucideIcon;
  color: {
    bg: string;
    text: string;
  };
  terms?: string;
}> = {
  advertiser: {
    label: 'Advertiser',
    icon: Building,
    color: { bg: 'bg-blue-50', text: 'text-blue-700' },
    terms: 'Net 30',
  },
  agent: {
    label: 'Agent',
    icon: Users,
    color: { bg: 'bg-green-50', text: 'text-green-700' },
    terms: 'Month-End',
  },
  other: {
    label: 'Other',
    icon: CircleDollarSign,
    color: { bg: 'bg-purple-50', text: 'text-purple-700' },
  },
};

export const receivableStatusColors: Record<ReceivableStatus, { bg: string; text: string }> = {
  pending: { bg: 'bg-yellow-50', text: 'text-yellow-700' },
  overdue: { bg: 'bg-red-50', text: 'text-red-700' },
  partially_paid: { bg: 'bg-blue-50', text: 'text-blue-700' }, 
  pending_pickup: { bg: 'bg-orange-50', text: 'text-orange-700' },
  picked_up: { bg: 'bg-purple-50', text: 'text-purple-700' },
  delivered: { bg: 'bg-emerald-50', text: 'text-emerald-700' },
  confirmed: { bg: 'bg-green-50', text: 'text-green-700' },
};

export type TransactionType = 'payment' | 'refund' | 'transfer' | 'fee' | 'adjustment';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  date: string;
  description: string;
  reference?: string;
  status: 'completed' | 'pending' | 'failed';
  sourceWallet?: {
    id: string;
    entityName: string;
    balance: number;
  };
  destinationWallet?: {
    id: string;
    entityName: string;
    balance: number;
  };
  metadata?: Record<string, any>;
}

export const transactionConfig: Record<TransactionType, {
  label: string;
  icon: LucideIcon;
  color: {
    bg: string;
    text: string;
  };
}> = {
  payment: {
    label: 'Payment',
    icon: CreditCard,
    color: { bg: 'bg-green-50', text: 'text-green-700' },
  },
  refund: {
    label: 'Refund',
    icon: ArrowLeft,
    color: { bg: 'bg-red-50', text: 'text-red-700' },
  },
  transfer: {
    label: 'Transfer',
    icon: ArrowUpRight,
    color: { bg: 'bg-blue-50', text: 'text-blue-700' },
  },
  fee: {
    label: 'Fee',
    icon: DollarSign,
    color: { bg: 'bg-yellow-50', text: 'text-yellow-700' },
  },
  adjustment: {
    label: 'Adjustment',
    icon: CircleDollarSign,
    color: { bg: 'bg-purple-50', text: 'text-purple-700' },
  },
};

export type WalletType = 'user' | 'business' | 'agent' | 'system';
export type AdjustmentType = 'credit' | 'debit' | 'bonus' | 'penalty' | 'correction';

export interface Wallet {
  id: string;
  type: WalletType;
  entityId: string;
  entityName: string;
  balance: number;
  points: number;
  coins: number;
  createdAt: string;
  lastTransaction: string;
  status: 'active' | 'suspended' | 'closed';
  adjustments?: Array<{
    id: string;
    type: AdjustmentType;
    amount: number;
    reason: string;
    date: string;
  }>;
}

export const walletConfig: Record<WalletType, { label: string; icon: LucideIcon; color: { bg: string; text: string } }> = {
  user: {
    label: 'User',
    icon: User,
    color: { bg: 'bg-blue-50', text: 'text-blue-600' },
  },
  business: {
    label: 'Business',
    icon: Building2,
    color: { bg: 'bg-purple-50', text: 'text-purple-600' },
  },
  agent: {
    label: 'Agent',
    icon: UserCog,
    color: { bg: 'bg-green-50', text: 'text-green-600' },
  },
  system: {
    label: 'System',
    icon: Server,
    color: { bg: 'bg-gray-50', text: 'text-gray-600' },
  },
};



export type VATSection = 'summary' | 'details' | 'report';

export interface VATMetric {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
}

export interface VATTransaction {
  id: string;
  invoiceNumber: string;
  organizerName: string;
  eventName: string;
  taxableAmount: number;
  vatRate: number;
  vatAmount: number;
  date: string;
  type: 'service_fee' | 'platform_fee' | 'addon_fee';
}

export interface VATSummaryData {
  totalTaxableSales: number;
  totalVatCollected: number;
  standardRateAmount: number;
  zeroRateAmount: number;
}

export interface VATReportData {
  standardRateSales: number;
  zeroRateSales: number;
  totalVatCollected: number;
  nextDueDate: string;
  isPaid: boolean;
}