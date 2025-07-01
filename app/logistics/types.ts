export type LogisticsTab = 'overview' | 'partners' | 'captains' | 'applications';

export interface LogisticsPartner {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'suspended';
  contactInfo: {
    email: string;
    phone: string;
    address: string;
  };
  services: ('cash_pickup' | 'delivery' | 'both')[];
  overallRating: number;
  totalDeliveries: number;
  zones: LogisticsZone[];
  joinedDate: string;
  lastActive: string;
  type: 'company' | 'captain';
  companyName?: string;
  username?: string;
}

export interface LogisticsZone {
  id: string;
  name: string;
  color?: string;
  description: string;
  rates: {
    cashPickupFee: number;
    deliveryFee: number;
    fixedFee?: number;
  };
  estimatedDeliveryTime: string;
}

export interface LogisticsApplication {
  id: string;
  applicantName: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  details: string;
  type: 'company' | 'captain';
  companyName?: string;
  username?: string;
  address?: string;
  contactPerson?: string;
  email?: string;
  requestedServices?: string[];
  proposedZones?: string[];
  submittedDate?: string;
}

export interface Captain {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'suspended';
  email: string;
  phone: string;
  rating: number;
  totalTrips: number;
  joinedDate: string;
  lastActive: string;
} 