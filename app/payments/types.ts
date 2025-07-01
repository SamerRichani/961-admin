import { ReactNode } from 'react';
import { type LucideIcon } from 'lucide-react';

export type PaymentStatus = 'active' | 'inactive';

export type PaymentTab = 'topup' | 'checkout';

export interface PaymentFee {
  percentage?: number;
  fixed?: number;
  paidBy?: string;
}

export interface Provider {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  fees: Record<PaymentTab, PaymentFee> & { topup?: PaymentFee };
  processingTime?: string;
  coordinates?: { address: string }[];
  availableFees?: number[];
}

export interface PaymentMethod {
  id: string;
  name: string;
  icon: LucideIcon;
  status: 'active' | 'inactive';
  category: 'credit_card' | 'cash_pickup' | 'office' | 'digital_wallet' | string;
  availableIn: PaymentTab[];
  fees: Record<PaymentTab, PaymentFee>;
  processingTime?: string;
  providers?: Provider[];
} 