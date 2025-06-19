import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { type Station } from '@/app/features/flex/types';
import { StationsState } from '../types';

const initialState: StationsState = {
  stations: [
    {
      id: 'STN001',
      name: 'Beirut Central',
      status: 'active',
      location: 'Downtown Beirut',
      metrics: {
        activeFlexers: 25,
        pendingTasks: 45,
        completedTasks: 450,
        cashCollected: 25000,
        accuracy: 99.5
      },
      managers: [
        { id: 'MGR001', name: 'David Lee', role: 'Station Manager' },
        { id: 'MGR002', name: 'Emma Wilson', role: 'Assistant Manager' }
      ]
    },
    {
      id: 'STN002',
      name: 'Tripoli Hub',
      status: 'active',
      location: 'Central Tripoli',
      metrics: {
        activeFlexers: 18,
        pendingTasks: 32,
        completedTasks: 320,
        cashCollected: 18000,
        accuracy: 98.8
      },
      managers: [
        { id: 'MGR003', name: 'Michael Chen', role: 'Station Manager' }
      ]
    },
    {
      id: 'STN003',
      name: 'Sidon Station',
      status: 'inactive',
      location: 'Sidon Port Area',
      metrics: {
        activeFlexers: 15,
        pendingTasks: 28,
        completedTasks: 280,
        cashCollected: 15000,
        accuracy: 99.2
      },
      managers: [
        { id: 'MGR004', name: 'Sarah Johnson', role: 'Station Manager' }
      ]
    }
  ],
  selectedStation: null
};

const stationsSlice = createSlice({
  name: 'stations',
  initialState,
  reducers: {
    setSelectedStation: (state, action: PayloadAction<Station | null>) => {
      state.selectedStation = action.payload;
    },
    addStation: (state, action: PayloadAction<Station>) => {
      state.stations.push(action.payload);
    },
    updateStation: (state, action: PayloadAction<Station>) => {
      const index = state.stations.findIndex(station => station.id === action.payload.id);
      if (index !== -1) {
        state.stations[index] = action.payload;
      }
    },
    removeStation: (state, action: PayloadAction<string>) => {
      state.stations = state.stations.filter(station => station.id !== action.payload);
    }
  }
});

export const {
  setSelectedStation,
  addStation,
  updateStation,
  removeStation
} = stationsSlice.actions;

export default stationsSlice.reducer; 