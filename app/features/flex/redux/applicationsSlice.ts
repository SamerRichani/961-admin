import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { type FlexerApplication } from '@/app/features/flex/types';
import { ApplicationsState } from '../types';

const initialState: ApplicationsState = {
  applications: [
    {
      id: 'APP001',
      name: 'John Smith',
      username: 'johnsmith',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&q=90',
      appliedAt: '2024-03-20T10:30:00Z',
      applicationCount: 1,
      userSince: '2023-01-15T08:30:00Z',
      documents: [
        {
          type: 'national_id',
          verified: true,
          uploadDate: '2024-03-20T10:25:00Z',
          documentNumber: 'ID123456',
          expiryDate: '2029-03-20'
        },
        {
          type: 'drivers_license',
          verified: true,
          uploadDate: '2024-03-20T10:26:00Z',
          documentNumber: 'DL789012',
          expiryDate: '2027-03-20'
        },
        {
          type: 'vehicle_registration',
          verified: true,
          uploadDate: '2024-03-20T10:27:00Z',
          documentNumber: 'VR345678',
          expiryDate: '2025-03-20'
        },
        {
          type: 'insurance',
          verified: true,
          uploadDate: '2024-03-20T10:28:00Z',
          documentNumber: 'INS901234',
          expiryDate: '2025-03-20'
        }
      ],
      vehicle: {
        make: 'Toyota',
        model: 'Corolla',
        year: '2020',
        color: 'Silver',
        plateNumber: 'ABC 123'
      }
    },
    {
      id: 'APP002',
      name: 'Sarah Johnson',
      username: 'sarahj',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&q=90',
      appliedAt: '2024-03-19T15:45:00Z',
      applicationCount: 2,
      userSince: '2023-02-01T09:15:00Z',
      documents: [
        {
          type: 'national_id',
          verified: true,
          uploadDate: '2024-03-19T15:40:00Z',
          documentNumber: 'ID234567',
          expiryDate: '2028-03-19'
        },
        {
          type: 'drivers_license',
          verified: true,
          uploadDate: '2024-03-19T15:41:00Z',
          documentNumber: 'DL890123',
          expiryDate: '2026-03-19'
        },
        {
          type: 'vehicle_registration',
          verified: false,
          uploadDate: '2024-03-19T15:42:00Z',
          documentNumber: 'VR456789',
          expiryDate: '2025-03-19'
        }
      ],
      vehicle: {
        make: 'Honda',
        model: 'Civic',
        year: '2021',
        color: 'Blue',
        plateNumber: 'XYZ 789'
      }
    }
  ],
  selectedApplication: null
};

const applicationsSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {
    setSelectedApplication: (state, action: PayloadAction<FlexerApplication | null>) => {
      state.selectedApplication = action.payload;
    },
    approveApplication: (state, action: PayloadAction<string>) => {
      // Remove the approved application from the list
      state.applications = state.applications.filter(app => app.id !== action.payload);
      state.selectedApplication = null;
    },
    rejectApplication: (state, action: PayloadAction<string>) => {
      // Remove the rejected application from the list
      state.applications = state.applications.filter(app => app.id !== action.payload);
      state.selectedApplication = null;
    }
  }
});

export const {
  setSelectedApplication,
  approveApplication,
  rejectApplication
} = applicationsSlice.actions;

export default applicationsSlice.reducer; 