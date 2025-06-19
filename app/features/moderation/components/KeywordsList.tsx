"use client"

import { type BlockedKeyword } from '@/app/features/moderation/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { useState } from 'react';
import { useAppDispatch } from '@/redux/hooks';
import { toggleKeyword, deleteKeyword, openKeywordDialog } from '@/app/features/moderation/redux/moderationSlice';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface KeywordsListProps {
  keywords: BlockedKeyword[];
  search: string;
}

const severityColors = {
  low: { bg: 'bg-yellow-50', text: 'text-yellow-700' },
  medium: { bg: 'bg-orange-50', text: 'text-orange-700' },
  high: { bg: 'bg-red-50', text: 'text-red-700' },
};

const actionColors = {
  flag: { bg: 'bg-yellow-50', text: 'text-yellow-700' },
  block: { bg: 'bg-red-50', text: 'text-red-700' },
  review: { bg: 'bg-blue-50', text: 'text-blue-700' },
};

export function KeywordsList({ keywords, search }: KeywordsListProps) {
  const dispatch = useAppDispatch();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [keywordToDelete, setKeywordToDelete] = useState<BlockedKeyword | null>(null);

  const filteredKeywords = keywords.filter(keyword =>
    keyword.pattern.toLowerCase().includes(search.toLowerCase()) ||
    keyword.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (keyword: BlockedKeyword) => {
    dispatch(openKeywordDialog(keyword));
  };

  const handleDelete = (keyword: BlockedKeyword) => {
    setKeywordToDelete(keyword);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (keywordToDelete) {
      dispatch(deleteKeyword(keywordToDelete.id));
      setDeleteDialogOpen(false);
      setKeywordToDelete(null);
    }
  };

  return (
    <div className="space-y-4">
      {filteredKeywords.map((keyword) => (
        <Card key={keyword.id} className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-4 sm:gap-6">
              <Switch
                checked={keyword.active}
                onCheckedChange={(checked: boolean) => dispatch(toggleKeyword({ id: keyword.id, active: checked }))}
                className="mt-1 sm:mt-0"
              />
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                  <h3 className="font-medium text-sm sm:text-base">{keyword.pattern}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${severityColors[keyword.severity].bg} ${severityColors[keyword.severity].text}`}>
                    {keyword.severity}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${actionColors[keyword.action].bg} ${actionColors[keyword.action].text}`}>
                    {keyword.action}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
                  <span>{keyword.category}</span>
                  <span className="hidden sm:inline">•</span>
                  <span>Added {format(new Date(keyword.createdAt), 'MMM d, yyyy')}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleEdit(keyword)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => handleDelete(keyword)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Keyword</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this keyword? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}