"use client";

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

interface DeleteContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  contentTitle?: string;
}

export function DeleteContentModal({
  isOpen,
  onClose,
  onConfirm,
  contentTitle,
}: DeleteContentModalProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to delete this content?</AlertDialogTitle>
          <AlertDialogDescription>
            {contentTitle && (
              <p className="font-medium mb-2">"{contentTitle}"</p>
            )}
            This action cannot be undone. This will permanently delete the content
            and remove it from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600 hover:bg-red-700"
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
} 