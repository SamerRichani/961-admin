import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Poll, PollOption } from "../../types";
import { useState, useEffect } from "react";

interface EditPollDialogProps {
  poll: Poll;
  onClose: () => void;
  onSave: (poll: Poll) => void;
}

export function EditPollDialog({ poll, onClose, onSave }: EditPollDialogProps) {
  const [editedPoll, setEditedPoll] = useState<Poll>(poll);

  useEffect(() => {
    setEditedPoll(poll);
  }, [poll]);

  const handleOptionChange = (index: number, text: string) => {
    const newOptions = [...editedPoll.options];
    newOptions[index] = { 
      ...newOptions[index], 
      text,
      id: newOptions[index].id, // Preserve the original ID
      _id: newOptions[index]._id, // Preserve the original _id
      votes: newOptions[index].votes // Preserve the original votes
    };
    setEditedPoll({ ...editedPoll, options: newOptions });
  };

  const handleQuestionChange = (text: string) => {
    setEditedPoll({ 
      ...editedPoll, 
      question: text 
    });
  };

  const handleSave = () => {
    // Ensure we're sending the correct data structure
    const pollToSave = {
      ...editedPoll,
      options: editedPoll.options.map(option => ({
        _id: option._id,
        id: option.id,
        text: option.text,
        votes: option.votes
      }))
    };
    onSave(pollToSave);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Poll</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div>
            <Label htmlFor="edit-question">Question</Label>
            <Input
              id="edit-question"
              value={editedPoll.question}
              onChange={(e) => handleQuestionChange(e.target.value)}
            />
          </div>
          <div>
            <Label>Options</Label>
            <div className="space-y-2">
              {editedPoll.options.map((option: PollOption, index: number) => (
                <Input
                  key={option._id}
                  value={option.text}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                />
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
} 