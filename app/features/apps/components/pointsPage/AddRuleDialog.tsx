"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setIsDialogOpen, setNewRule, addEarningRule, resetNewRule } from "@/app/features/apps/redux/pointsSlice";
import { EarningRule } from "@/app/features/apps/types";

interface AddRuleDialogProps {
  onCreateRule: (rule: Omit<EarningRule, 'id'>) => Promise<EarningRule>;
}

export function AddRuleDialog({ onCreateRule }: AddRuleDialogProps) {
  const dispatch = useAppDispatch();
  const { isDialogOpen, newRule } = useAppSelector((state) => state.points);

  const handleAddRule = async () => {
    if (newRule.action && newRule.points && newRule.category) {
      try {
        const ruleToCreate = {
          action: newRule.action,
          points: newRule.points,
          category: newRule.category,
          enabled: true,
        };
        
        await onCreateRule(ruleToCreate);
        dispatch(setIsDialogOpen(false));
        dispatch(resetNewRule());
      } catch (error) {
        // Error is handled by the API function
      }
    }
  };

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={(open) => dispatch(setIsDialogOpen(open))}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Rule</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Category</Label>
            <select
              className="w-full h-10 px-3 py-2 rounded-md border"
              value={newRule.category}
              onChange={(e) =>
                dispatch(
                  setNewRule({
                    ...newRule,
                    category: e.target.value as typeof newRule.category,
                  })
                )
              }
            >
              <option value="deals">Deals</option>
              <option value="merch">Merch</option>
              <option value="blood">Blood</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label>Action Name</Label>
            <Input
              value={newRule.action}
              onChange={(e) =>
                dispatch(
                  setNewRule({
                    ...newRule,
                    action: e.target.value,
                  })
                )
              }
              placeholder="e.g., Deal Review"
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label>Points</Label>
            <Input
              type="number"
              value={newRule.points}
              onChange={(e) =>
                dispatch(
                  setNewRule({
                    ...newRule,
                    points: parseInt(e.target.value),
                  })
                )
              }
              min={0}
              className="w-full"
            />
          </div>
        </div>
        <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => {
              dispatch(setIsDialogOpen(false));
              dispatch(resetNewRule());
            }}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddRule}
            className="bg-[#FF0000] hover:bg-[#CC0000] w-full sm:w-auto"
            disabled={!newRule.action || !newRule.points || !newRule.category}
          >
            Add Rule
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 