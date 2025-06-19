export type FlexerStatus = 'active' | 'inactive' | 'disabled';
export type BlockStatus = 'available' | 'assigned' | 'in_progress' | 'completed';
export type TaskStatus = 'pending' | 'assigned' | 'in_progress' | 'completed' | 'failed';
export type TaskType = 'delivery' | 'pickup' | 'return';
export type StationStatus = 'active' | 'inactive';

export interface Flexer {
  id: string;
  name: string;
  avatar: string;
  status: FlexerStatus;
  rating: number;
  totalBlocks: number;
  completedTasks: number;
  failedTasks: number;
  totalEarnings: number;
  avgBlockTime: string;
  cashAccuracy: number;
}

export interface Block {
  id: string;
  status: BlockStatus;
  startTime: string;
  endTime: string;
  tasks: {
    total: number;
    completed: number;
    deliveries: number;
    pickups: number;
    entities: Array<{
      id: string;
      name: string;
      type: 'business' | 'user';
      tasks: Array<{
        id: string;
        type: TaskType;
        status: TaskStatus;
        amount?: number;
        address: string;
      }>;
    }>;
  };
  earnings: number;
  location: string;
  flexer?: {
    id: string;
    name: string;
    avatar: string;
  };
  actualAmount?: number;
}

export interface Task {
  id: string;
  type: TaskType;
  status: TaskStatus;
  blockId?: string;
  customer: {
    name: string;
    phone: string;
    email?: string;
  };
  address: string;
  amount?: number;
  scheduledTime: string;
  completedTime?: string;
  flexer?: {
    id: string;
    name: string;
    avatar: string;
  };
  failureReason?: string;
}

export interface Station {
  id: string;
  name: string;
  status: StationStatus;
  location: string;
  metrics: {
    activeFlexers: number;
    pendingTasks: number;
    completedTasks: number;
    cashCollected: number;
    accuracy: number;
  };
  managers: Array<{
    id: string;
    name: string;
    role: string;
  }>;
}

export interface FlexerApplication {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  appliedAt: string;
  applicationCount: number;
  userSince: string;
  documents: Array<{
    type: 'national_id' | 'drivers_license' | 'vehicle_registration' | 'insurance';
    verified: boolean;
    uploadDate: string;
    expiryDate?: string;
    documentNumber: string;
  }>;
  vehicle: {
    make: string;
    model: string;
    year: string;
    color: string;
    plateNumber: string;
  };
}

export interface StationData {
  name: string;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  managers: Array<{
    name: string;
    role: string;
  }>;
}


export interface BlockData {
  startTime: string;
  endTime: string;
  location: string;
  maxTasks: number;
  type: 'mixed' | 'delivery' | 'pickup';
}

export interface ApplicationsState {
  applications: FlexerApplication[];
  selectedApplication: FlexerApplication | null;
}

export interface BlocksState {
  blocks: Block[];
  selectedBlock: Block | null;
}

export interface FlexersState {
  flexers: Flexer[];
  selectedFlexer: Flexer | null;
  moderateFlexer: Flexer | null;
  banFlexer: Flexer | null;
}

export interface PricingRates {
  base: number;
  perKm: number;

  // Region-based pricing
  regions: Array<{
    name: string;
    multiplier: number;
  }>;

  // Peak Season pricing
  peakSeasons: Array<{
    name: string;
    startDate: string;
    endDate: string;
    percentage: number;
  }>;

  // Business rates
  businessBaseMultiplier: number;
  businessVolumeDiscounts: Array<{
    minVolume: number;
    discount: number;
  }>;

  // Urgent delivery
  urgentDeliveryMultiplier: number;
  urgentMaxDistance: number;
  urgentTimeWindow: number;
}

export interface FlexSettings {
  // Task Settings
  minTasksPerBlock: number;
  maxTasksPerBlock: number;
  maxActiveBlocks: number;
  maxDailyTasks: number;
  taskTimeout: number;

  // Cost Settings
  costPerTask: number;
  costPerCashTask: number;
  bonusThreshold: number;
  bonusAmount: number;

  // Performance Settings
  autoDisableThreshold: number;
  warningThreshold: number;
  minAcceptanceRate: number;
  minCompletionRate: number;

  // Verification Settings
  qrVerificationEnabled: boolean;
  photoVerificationEnabled: boolean;
  signatureRequired: boolean;
  idVerificationRequired: boolean;
  cashVerificationRequired: boolean;
  returnVerificationRequired: boolean;
  stationVerificationRequired: boolean;

  // System Settings
  registrationEnabled: boolean;
  autoAssignEnabled: boolean;
  notificationsEnabled: boolean;
  trackingInterval: number;
  maxRetryAttempts: number;
  autoReassignTimeout: number;
  blockAssignmentWindow: number;

  // Location Settings
  maxRadius: number;
  locationUpdateInterval: number;
  geofencingEnabled: boolean;
  stationCheckInRequired: boolean;
  stationCheckOutRequired: boolean;
  maxTaskRadius: number;
  routeOptimizationEnabled: boolean;
}

export interface FlexState {
  activeTab: string;
  search: string;
  isCreateBlockOpen: boolean;
  isScanDialogOpen: boolean;
  verificationStep: "scanning" | "cash" | "returns" | "summary";
  cashVerification: {
    expectedAmount: number;
    actualAmount: number;
    returns: Array<{
      id: string;
      scanned: boolean;
    }>;
  };
}

export interface StationsState {
  stations: Station[];
  selectedStation: Station | null;
}

export interface TasksState {
  tasks: Task[];
  selectedTask: Task | null;
}
