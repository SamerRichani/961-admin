import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Task } from '@/app/features/flex/types';
import { TasksState } from '../types';
const initialState: TasksState = {
  tasks: [
    {
      id: 'TSK001',
      type: 'delivery',
      status: 'in_progress',
      blockId: 'BLK001',
      customer: {
        name: 'Alice Brown',
        phone: '+961 1 234 567',
        email: 'alice@example.com'
      },
      address: '123 Main St, Beirut',
      scheduledTime: '2024-03-20T10:00:00Z',
      flexer: {
        id: 'FLX001',
        name: 'John Smith',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&q=90'
      }
    },
    {
      id: 'TSK002',
      type: 'pickup',
      status: 'pending',
      address: '456 Oak St, Tripoli',
      customer: {
        name: 'Bob Wilson',
        phone: '+961 1 345 678'
      },
      amount: 250,
      scheduledTime: '2024-03-20T14:00:00Z'
    },
    {
      id: 'TSK003',
      type: 'delivery',
      status: 'failed',
      blockId: 'BLK003',
      customer: {
        name: 'Carol Davis',
        phone: '+961 1 456 789',
        email: 'carol@example.com'
      },
      address: '789 Pine St, Sidon',
      scheduledTime: '2024-03-20T09:00:00Z',
      completedTime: '2024-03-20T09:15:00Z',
      flexer: {
        id: 'FLX002',
        name: 'Sarah Johnson',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&q=90'
      },
      failureReason: 'Customer not available'
    }
  ],
  selectedTask: null
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setSelectedTask: (state, action: PayloadAction<Task | null>) => {
      state.selectedTask = action.payload;
    },
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
    },
    updateTask: (state, action: PayloadAction<Partial<Task> & { id: string }>) => {
      const index = state.tasks.findIndex(task => task.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = { ...state.tasks[index], ...action.payload };
      }
    },
    removeTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
    }
  }
});

export const { setSelectedTask, addTask, updateTask, removeTask } = tasksSlice.actions;
export default tasksSlice.reducer; 