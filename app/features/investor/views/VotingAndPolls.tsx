"use client"

import { useCallback, useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Plus, Clock, Users, Check, Trash2, Edit, StopCircle, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Poll, PollOption } from '../types';
import {
  setPolls,
  setNewPollQuestion,
  addNewPollOption,
  updateNewPollOption,
  resetNewPoll,
  updatePollVotes,
} from '@/app/features/investor/redux/pollsSlice';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { InvestorTabs } from '@/app/features/investor/components/InvestorTabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { CreatePollDialog } from '../components/VotingAndPollsPage/CreatePollDialog';
import { DeletePollDialog } from '../components/VotingAndPollsPage/DeletePollDialog';
import { EditPollDialog } from '../components/VotingAndPollsPage/EditPollDialog';
import { EndPollDialog } from '../components/VotingAndPollsPage/EndPollDialog';
import { toast } from 'sonner';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const API_BASE_URL = 'http://localhost:3001/api/investor/polls';

export function Polls() {
  const dispatch = useDispatch();
  const { polls, newPoll } = useSelector((state: RootState) => state.polls);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [editingPoll, setEditingPoll] = useState<Poll | null>(null);

  // Check and update poll statuses
  const checkPollStatuses = useCallback((polls: Poll[]) => {
    const now = new Date();
    return polls.map(poll => {
      const endDate = new Date(poll.endDate);
      if (endDate < now && poll.status === 'active') {
        return { ...poll, status: 'ended' as const };
      }
      return poll;
    });
  }, []);

  // Fetch all polls
  const fetchPolls = useCallback(async () => {
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch polls');
      }
      const data = await response.json();
      const updatedPolls = checkPollStatuses(data);
      dispatch(setPolls(updatedPolls));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'An error occurred while fetching polls');
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, checkPollStatuses]);

  useEffect(() => {
    fetchPolls();
    // Check poll statuses every minute
    const interval = setInterval(() => {
      const updatedPolls = checkPollStatuses(polls);
      // Only dispatch if there are actual changes
      const hasChanges = updatedPolls.some((poll, index) => 
        poll.status !== polls[index].status
      );
      if (hasChanges) {
        dispatch(setPolls(updatedPolls));
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [fetchPolls, checkPollStatuses, dispatch]);

  // Create a new poll
  const handleCreatePoll = useCallback(async (endDate: string) => {
    if (!newPoll.question || newPoll.options.some(opt => !opt)) return;

    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: newPoll.question,
          options: newPoll.options,
          totalInvestors: 500,
          endDate,
          status: 'active',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create poll');
      }

      const newPollData = await response.json();
      dispatch(setPolls([newPollData, ...polls]));
      dispatch(resetNewPoll());
      toast.success('Poll created successfully');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create poll');
    }
  }, [dispatch, newPoll, polls]);

  // Update a poll
  const handleUpdatePoll = useCallback(async (pollId: string, updatedData: Partial<Poll>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${pollId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update poll');
      }

      const updatedPoll = await response.json();
      dispatch(setPolls(polls.map(p => p._id === pollId ? updatedPoll : p)));
      toast.success('Poll updated successfully');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update poll');
      throw err; // Re-throw to prevent dialog from closing
    }
  }, [dispatch, polls]);

  // Delete a poll
  const handleDeletePoll = useCallback(async (pollId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${pollId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete poll');
      }

      dispatch(setPolls(polls.filter(p => p._id !== pollId)));
      toast.success('Poll deleted successfully');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete poll');
    }
  }, [dispatch, polls]);

  // End a poll early
  const handleEndPoll = useCallback(async (pollId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${pollId}/end`, {
        method: 'POST',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to end poll');
      }

      const data = await response.json();
      // Update the poll with the new data from the response
      const updatedPoll = data.poll;
      dispatch(setPolls(polls.map(p => p._id === pollId ? updatedPoll : p)));
      toast.success('Poll ended successfully');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to end poll');
    }
  }, [dispatch, polls]);

  // Vote on a poll
  const handleVote = useCallback(async (pollId: string, optionId: string) => {
    try {
      const poll = polls.find(p => p._id === pollId);
      if (!poll || poll.status === 'ended') {
        throw new Error('Cannot vote on an ended poll');
      }

      const response = await fetch(`${API_BASE_URL}/${pollId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ optionId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to vote');
      }

      const updatedPoll = await response.json();
      dispatch(updatePollVotes({ pollId, optionId }));
      toast.success('Vote recorded successfully');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to vote');
    }
  }, [dispatch, polls]);

  const handleAddOption = useCallback(() => {
    dispatch(addNewPollOption());
  }, [dispatch]);

  const handleUpdateOption = useCallback((index: number, value: string) => {
    dispatch(updateNewPollOption({ index, value }));
  }, [dispatch]);

  if (isLoading) {
    return (
      <InvestorTabs search={search} onSearchChange={setSearch}>
        <div className="max-w-4xl mx-auto mt-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        </div>
      </InvestorTabs>
    );
  }

  return (
    <InvestorTabs search={search} onSearchChange={setSearch}>
      <div className="max-w-4xl mx-auto mt-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Polls</h2>
          <CreatePollDialog onCreate={handleCreatePoll} />
        </div>

        <div className="space-y-6">
          {polls.map((poll) => (
            <Card key={poll._id} className={cn(
              "p-4 sm:p-6",
              poll.status === 'ended' && "bg-slate-50/50 border-slate-200"
            )}>
              <div className="mb-4 sm:mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                  <h3 className={cn(
                    "text-lg sm:text-xl font-semibold",
                    poll.status === 'ended' && "text-slate-500"
                  )}>{poll.question}</h3>
                  <div className="flex gap-2">
                    {poll.status === 'active' && (
                      <>
                        <TooltipProvider delayDuration={200}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div>
                                <EndPollDialog onEnd={() => handleEndPoll(poll._id)} />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>End Poll Early</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider delayDuration={200}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setEditingPoll(poll)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Edit Poll</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider delayDuration={200}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div>
                                <DeletePollDialog onDelete={() => handleDeletePoll(poll._id)} />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Delete Poll</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </>
                    )}
                    {poll.status === 'ended' && (
                      <div className="px-2 sm:px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs sm:text-sm font-medium border border-slate-200">
                        Poll Ended
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 sm:gap-6 text-xs sm:text-sm text-slate-500 mt-2 sm:mt-0">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                    Created {new Date(poll.createdAt).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                    {poll.status === 'ended' ? 'Ended' : `Ends ${new Date(poll.endDate).toLocaleDateString()}`}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                    {poll.totalVotes} votes ({((poll.totalVotes / poll.totalInvestors) * 100).toFixed(1)}% turnout)
                  </span>
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {poll.options.map((option) => {
                  const percentage = poll.totalVotes > 0 ? (option.votes / poll.totalVotes) * 100 : 0;
                  const isLeading = option.votes === Math.max(...poll.options.map(o => o.votes));
                  return (
                    <div
                      key={option._id} 
                      className={cn(
                        "p-3 sm:p-4 rounded-lg transition-colors",
                        isLeading ? "bg-slate-50" : "bg-slate-50/50",
                        poll.status === 'ended' && "opacity-80"
                      )}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm sm:text-base">{option.text}</span>
                          {isLeading && <Check className="h-3 w-3 sm:h-4 sm:w-4 text-slate-600" />}
                        </div>
                        <span className="font-medium text-sm sm:text-base">
                          {option.votes} votes ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <Progress
                        value={percentage} 
                        className={cn(
                          "h-1.5 sm:h-2",
                          isLeading ? "bg-slate-200" : "bg-slate-100",
                          poll.status === 'ended' && "opacity-80"
                        )}
                      />
                      {poll.status === 'active' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-2 text-xs sm:text-sm"
                          onClick={() => handleVote(poll._id, option._id)}
                        >
                          Vote
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>
          ))}
        </div>

        {editingPoll && (
          <EditPollDialog
            poll={editingPoll}
            onClose={() => setEditingPoll(null)}
            onSave={async (updatedPoll) => {
              try {
                await handleUpdatePoll(updatedPoll._id, updatedPoll);
                setEditingPoll(null);
              } catch (err) {
                // Error is already handled in handleUpdatePoll
                // Dialog stays open
              }
            }}
          />
        )}
      </div>
    </InvestorTabs>
  );
}