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
  documents?: any[];
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
  operatingHours: {
    [key: string]: { start: string; end: string; available: boolean; };
    monday: { start: string; end: string; available: boolean; };
    tuesday: { start: string; end: string; available: boolean; };
    wednesday: { start: string; end: string; available: boolean; };
    thursday: { start: string; end: string; available: boolean; };
    friday: { start: string; end: string; available: boolean; };
    saturday: { start: string; end: string; available: boolean; };
    sunday: { start: string; end: string; available: boolean; };
  };
}

export interface LogisticsApplication {
  id: string;
  applicantName: string;
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  submittedAt: string;
  reviewedAt?: string;
  details: string;
  type: 'company' | 'captain';
  companyName?: string;
  username?: string;
  address?: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  requestedServices?: string[];
  proposedZones?: any[];
  submittedDate?: string;
  documents?: any[];
  reviewedBy?: string;
  reviewedDate?: string;
  notes?: string;
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
  stats?: {
    totalTrips?: number;
    dollarsPerHour?: number;
    totalEarnings?: number;
    hoursWorked?: number;
  };
  coverageZones?: any[];
  username?: string;
  joinDate?: string;
} 