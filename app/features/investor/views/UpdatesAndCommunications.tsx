"use client"

import { useCallback, useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { ImagePlus, Heart, Send, MessageSquare, Trash2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import {
  addUpdate,
  setNewUpdate,
  setSelectedImageUrl,
  addLike,
  resetNewUpdate,
  setUpdates,
  addComment,
  removeUpdate,
  deleteComment,
} from '@/app/features/investor/redux/updatesSlice';
import { Update, Comment } from '../types';
import { toast } from "sonner";
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const API_BASE_URL = 'http://localhost:3001/api/investor/updates';

export function UpdatesAndCommunications() {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { updates, newUpdate, selectedImageUrl } = useSelector((state: RootState) => state.updates);
  const [isLoading, setIsLoading] = useState(true);
  const [editingUpdate, setEditingUpdate] = useState<Update | null>(null);
  const [newComment, setNewComment] = useState<{ [key: string]: string }>({});
  const [showCommentInput, setShowCommentInput] = useState<{ [key: string]: boolean }>({});
  const [updateToDelete, setUpdateToDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}`);
        if (!response.ok) throw new Error('Failed to fetch updates');
        const data = await response.json();
        dispatch(setUpdates(data));
      } catch (error) {
        console.error('Error fetching updates:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load updates. Please try again later.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUpdates();
  }, [dispatch, toast]);

  const handlePost = useCallback(async () => {
    if (!newUpdate.trim()) return;

    try {
      const response = await fetch(`${API_BASE_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newUpdate,
          author: 'Anthony Kantara',
          imageUrl: selectedImageUrl || undefined
        }),
      });

      if (!response.ok) throw new Error('Failed to post update');
      const newUpdateData = await response.json();
      dispatch(addUpdate(newUpdateData));
      dispatch(resetNewUpdate());
      toast({
        title: "Success",
        description: "Your update has been posted successfully.",
      });
    } catch (error) {
      console.error('Error posting update:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to post update. Please try again.",
      });
    }
  }, [dispatch, newUpdate, selectedImageUrl, toast]);

  const handleLike = useCallback(async (updateId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${updateId}/like`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to like update');
      dispatch(addLike(updateId));
      toast({
        title: "Success",
        description: "Update liked successfully.",
      });
    } catch (error) {
      console.error('Error liking update:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to like update. Please try again.",
      });
    }
  }, [dispatch, toast]);

  const handleDelete = useCallback(async (updateId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${updateId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete update');
      const data = await response.json();
      dispatch(removeUpdate(updateId));
      toast({
        title: "Success",
        description: data.message || "Update deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting update:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete update. Please try again.",
      });
    }
  }, [dispatch, toast]);

  const handleAddComment = useCallback(async (updateId: string) => {
    if (!newComment[updateId]?.trim()) return;

    try {
      const response = await fetch(`${API_BASE_URL}/${updateId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          author: 'Anthony Kantara',
          content: newComment[updateId]
        }),
      });

      if (!response.ok) throw new Error('Failed to add comment');
      const commentData = await response.json();
      dispatch(addComment({ updateId, comment: commentData }));
      setNewComment(prev => ({ ...prev, [updateId]: '' }));
      setShowCommentInput(prev => ({ ...prev, [updateId]: false }));
      toast({
        title: "Success",
        description: "Comment added successfully.",
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add comment. Please try again.",
      });
    }
  }, [dispatch, newComment, toast]);

  const handleImageSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      dispatch(setSelectedImageUrl(imageUrl));
      toast({
        title: "Success",
        description: "Image selected successfully.",
      });
    }
  }, [dispatch, toast]);

  const handleDeleteComment = useCallback(async (updateId: string, commentId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${updateId}/comments/${commentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete comment');
      const data = await response.json();
      dispatch(deleteComment({ updateId, commentId }));
      toast({
        title: "Success",
        description: data.message || "Comment deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete comment. Please try again.",
      });
    }
  }, [dispatch, toast]);

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto mt-6">
        <div className="text-center">Loading updates...</div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-6">
      <Card className="p-6 mb-6">
        <Textarea
          placeholder="Share an update with investors..."
          value={newUpdate}
          onChange={(e) => dispatch(setNewUpdate(e.target.value))}
          className="mb-4"
          rows={4}
        />
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => document.getElementById('image-upload')?.click()}>
            <ImagePlus className="h-4 w-4 mr-2" />
            Add Image
            <Input
              id="image-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageSelect}
            />
          </Button>
          <Button onClick={handlePost} disabled={!newUpdate.trim()}>
            <Send className="h-4 w-4 mr-2" />
            Post Update
          </Button>
        </div>
        {selectedImageUrl && (
          <div className="mt-4">
            <img 
              src={selectedImageUrl} 
              alt="Selected" 
              className="max-w-full h-auto rounded-lg"
            />
          </div>
        )}
      </Card>

      <div className="space-y-6">
        {updates.map((update) => (
          <Card key={update.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-medium">{update.author}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(update.createdAt).toLocaleDateString()} at {new Date(update.createdAt).toLocaleTimeString()}
                </p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the update and all its comments.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDelete(update.id)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            <p className="mb-4 whitespace-pre-wrap">{update.content}</p>
            {update.imageUrl && (
              <div className="mb-4">
                <img 
                  src={update.imageUrl} 
                  alt="Update content" 
                  className="max-w-full h-auto rounded-lg"
                />
              </div>
            )}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleLike(update.id)}
                className="text-red-600"
              >
                <Heart className="h-4 w-4 mr-2" />
                {update.likes}
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowCommentInput(prev => ({ ...prev, [update.id]: true }))}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                {update.comments.length}
              </Button>
            </div>
            {showCommentInput[update.id] && (
              <div className="mt-4">
                <Textarea
                  placeholder="Write a comment..."
                  value={newComment[update.id] || ''}
                  onChange={(e) => setNewComment(prev => ({ ...prev, [update.id]: e.target.value }))}
                  className="mb-2"
                  rows={2}
                />
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCommentInput(prev => ({ ...prev, [update.id]: false }))}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleAddComment(update.id)}
                    disabled={!newComment[update.id]?.trim()}
                  >
                    Post Comment
                  </Button>
                </div>
              </div>
            )}
            {update.comments.length > 0 && (
              <div className="mt-4 pt-4 border-t space-y-4">
                {update.comments.map((comment) => (
                  <div key={comment.id} className="pl-4 border-l-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{comment.author}</span>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the comment.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteComment(update.id, comment.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm mt-1">{comment.content}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}