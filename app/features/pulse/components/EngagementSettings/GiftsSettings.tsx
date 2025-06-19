"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Gift as GiftIcon, Upload, X, Loader2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
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
  setGifts,
  setIsGiftDialogOpen,
  setEditingGift,
  setNewGift,
  resetNewGift,
} from "@/app/features/pulse/redux/engagementSettingsSlice";
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { Gift } from "@/app/features/pulse/type";

export default function GiftsSettings() {
  const dispatch = useDispatch();
  const { gifts, isGiftDialogOpen, editingGift, newGift } = useSelector(
    (state: RootState) => state.engagementSettings
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [giftToDelete, setGiftToDelete] = useState<Gift | null>(null);

  useEffect(() => {
    fetchGifts();
  }, []);

  const fetchGifts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pulse/engagement/`);
      if (!response.ok) {
        throw new Error('Failed to fetch gifts');
      }
      const data = await response.json();
      dispatch(setGifts(data.gifts));
    } catch (error) {
      console.error('Error fetching gifts:', error);
      toast.error('Failed to load gifts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGiftChange = async (updatedGifts: typeof gifts) => {
    try {
      setIsSaving(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pulse/engagement/gifts/${updatedGifts[0]._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          enabled: updatedGifts[0].enabled,
          price: updatedGifts[0].price,
          isLimited: updatedGifts[0].isLimited,
          endDate: updatedGifts[0].endDate,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update gift');
      }

      const updatedData = await response.json();
      dispatch(setGifts(updatedData.gifts));
      toast.success('Gift updated successfully');
    } catch (error) {
      console.error('Error updating gift:', error);
      toast.error('Failed to update gift');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddGift = async () => {
    try {
      setIsSaving(true);
      const giftData = {
        name: newGift.name || '',
        description: newGift.description || '',
        price: newGift.price || 0,
        isLimited: newGift.isLimited || false,
        endDate: newGift.endDate || null,
        image: newGift.image ? await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(newGift.image!);
        }) : null
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/pulse/engagement/gifts${editingGift ? `/${editingGift._id}` : ''}`,
        {
          method: editingGift ? 'PATCH' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(giftData),
        }
      );

      if (!response.ok) {
        throw new Error(editingGift ? 'Failed to update gift' : 'Failed to add gift');
      }

      const updatedData = await response.json();
      dispatch(setGifts(updatedData.gifts));
      dispatch(setIsGiftDialogOpen(false));
      dispatch(resetNewGift());
      toast.success(editingGift ? 'Gift updated successfully' : 'Gift added successfully');
    } catch (error) {
      console.error('Error saving gift:', error);
      toast.error(editingGift ? 'Failed to update gift' : 'Failed to add gift');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteGift = async (giftId: string) => {
    try {
      setIsSaving(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pulse/engagement/gifts/${giftId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete gift');
      }

      const updatedData = await response.json();
      dispatch(setGifts(updatedData.gifts));
      setGiftToDelete(null);
      toast.success('Gift deleted successfully');
    } catch (error) {
      console.error('Error deleting gift:', error);
      toast.error('Failed to delete gift');
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 sm:mb-8">
          <h3 className="text-lg font-semibold">Virtual Gifts</h3>
          <Button
            onClick={() => {
              dispatch(setEditingGift(null));
              dispatch(resetNewGift());
              dispatch(setIsGiftDialogOpen(true));
            }}
            className="bg-[#FF0000] hover:bg-[#CC0000] w-full sm:w-auto"
            disabled={isSaving}
          >
            <GiftIcon className="h-4 w-4 mr-2" />
            Add Gift
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {gifts.map((gift) => (
            <div
              key={gift._id}
              className="bg-gray-50 rounded-lg overflow-hidden"
            >
              <div className="aspect-square bg-gray-200 relative">
                {gift.imagePreview ? (
                  <img
                    src={gift.imagePreview}
                    alt={gift.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <GiftIcon className="h-12 w-12 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm sm:text-base">
                    {gift.name}
                  </h4>
                  <Switch
                    checked={gift.enabled}
                    onCheckedChange={(checked: boolean) => {
                      handleGiftChange([{ ...gift, enabled: checked }]);
                    }}
                    disabled={isSaving}
                  />
                </div>
                <p className="text-xs sm:text-sm text-gray-500 mb-3">
                  {gift.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">
                    {gift.price} coins
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        dispatch(setEditingGift(gift));
                        dispatch(setNewGift(gift));
                        dispatch(setIsGiftDialogOpen(true));
                      }}
                      disabled={isSaving}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setGiftToDelete(gift)}
                      disabled={isSaving}
                      className="bg-[#FF0000] hover:bg-[#CC0000]"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {gift.isLimited && gift.endDate && (
                  <p className="text-xs text-red-600 mt-2">
                    Limited until{" "}
                    {new Date(gift.endDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Dialog
        open={!!giftToDelete}
        onOpenChange={(open) => !open && setGiftToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Gift</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <p>Are you sure you want to delete "{giftToDelete?.name}"? This action cannot be undone.</p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setGiftToDelete(null)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => giftToDelete && handleDeleteGift(giftToDelete._id)}
              disabled={isSaving}
              className="bg-[#FF0000] hover:bg-[#CC0000]"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isGiftDialogOpen}
        onOpenChange={(open) => dispatch(setIsGiftDialogOpen(open))}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingGift ? "Edit Gift" : "Add New Gift"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Gift Name</Label>
              <Input
                value={newGift.name}
                onChange={(e) =>
                  dispatch(setNewGift({ name: e.target.value }))
                }
                placeholder="Enter gift name"
                disabled={isSaving}
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={newGift.description}
                onChange={(e) =>
                  dispatch(setNewGift({ description: e.target.value }))
                }
                placeholder="Describe the gift"
                disabled={isSaving}
              />
            </div>

            <div className="space-y-2">
              <Label>Gift Image</Label>
              <div
                className={cn(
                  "border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-[#FF0000] transition-colors",
                  newGift.image || newGift.imagePreview
                    ? "bg-gray-50"
                    : "bg-white"
                )}
                onClick={() =>
                  document.getElementById("gift-image-upload")?.click()
                }
              >
                {newGift.image || newGift.imagePreview ? (
                  <div className="relative">
                    <img
                      src={
                        newGift.imagePreview ||
                        (newGift.image &&
                          URL.createObjectURL(newGift.image))
                      }
                      alt="Preview"
                      className="max-h-48 mx-auto rounded"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch(
                          setNewGift({
                            image: undefined,
                            imagePreview: "",
                          })
                        );
                      }}
                      disabled={isSaving}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="py-4">
                    <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">
                      Click to upload image
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      PNG, JPG up to 2MB
                    </p>
                  </div>
                )}
                <Input
                  id="gift-image-upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      if (file.size > 2 * 1024 * 1024) {
                        alert("File size must be less than 2MB");
                        return;
                      }
                      dispatch(
                        setNewGift({
                          image: file,
                          imagePreview: URL.createObjectURL(file),
                        })
                      );
                    }
                  }}
                  disabled={isSaving}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Price (Coins)</Label>
              <Input
                type="number"
                value={newGift.price}
                onChange={(e) =>
                  dispatch(
                    setNewGift({ price: parseInt(e.target.value) })
                  )
                }
                min={1}
                disabled={isSaving}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Switch
                  checked={newGift.isLimited}
                  onCheckedChange={(checked: boolean) =>
                    dispatch(setNewGift({ isLimited: checked }))
                  }
                  disabled={isSaving}
                />
                <Label>Limited Time Gift</Label>
              </div>
              {newGift.isLimited && (
                <Input
                  type="date"
                  value={newGift.endDate}
                  onChange={(e) =>
                    dispatch(setNewGift({ endDate: e.target.value }))
                  }
                  className="w-40"
                  disabled={isSaving}
                />
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                dispatch(setIsGiftDialogOpen(false));
                dispatch(setEditingGift(null));
                dispatch(resetNewGift());
              }}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddGift}
              className="bg-[#FF0000] hover:bg-[#CC0000]"
              disabled={
                isSaving ||
                !newGift.name ||
                !newGift.description ||
                !newGift.price
              }
            >
              {editingGift ? "Save Changes" : "Add Gift"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
} 