import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Poll, PollsState } from '../types';

const initialState: PollsState = {
  polls: [],
  newPoll: {
    question: '',
    options: ['', ''],
  },
};

export const pollsSlice = createSlice({
  name: 'polls',
  initialState,
  reducers: {
    setPolls: (state, action: PayloadAction<Poll[]>) => {
      state.polls = action.payload;
    },
    addPoll: (state, action: PayloadAction<Poll>) => {
      state.polls.unshift(action.payload);
    },
    updatePollVotes: (state, action: PayloadAction<{ pollId: string; optionId: string }>) => {
      const poll = state.polls.find(p => p._id === action.payload.pollId);
      if (poll) {
        const option = poll.options.find(o => o._id === action.payload.optionId);
        if (option) {
          option.votes += 1;
          poll.totalVotes += 1;
        }
      }
    },
    setNewPollQuestion: (state, action: PayloadAction<string>) => {
      state.newPoll.question = action.payload;
    },
    setNewPollOptions: (state, action: PayloadAction<string[]>) => {
      state.newPoll.options = action.payload;
    },
    addNewPollOption: (state) => {
      state.newPoll.options.push('');
    },
    updateNewPollOption: (state, action: PayloadAction<{ index: number; value: string }>) => {
      state.newPoll.options[action.payload.index] = action.payload.value;
    },
    resetNewPoll: (state) => {
      state.newPoll = {
        question: '',
        options: ['', ''],
      };
    },
  },
});

export const {
  setPolls,
  addPoll,
  updatePollVotes,
  setNewPollQuestion,
  setNewPollOptions,
  addNewPollOption,
  updateNewPollOption,
  resetNewPoll,
} = pollsSlice.actions;

export default pollsSlice.reducer; 