import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { type Payable, type PayableType } from "@/app/features/finance/type";

type SortField = "dueDate" | "amount" | "entityName";
type SortOrder = "asc" | "desc";

const mockPayables: Payable[] = [
  {
    id: "PAY001",
    type: "business",
    entityId: "BUS001",
    entityName: "Lebanese Restaurant",
    amount: 5000,
    dueDate: "2024-03-31",
    status: "pending",
    paymentMethod: "whish",
    description: "March 2024 Revenue Share",
  },
  {
    id: "PAY002",
    type: "agent",
    entityId: "AGT001",
    entityName: "Tripoli Express",
    amount: 3500,
    dueDate: "2024-03-31",
    status: "pending",
    paymentMethod: "cash_delivery",
    description: "March 2024 Payouts",
  },
  {
    id: "PAY003",
    type: "agent",
    entityId: "AGT002",
    entityName: "Beirut Central",
    amount: 2800,
    dueDate: "2024-03-31",
    status: "ready",
    paymentMethod: "cash_delivery",
    description: "March 2024 Payouts",
    paymentDetails: {
      readyDate: "2024-03-28T11:30:00Z",
      collectorName: "David Lee",
    },
  },
  {
    id: "PAY004",
    type: "creator",
    entityId: "CRT001",
    entityName: "Sarah Johnson",
    amount: 2500,
    dueDate: "2024-03-31",
    status: "ready",
    paymentMethod: "office_pickup",
    description: "March 2024 Earnings",
    paymentDetails: {
      readyDate: "2024-03-28T10:00:00Z",
    },
  },
  {
    id: "PAY005",
    type: "business",
    entityId: "BUS002",
    entityName: "Tech Store",
    amount: 1800,
    dueDate: "2024-03-31",
    status: "picked_up",
    paymentMethod: "cash_delivery",
    description: "March 2024 Revenue Share",
    paymentDetails: {
      readyDate: "2024-03-27T09:00:00Z",
      pickedUpDate: "2024-03-27T14:30:00Z",
      collectorName: "John Smith",
    },
  },
  {
    id: "PAY006",
    type: "creator",
    entityId: "CRT002",
    entityName: "Michael Chen",
    amount: 1200,
    dueDate: "2024-03-31",
    status: "paid",
    paymentMethod: "whish",
    description: "March 2024 Earnings",
    paymentDetails: {
      paidDate: "2024-03-28T15:45:00Z",
      reference: "WHISH-123456",
    },
  },
  {
    id: "PAY007",
    type: "creator",
    entityId: "CRT003",
    entityName: "Emma Davis",
    amount: 3200,
    dueDate: "2024-03-31",
    status: "pending",
    paymentMethod: "office_pickup",
    description: "March 2024 Earnings",
  },
  {
    id: "PAY008",
    type: "business",
    entityId: "BUS003",
    entityName: "Fashion Boutique",
    amount: 2100,
    dueDate: "2024-03-31",
    status: "paid",
    paymentMethod: "office_pickup",
    description: "March 2024 Revenue Share",
    paymentDetails: {
      readyDate: "2024-03-26T09:00:00Z",
      paidDate: "2024-03-26T14:15:00Z",
    },
  },
];

interface PayablesState {
  payables: Payable[];
  search: string;
  selectedTypes: PayableType[];
  sortField: SortField;
  sortOrder: SortOrder;
  selectedPayable: Payable | null;
  isShippingLabelOpen: boolean;
}

const initialState: PayablesState = {
  payables: mockPayables,
  search: "",
  selectedTypes: [],
  sortField: "dueDate",
  sortOrder: "asc",
  selectedPayable: null,
  isShippingLabelOpen: false,
};

const payablesSlice = createSlice({
  name: "payables",
  initialState,
  reducers: {
    setPayables: (state, action: PayloadAction<Payable[]>) => {
      state.payables = action.payload;
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
    setSelectedTypes: (state, action: PayloadAction<PayableType[]>) => {
      state.selectedTypes = action.payload;
    },
    setSortField: (state, action: PayloadAction<SortField>) => {
      state.sortField = action.payload;
    },
    setSortOrder: (state, action: PayloadAction<SortOrder>) => {
      state.sortOrder = action.payload;
    },
    setSelectedPayable: (state, action: PayloadAction<Payable | null>) => {
      state.selectedPayable = action.payload;
    },
    setIsShippingLabelOpen: (state, action: PayloadAction<boolean>) => {
      state.isShippingLabelOpen = action.payload;
    },
  },
});

export const {
  setPayables,
  setSearch,
  setSelectedTypes,
  setSortField,
  setSortOrder,
  setSelectedPayable,
  setIsShippingLabelOpen,
} = payablesSlice.actions;

export default payablesSlice.reducer;
