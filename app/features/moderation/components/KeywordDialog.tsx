"use client"

import { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { type BlockedKeyword } from '@/app/features/moderation/types';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { 
  addKeyword, 
  updateKeyword, 
  closeKeywordDialog, 
  updateKeywordForm
} from '@/app/features/moderation/redux/moderationSlice';

export function KeywordDialog() {
  const dispatch = useAppDispatch();
  const { isOpen, form, editingKeyword } = useAppSelector((state) => state.moderation.keywordDialog);

  useEffect(() => {
    if (isOpen && editingKeyword) {
      dispatch(updateKeywordForm({
        pattern: editingKeyword.pattern,
        category: editingKeyword.category,
        severity: editingKeyword.severity,
        action: editingKeyword.action
      }));
    }
  }, [isOpen, editingKeyword, dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      pattern: form.pattern,
      category: form.category,
      severity: form.severity,
      action: form.action,
      active: true,
    };

    if (editingKeyword) {
      dispatch(updateKeyword({ id: editingKeyword.id, updates: data }));
    } else {
      const newKeyword: BlockedKeyword = {
        id: `KW${Math.random().toString(36).substr(2, 9)}`,
        createdBy: 'USR005',
        createdAt: new Date().toISOString(),
        ...data,
      } as BlockedKeyword;
      dispatch(addKeyword(newKeyword));
    }
    dispatch(closeKeywordDialog());
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && dispatch(closeKeywordDialog())}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editingKeyword ? 'Edit Keyword' : 'Add Keyword'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div>
            <Label htmlFor="pattern">Pattern</Label>
            <Input
              id="pattern"
              value={form.pattern}
              onChange={(e) => dispatch(updateKeywordForm({ pattern: e.target.value }))}
              placeholder="Enter keyword or pattern"
              required
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={form.category}
              onChange={(e) => dispatch(updateKeywordForm({ category: e.target.value }))}
              placeholder="e.g., Profanity, Hate Speech, etc."
              required
            />
          </div>

          <div>
            <Label htmlFor="severity">Severity</Label>
            <Select 
              value={form.severity} 
              onValueChange={(value: 'low' | 'medium' | 'high') => 
                dispatch(updateKeywordForm({ severity: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="action">Action</Label>
            <Select 
              value={form.action} 
              onValueChange={(value: 'flag' | 'block' | 'review') => 
                dispatch(updateKeywordForm({ action: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="flag">Flag for Review</SelectItem>
                <SelectItem value="block">Block Content</SelectItem>
                <SelectItem value="review">Require Review</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => dispatch(closeKeywordDialog())}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-[#FF0000] hover:bg-[#CC0000]">
              {editingKeyword ? 'Save Changes' : 'Add Keyword'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}