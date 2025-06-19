"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  setEditingPackage,
  setIsDialogOpen,
  setNewPackage,
  resetNewPackage,
} from "@/app/features/apps/redux/coinsSlice";

interface AddEditPackageDialogProps {
  isOpen: boolean;
  onSave: () => void;
}

export function AddEditPackageDialog({ isOpen, onSave }: AddEditPackageDialogProps) {
  const dispatch = useAppDispatch();
  const { editingPackage, newPackage } = useAppSelector((state) => state.coins);

  const handleInputChange = (field: string, value: string | number | boolean) => {
    dispatch(setNewPackage({ ...newPackage, [field]: value }));
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          dispatch(setIsDialogOpen(false));
          dispatch(setEditingPackage(null));
          dispatch(resetNewPackage());
        }
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {editingPackage ? "Edit Package" : "Add New Package"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Package Name</Label>
            <Input
              id="name"
              value={newPackage.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="e.g., Starter Pack"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={newPackage.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Brief description of the package"
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="coins">Coins Amount</Label>
              <Input
                id="coins"
                type="number"
                value={newPackage.coins}
                onChange={(e) => handleInputChange("coins", parseInt(e.target.value))}
                min={1}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={newPackage.price}
                onChange={(e) => handleInputChange("price", parseFloat(e.target.value))}
                min={0.01}
                className="w-full"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="packageType"
                checked={newPackage.isPopular}
                onChange={() => {
                  dispatch(setNewPackage({
                    ...newPackage,
                    isPopular: true,
                    isBestValue: false
                  }));
                }}
              />
              <span>Mark as Popular</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="packageType"
                checked={newPackage.isBestValue}
                onChange={() => {
                  dispatch(setNewPackage({
                    ...newPackage,
                    isPopular: false,
                    isBestValue: true
                  }));
                }}
              />
              <span>Mark as Best Value</span>
            </label>
          </div>
        </div>
        <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => {
              dispatch(setIsDialogOpen(false));
              dispatch(setEditingPackage(null));
              dispatch(resetNewPackage());
            }}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            onClick={onSave}
            className="bg-[#FF0000] hover:bg-[#CC0000] w-full sm:w-auto"
            disabled={
              !newPackage.name ||
              !newPackage.description ||
              !newPackage.coins ||
              !newPackage.price
            }
          >
            {editingPackage ? "Save Changes" : "Add Package"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 