import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  addNewPollOption,
  resetNewPoll,
  setNewPollQuestion,
  updateNewPollOption,
} from "@/app/features/investor/redux/pollsSlice";

interface CreatePollDialogProps {
  onCreate: (endDate: string) => void;
}

export function CreatePollDialog({ onCreate }: CreatePollDialogProps) {
  const dispatch = useDispatch();
  const { newPoll } = useSelector((state: RootState) => state.polls);

  const handleAddOption = () => {
    dispatch(addNewPollOption());
  };

  const handleUpdateOption = (index: number, value: string) => {
    dispatch(updateNewPollOption({ index, value }));
  };

  const handleCreate = () => {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7); // Set to 7 days from now
    onCreate(endDate.toISOString());
    dispatch(resetNewPoll());
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Poll
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Poll</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div>
            <Label htmlFor="question">Question</Label>
            <Input
              id="question"
              value={newPoll.question}
              onChange={(e) => dispatch(setNewPollQuestion(e.target.value))}
              placeholder="Enter your question..."
            />
          </div>
          <div>
            <Label>Options</Label>
            <div className="space-y-2">
              {newPoll.options.map((option, index) => (
                <Input
                  key={index}
                  value={option}
                  onChange={(e) => handleUpdateOption(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                />
              ))}
              <Button type="button" variant="outline" onClick={handleAddOption}>
                <Plus className="h-4 w-4 mr-2" />
                Add Option
              </Button>
            </div>
          </div>
          <p className="text-sm text-gray-500">Poll will run for 7 days</p>
          <DialogFooter>
            <Button
              onClick={handleCreate}
              disabled={!newPoll.question || newPoll.options.some(opt => !opt)}
            >
              Create Poll
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
} 