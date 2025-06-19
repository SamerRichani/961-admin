import { type LucideIcon, User as UserIcon, Wallet, UserCog, Shield } from "lucide-react";

export type TeamRole =
  | "staff"
  | "finance"
  | "manager"
  | "admin"
  | "super_admin";

export interface User {
  _id: string;
  fullName: string;
  idVerified: boolean;
  idDocuments?: Array<{
    type: "national_id" | "passport" | "drivers_license";
    verified: boolean;
    uploadDate: string;
    verificationDate?: string;
    documentNumber: string;
    expiryDate: string;
  }>;
  username: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  gender?: "male" | "female" | "other";
  birthdate?: string;
  addresses?: Array<{
    type: string;
    street: string;
    city: string;
    country: string;
    isDefault: boolean;
  }>;
  paymentMethods?: Array<{
    type: "card" | "bank";
    last4: string;
    expiryDate?: string;
    isDefault: boolean;
  }>;
  wallet?: {
    _id: string;
    balance: number;
    points: number;
    coins: number;
  };
  analytics?: {
    _id: string;
    avgTimeSpent?: string;
    dailyAppOpens: number;
    totalTimeSpent?: string;
    joinedSince: string;
  };
  financials?: {
    _id: string;
    totalSpent: number;
    purchases: Array<{
      date: string;
      item: string;
      amount: number;
    }>;
    subscriptions: Array<{
      type: string;
      status: string;
      renewalDate: string;
    }>;
  };
  bloodType?: string;
  phone?: string;
  religion?: string;
  country?: string;
  language?: string;
  relationshipStatus?: string;
  sejelId?: string;
  district?: string;
  vehicle?: {
    plate: string;
    make: string;
    model: string;
    color: string;
  };
  polls?: Array<{
    question: string;
    answer: string;
    date: string;
  }>;
  posts?: Array<{
    title: string;
    interaction: string;
    timestamp: string;
    preview?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  _id: string;
  userId: string;
  role: TeamRole;
  addedAt: string;
  user: {
    _id: string;
    fullName: string;
    username: string;
    email: string;
    avatarUrl?: string;
    role: UserRole;
    idVerified: boolean;
    createdAt: string;
    updatedAt: string;
  };
  createdAt: string;
  updatedAt: string;
}

export const teamRoleConfig: Record<
  TeamRole,
  {
    label: string;
    color: {
      bg: string;
      text: string;
    };
  }
> = {
  staff: {
    label: "Staff",
    color: { bg: "bg-blue-50", text: "text-blue-700" },
  },
  finance: {
    label: "Finance",
    color: { bg: "bg-emerald-50", text: "text-emerald-700" },
  },
  manager: {
    label: "Manager",
    color: { bg: "bg-purple-50", text: "text-purple-700" },
  },
  admin: {
    label: "Admin",
    color: { bg: "bg-orange-50", text: "text-orange-700" },
  },
  super_admin: {
    label: "Super Admin",
    color: { bg: "bg-red-50", text: "text-red-700" },
  },
};

export type UserRole =
  | "user"
  | "investor"
  | "staff"
  | "manager"
  | "super_admin";

export const roleConfig: Record<
  UserRole,
  {
    label: string;
    icon: LucideIcon;
    color: {
      bg: string;
      text: string;
      border: string;
    };
  }
> = {
  user: {
    label: "User",
    icon: UserIcon,
    color: {
      bg: "bg-gray-50",
      text: "text-gray-700",
      border: "border-gray-200",
    },
  },
  investor: {
    label: "Investor",
    icon: Wallet,
    color: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
    },
  },
  staff: {
    label: "Staff",
    icon: UserCog,
    color: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
    },
  },
  manager: {
    label: "Manager",
    icon: Shield,
    color: {
      bg: "bg-purple-50",
      text: "text-purple-700",
      border: "border-purple-200",
    },
  },
  super_admin: {
    label: "Super Admin",
    icon: Shield,
    color: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
  },
};

export interface TeamState {
  teamMembers: TeamMember[];
  search: string;
  removingMember: TeamMember | null;
}

export interface UsersState {
  users: User[];
  filteredUsers: User[];
  selectedUser: User | null;
  isDialogOpen: boolean;
  moderatingUser: User | null;
  isModerationOpen: boolean;
  search: string;
  page: number;
  totalPages: number;
  activeTab: "users" | "team";
  teamSearch: string;
  isLoading: boolean;
  error: string | null;
  // Form state
  formFullName: string;
  formUsername: string;
  formRole: UserRole;
  formAvatarUrl?: string;
  formGender: "male" | "female" | "other";
  formBirthdate: string;
  // Moderation form state
  moderationActionType: "suspend" | "ban" | "warn";
  moderationDuration: number;
  moderationReason: string;
  moderationNotification: string;
  moderationHideExisting: boolean;
  moderationPreventNew: boolean;
  moderationShowBanConfirm: boolean;
}

export interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}
