import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Wallet, WalletType, AdjustmentType } from "../type";

const mockWallets: Wallet[] = [
  {
    id: "1",
    type: "user",
    entityId: "user-1",
    entityName: "John Doe",
    balance: 1500.0,
    points: 2500,
    coins: 500,
    createdAt: "2024-01-15T10:00:00Z",
    lastTransaction: "2024-03-23T15:30:00Z",
    status: "active",
    adjustments: [
      {
        id: "adj-1",
        type: "bonus",
        amount: 100.0,
        reason: "Welcome bonus",
        date: "2024-01-15T10:00:00Z",
      },
    ],
  },
  {
    id: "2",
    type: "business",
    entityId: "business-1",
    entityName: "Acme Corp",
    balance: 5000.0,
    points: 0,
    coins: 0,
    createdAt: "2024-02-01T09:00:00Z",
    lastTransaction: "2024-03-22T14:20:00Z",
    status: "active",
  },
  {
    id: "3",
    type: "agent",
    entityId: "agent-1",
    entityName: "Sarah Smith",
    balance: 750.0,
    points: 1000,
    coins: 200,
    createdAt: "2024-02-15T11:00:00Z",
    lastTransaction: "2024-03-21T16:45:00Z",
    status: "active",
  },
  {
    id: "4",
    type: "system",
    entityId: "system-1",
    entityName: "System Wallet",
    balance: 0.0,
    points: 0,
    coins: 0,
    createdAt: "2024-01-01T00:00:00Z",
    lastTransaction: "2024-03-20T10:15:00Z",
    status: "active",
  },
];

interface WalletsState {
  wallets: Wallet[];
  search: string;
  selectedTypes: WalletType[];
  sortField: "balance" | "entityName" | "lastTransaction";
  sortOrder: "asc" | "desc";
  selectedWallet: Wallet | null;
  isAdjustmentOpen: boolean;
  adjustment: {
    type: AdjustmentType;
    amount: string;
    reason: string;
  };
}

const initialState: WalletsState = {
  wallets: mockWallets,
  search: "",
  selectedTypes: [],
  sortField: "balance",
  sortOrder: "desc",
  selectedWallet: null,
  isAdjustmentOpen: false,
  adjustment: {
    type: "bonus",
    amount: "",
    reason: "",
  },
};

const walletsSlice = createSlice({
  name: "wallets",
  initialState,
  reducers: {
    setWallets: (state, action: PayloadAction<Wallet[]>) => {
      state.wallets = action.payload;
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
    setSelectedTypes: (state, action: PayloadAction<WalletType[]>) => {
      state.selectedTypes = action.payload;
    },
    setSortField: (
      state,
      action: PayloadAction<"balance" | "entityName" | "lastTransaction">
    ) => {
      state.sortField = action.payload;
    },
    setSortOrder: (state, action: PayloadAction<"asc" | "desc">) => {
      state.sortOrder = action.payload;
    },
    setSelectedWallet: (state, action: PayloadAction<Wallet | null>) => {
      state.selectedWallet = action.payload;
    },
    setIsAdjustmentOpen: (state, action: PayloadAction<boolean>) => {
      state.isAdjustmentOpen = action.payload;
    },
    setAdjustmentType: (state, action: PayloadAction<AdjustmentType>) => {
      state.adjustment.type = action.payload;
    },
    setAdjustmentAmount: (state, action: PayloadAction<string>) => {
      state.adjustment.amount = action.payload;
    },
    setAdjustmentReason: (state, action: PayloadAction<string>) => {
      state.adjustment.reason = action.payload;
    },
    resetAdjustment: (state) => {
      state.adjustment = initialState.adjustment;
    },
  },
});

export const {
  setWallets,
  setSearch,
  setSelectedTypes,
  setSortField,
  setSortOrder,
  setSelectedWallet,
  setIsAdjustmentOpen,
  setAdjustmentType,
  setAdjustmentAmount,
  setAdjustmentReason,
  resetAdjustment,
} = walletsSlice.actions;

export default walletsSlice.reducer;
