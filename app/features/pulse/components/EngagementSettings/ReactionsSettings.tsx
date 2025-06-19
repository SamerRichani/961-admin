"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus, Loader2, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  setReactions,
  setIsAddReactionOpen,
  setNewReaction,
} from "@/app/features/pulse/redux/engagementSettingsSlice";
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { Reaction } from "@/app/features/pulse/type";

export default function ReactionsSettings() {
  const dispatch = useDispatch();
  const { reactions, isAddReactionOpen, newReaction } = useSelector(
    (state: RootState) => state.engagementSettings
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);
  const [reactionToDelete, setReactionToDelete] = useState<Reaction | null>(null);

  useEffect(() => {
    fetchReactions();
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, []);

  const fetchReactions = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pulse/engagement/`);
      if (!response.ok) {
        throw new Error('Failed to fetch reactions');
      }
      const data = await response.json();
      dispatch(setReactions(data.reactions));
    } catch (error) {
      console.error('Error fetching reactions:', error);
      toast.error('Failed to load reactions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReactionChange = useCallback(async (updatedReactions: typeof reactions, isPriceChange: boolean = false) => {
    // Find the reaction that was changed
    const changedReaction = updatedReactions.find((r, index) => 
      r._id !== reactions[index]._id || 
      r.enabled !== reactions[index].enabled || 
      r.price !== reactions[index].price
    );

    if (!changedReaction) return;

    // Update Redux state immediately for responsive UI
    dispatch(setReactions(updatedReactions));

    // Clear any existing timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const updateReaction = async () => {
      try {
        setIsSaving(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pulse/engagement/reactions/${changedReaction._id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            enabled: changedReaction.enabled,
            price: changedReaction.price,
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to update reaction ${changedReaction._id}`);
        }

        const updatedData = await response.json();
        // Update with server response to ensure consistency
        dispatch(setReactions(updatedData.reactions));
        toast.success(isPriceChange ? 'Reaction price updated successfully' : 'Reaction updated successfully');
      } catch (error) {
        console.error('Error updating reaction:', error);
        // If API call fails, revert the changes
        dispatch(setReactions(reactions));
        toast.error('Failed to update reaction');
      } finally {
        setIsSaving(false);
      }
    };

    if (isPriceChange) {
      // For price changes, use debounce
      const timer = setTimeout(updateReaction, 1000);
      setDebounceTimer(timer);
    } else {
      // For toggling enabled/disabled, update immediately
      updateReaction();
    }
  }, [reactions, debounceTimer, dispatch]);

  const handleAddReaction = async () => {
    try {
      setIsSaving(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pulse/engagement/reactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emoji: newReaction.emoji,
          name: newReaction.name,
          isPaid: true,
          price: newReaction.price,
          enabled: true,
          isDefault: false,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add reaction');
      }

      const updatedData = await response.json();
      dispatch(setReactions(updatedData.reactions));
      dispatch(setIsAddReactionOpen(false));
      dispatch(setNewReaction({ emoji: '', name: '', price: 5 }));
      toast.success('Reaction added successfully');
    } catch (error) {
      console.error('Error adding reaction:', error);
      toast.error('Failed to add reaction');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteReaction = async (reactionId: string) => {
    try {
      setIsSaving(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pulse/engagement/reactions/${reactionId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete reaction');
      }

      const updatedData = await response.json();
      dispatch(setReactions(updatedData.reactions));
      setReactionToDelete(null);
      toast.success('Reaction deleted successfully');
    } catch (error) {
      console.error('Error deleting reaction:', error);
      toast.error('Failed to delete reaction');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="p-4 sm:p-6">
        <h3 className="text-lg font-semibold mb-4 sm:mb-6">Reaction Controls</h3>
        <div className="space-y-4 sm:space-y-6">
          <div>
            <h4 className="font-medium mb-4">Default Free Reactions</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {reactions
                .filter((r) => r.isDefault)
                .map((reaction) => (
                  <div
                    key={reaction._id}
                    className="p-3 sm:p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <span className="text-xl sm:text-2xl">
                          {reaction.emoji}
                        </span>
                        <span className="font-medium text-sm sm:text-base">
                          {reaction.name}
                        </span>
                      </div>
                      <Switch
                        checked={reaction.enabled}
                        onCheckedChange={(checked: boolean) => {
                          handleReactionChange(
                            reactions.map((r) =>
                              r._id === reaction._id
                                ? { ...r, enabled: checked }
                                : r
                            ),
                            false
                          );
                        }}
                        disabled={isSaving}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <h4 className="font-medium">Premium Reactions</h4>
              <Button
                onClick={() => dispatch(setIsAddReactionOpen(true))}
                className="bg-[#FF0000] hover:bg-[#CC0000] w-full sm:w-auto"
                disabled={isSaving}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Reaction
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
              {reactions
                .filter((r) => !r.isDefault)
                .map((reaction) => (
                  <div
                    key={reaction._id}
                    className="p-3 sm:p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{reaction.emoji}</span>
                        <span className="font-medium">{reaction.name}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setReactionToDelete(reaction)}
                          disabled={isSaving}
                          className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-transparent"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <Switch
                        checked={reaction.enabled}
                        onCheckedChange={(checked) => {
                          handleReactionChange(
                            reactions.map((r) =>
                              r._id === reaction._id ? { ...r, enabled: checked } : r
                            )
                          );
                        }}
                        disabled={isSaving}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Price (Coins)</Label>
                      <Input
                        type="number"
                        value={reaction.price}
                        onChange={(e) => {
                          handleReactionChange(
                            reactions.map((r) =>
                              r._id === reaction._id
                                ? {
                                    ...r,
                                    price: parseInt(e.target.value),
                                  }
                                : r
                            ),
                            true
                          );
                        }}
                        min={0}
                        disabled={isSaving}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </Card>

      <Dialog
        open={isAddReactionOpen}
        onOpenChange={(open) => dispatch(setIsAddReactionOpen(open))}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Reaction</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Emoji</Label>
              <Input
                value={newReaction.emoji}
                onChange={(e) =>
                  dispatch(setNewReaction({ emoji: e.target.value }))
                }
                placeholder="Enter emoji"
                disabled={isSaving}
              />
            </div>
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={newReaction.name}
                onChange={(e) =>
                  dispatch(setNewReaction({ name: e.target.value }))
                }
                placeholder="Reaction name"
                disabled={isSaving}
              />
            </div>
            <div className="space-y-2">
              <Label>Price (Coins)</Label>
              <Input
                type="number"
                value={newReaction.price}
                onChange={(e) =>
                  dispatch(
                    setNewReaction({ price: parseInt(e.target.value) })
                  )
                }
                min={1}
                disabled={isSaving}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                dispatch(setIsAddReactionOpen(false));
                dispatch(
                  setNewReaction({ emoji: "", name: "", price: 5 })
                );
              }}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddReaction}
              className="bg-[#FF0000] hover:bg-[#CC0000]"
              disabled={
                isSaving ||
                !newReaction.emoji ||
                !newReaction.name
              }
            >
              Add Reaction
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!reactionToDelete}
        onOpenChange={(open) => !open && setReactionToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Reaction</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <p>Are you sure you want to delete the "{reactionToDelete?.name}" reaction? This action cannot be undone.</p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setReactionToDelete(null)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => reactionToDelete && handleDeleteReaction(reactionToDelete._id)}
              disabled={isSaving}
              className="bg-[#FF0000] hover:bg-[#CC0000]"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
} 