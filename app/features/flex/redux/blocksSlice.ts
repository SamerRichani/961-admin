import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { type Block } from '@/app/features/flex/types';
import { BlocksState } from '../types';

const initialState: BlocksState = {
  blocks: [
    {
      id: 'BLK001',
      status: 'in_progress',
      startTime: '2024-03-20T09:00:00Z',
      endTime: '2024-03-20T13:00:00Z',
      tasks: {
        total: 12,
        completed: 8,
        deliveries: 10,
        pickups: 2,
        entities: [
          {
            id: 'ENT001',
            name: 'Tech Store',
            type: 'business',
            tasks: [
              {
                id: 'TSK001',
                type: 'delivery',
                status: 'completed',
                amount: 150,
                address: '123 Main St'
              }
            ]
          }
        ]
      },
      earnings: 120,
      location: 'Downtown',
      flexer: {
        id: 'FLX001',
        name: 'John Doe',
        avatar: '/avatars/john.jpg'
      }
    },
    {
      id: 'BLK002',
      status: 'available',
      startTime: '2024-03-20T14:00:00Z',
      endTime: '2024-03-20T18:00:00Z',
      tasks: {
        total: 8,
        completed: 0,
        deliveries: 6,
        pickups: 2,
        entities: [
          {
            id: 'ENT002',
            name: 'Local Shop',
            type: 'business',
            tasks: [
              {
                id: 'TSK002',
                type: 'pickup',
                status: 'pending',
                amount: 200,
                address: '456 Oak St'
              }
            ]
          }
        ]
      },
      earnings: 80,
      location: 'Uptown'
    },
    {
      id: 'BLK003',
      status: 'completed',
      startTime: '2024-03-20T08:00:00Z',
      endTime: '2024-03-20T12:00:00Z',
      tasks: {
        total: 10,
        completed: 10,
        deliveries: 7,
        pickups: 3,
        entities: [
          {
            id: 'ENT003',
            name: 'Home User',
            type: 'user',
            tasks: [
              {
                id: 'TSK003',
                type: 'delivery',
                status: 'completed',
                address: '789 Pine St'
              }
            ]
          }
        ]
      },
      earnings: 100,
      location: 'Midtown',
      flexer: {
        id: 'FLX002',
        name: 'Jane Smith',
        avatar: '/avatars/jane.jpg'
      }
    }
  ],
  selectedBlock: null
};

const blocksSlice = createSlice({
  name: 'blocks',
  initialState,
  reducers: {
    addBlock: (state, action: PayloadAction<Block>) => {
      state.blocks.push(action.payload);
    },
    setSelectedBlock: (state, action: PayloadAction<Block | null>) => {
      state.selectedBlock = action.payload;
    },
    updateBlock: (state, action: PayloadAction<Block>) => {
      const index = state.blocks.findIndex(block => block.id === action.payload.id);
      if (index !== -1) {
        state.blocks[index] = action.payload;
      }
    }
  }
});

export const { addBlock, setSelectedBlock, updateBlock } = blocksSlice.actions;
export default blocksSlice.reducer; 