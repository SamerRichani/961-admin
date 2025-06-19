import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Transaction, TransactionType } from "../type";

const mockTransactions: Transaction[] = [
  {
    id: "1",
    type: "payment",
    amount: 150.0,
    date: "2024-03-23T10:30:00Z",
    description: "Payment from Advertiser A",
    reference: "PAY-123",
    status: "completed",
  },
  {
    id: "2",
    type: "refund",
    amount: -75.0,
    date: "2024-03-22T15:45:00Z",
    description: "Refund to User B",
    reference: "REF-456",
    status: "completed",
  },
  {
    id: "3",
    type: "transfer",
    amount: 1000.0,
    date: "2024-03-21T09:15:00Z",
    description: "Transfer to Creator C",
    reference: "TRF-789",
    status: "pending",
  },
  {
    id: "4",
    type: "fee",
    amount: -25.0,
    date: "2024-03-20T14:20:00Z",
    description: "Processing Fee",
    reference: "FEE-101",
    status: "completed",
  },
  {
    id: "5",
    type: "adjustment",
    amount: 50.0,
    date: "2024-03-19T11:00:00Z",
    description: "Balance Adjustment",
    reference: "ADJ-202",
    status: "completed",
  },
];

interface TransactionsState {
  transactions: Transaction[];
  search: string;
  dateRange: string;
  selectedTypes: TransactionType[];
}

const initialState: TransactionsState = {
  transactions: mockTransactions,
  search: "",
  dateRange: "all",
  selectedTypes: [],
};

const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    setTransactions: (state, action: PayloadAction<Transaction[]>) => {
      state.transactions = action.payload;
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
    setDateRange: (state, action: PayloadAction<string>) => {
      state.dateRange = action.payload;
    },
    setSelectedTypes: (state, action: PayloadAction<TransactionType[]>) => {
      state.selectedTypes = action.payload;
    },
  },
});

export const { setTransactions, setSearch, setDateRange, setSelectedTypes } =
  transactionsSlice.actions;
export default transactionsSlice.reducer;
