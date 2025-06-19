import { ChartConfig } from "@/components/ui/chart";

export interface GenderData {
  id: string;
  value: number;
  fill: string;
}

export interface AgeData {
  range: string;
  value: number;
}

export interface LocationData {
  country: string;
  value: number;
  fill: string;
}

export interface AnalyticsState {
  genderData: GenderData[];
  ageData: AgeData[];
  locationData: LocationData[];
  genderConfig: ChartConfig;
  ageConfig: ChartConfig;
  locationConfig: ChartConfig;
}

export interface Investor {
  id: string;
  name: string;
  totalShares: number;
  averagePrice: number;
  totalInvestment: number;
  joinDate: string;
}

export interface InvestorsState {
  investors: Investor[];
  search: string;
  sortField: "name" | "shares" | "investment" | "joinDate";
  sortDirection: "asc" | "desc";
}

export interface PollOption {
  _id: string;
  id: string;
  text: string;
  votes: number;
}

export interface Poll {
  _id: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
  status: "active" | "ended";
  endDate: string;
  createdAt: string;
  totalInvestors: number;
  __v: number;
}

export interface PollsState {
  polls: Poll[];
  newPoll: {
    question: string;
    options: string[];
  };
}

export interface Wave {
  _id: string;
  name: string;
  percentage: number;
  price: number;
}

export interface SharesState {
  totalShares: number;
  currentPrice: number;
  waves: Wave[];
  editingWave: number | null;
  editedWave: Wave | null;
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface Update {
  id: string;
  content: string;
  createdAt: string;
  author: string;
  likes: number;
  comments: Comment[];
  imageUrl?: string;
}

export interface UpdatesState {
  updates: Update[];
  newUpdate: string;
  selectedImageUrl: string | null;
}
