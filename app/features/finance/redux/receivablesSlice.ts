import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Receivable, ReceivableType, ReceivableStatus } from "@/app/features/finance/type";

interface ReceivablesState {
  receivables: Receivable[];
  searchTerm: string;
  selectedTypes: ReceivableType[];
  sortField: keyof Receivable | null;
  sortDirection: "asc" | "desc";
}

const initialState: ReceivablesState = {
  receivables: [],
  searchTerm: "",
  selectedTypes: [],
  sortField: null,
  sortDirection: "asc",
};

const receivablesSlice = createSlice({
  name: "receivables",
  initialState,
  reducers: {
    setReceivables: (state, action: PayloadAction<Receivable[]>) => {
      state.receivables = action.payload;
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setSelectedTypes: (state, action: PayloadAction<ReceivableType[]>) => {
      state.selectedTypes = action.payload;
    },
    setSortField: (state, action: PayloadAction<keyof Receivable | null>) => {
      state.sortField = action.payload;
    },
    setSortDirection: (state, action: PayloadAction<"asc" | "desc">) => {
      state.sortDirection = action.payload;
    },
    updateReceivableStatus: (state, action: PayloadAction<{ id: string; status: ReceivableStatus }>) => {
      const receivable = state.receivables.find(r => r.id === action.payload.id);
      if (receivable) {
        receivable.status = action.payload.status;
      }
    },
    addPayment: (state, action: PayloadAction<{ 
      id: string; 
      payment: { 
        id: string; 
        date: string; 
        amount: number; 
        method: string; 
        reference: string; 
      };
      status: ReceivableStatus;
    }>) => {
      const receivable = state.receivables.find(r => r.id === action.payload.id);
      if (receivable) {
        receivable.paymentHistory.push(action.payload.payment);
        receivable.status = action.payload.status;
      }
    },
  },
});

export const {
  setReceivables,
  setSearchTerm,
  setSelectedTypes,
  setSortField,
  setSortDirection,
  updateReceivableStatus,
  addPayment,
} = receivablesSlice.actions;

export default receivablesSlice.reducer;
