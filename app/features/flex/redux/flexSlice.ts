import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FlexState {
  isScanDialogOpen: boolean;
  isCreateBlockOpen: boolean;
  verificationStep: 'scanning' | 'cash' | 'returns' | 'summary';
  cashVerification: {
    expectedAmount: number;
    actualAmount: number;
    returns: Array<{
      id: string;
      scanned: boolean;
    }>;
  };
  search: string;
}

const initialState: FlexState = {
  isScanDialogOpen: false,
  isCreateBlockOpen: false,
  verificationStep: 'scanning',
  cashVerification: {
    expectedAmount: 0,
    actualAmount: 0,
    returns: []
  },
  search: ''
};

const flexSlice = createSlice({
  name: 'flex',
  initialState,
  reducers: {
    setIsScanDialogOpen: (state, action: PayloadAction<boolean>) => {
      state.isScanDialogOpen = action.payload;
    },
    setIsCreateBlockOpen: (state, action: PayloadAction<boolean>) => {
      state.isCreateBlockOpen = action.payload;
    },
    setVerificationStep: (state, action: PayloadAction<FlexState['verificationStep']>) => {
      state.verificationStep = action.payload;
    },
    updateCashVerification: (state, action: PayloadAction<Partial<FlexState['cashVerification']>>) => {
      state.cashVerification = { ...state.cashVerification, ...action.payload };
    },
    resetCashVerification: (state) => {
      state.cashVerification = initialState.cashVerification;
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    }
  }
});

export const {
  setIsScanDialogOpen,
  setIsCreateBlockOpen,
  setVerificationStep,
  updateCashVerification,
  resetCashVerification,
  setSearch
} = flexSlice.actions;

export default flexSlice.reducer; 