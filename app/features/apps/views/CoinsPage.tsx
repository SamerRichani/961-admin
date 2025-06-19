"use client";

import { Button } from "@/components/ui/button";
import { Plus, Coins } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  setIsDialogOpen,
  setEditingPackage,
  setNewPackage,
  setCustomAmount,
  updatePackage,
  addPackage,
  deletePackage,
  resetNewPackage,
  setPackages,
} from "@/app/features/apps/redux/coinsSlice";
import { useEffect, useCallback } from "react";
import { CustomAmount } from "@/app/features/apps/types";
import debounce from "lodash/debounce";
import { toast } from "sonner";
import { AddEditPackageDialog } from "../components/coinsPage/AddEditPackageDialog";
import { CustomAmountSettings } from "../components/coinsPage/CustomAmountSettings";
import { PackageList } from "../components/coinsPage/PackageList";

export function CoinsPage() {
  const dispatch = useAppDispatch();
  const { packages, customAmount, isDialogOpen, editingPackage, newPackage } =
    useAppSelector((state) => state.coins);

  useEffect(() => {
    const fetchCoinSettings = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/apps/coins`
        );
        const data = await response.json();
        if (!response.ok) {
          throw new Error(
            data.error || data.message || "Failed to fetch coin settings"
          );
        }
        const { packages, customAmount } = data;
        dispatch(setPackages(packages));
        dispatch(setCustomAmount(customAmount));
      } catch (error) {
        console.error("Error fetching coin settings:", error);
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to fetch coin settings"
        );
      }
    };

    fetchCoinSettings();
  }, [dispatch]);

  const handleSavePackage = async () => {
    try {
      if (editingPackage) {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/apps/coins/packages/${editingPackage._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newPackage),
          }
        );
        const data = await response.json();
        if (!response.ok) {
          throw new Error(
            data.error || data.message || "Failed to update package"
          );
        }
        dispatch(updatePackage({ id: editingPackage._id, updates: data.package }));
        toast.success("Package updated successfully");
      } else {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/apps/coins/packages`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newPackage),
          }
        );
        const data = await response.json();
        if (!response.ok) {
          throw new Error(
            data.error || data.message || "Failed to create package"
          );
        }
        dispatch(addPackage(data.package));
        toast.success("Package created successfully");
      }
      dispatch(setIsDialogOpen(false));
      dispatch(setEditingPackage(null));
      dispatch(resetNewPackage());
    } catch (error) {
      console.error("Error saving package:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save package"
      );
    }
  };

  const handleDeletePackage = async (id: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/apps/coins/packages/${id}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          data.error || data.message || "Failed to delete package"
        );
      }
      dispatch(deletePackage(id));
      toast.success("Package deleted successfully");
    } catch (error) {
      console.error("Error deleting package:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete package"
      );
    }
  };

  // Debounced function to update custom amount settings
  const debouncedUpdateCustomAmount = useCallback(
    debounce(async (updates: Partial<CustomAmount>) => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/apps/coins/settings/custom-amount`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updates),
          }
        );
        const data = await response.json();
        if (!response.ok) {
          throw new Error(
            data.error ||
              data.message ||
              "Failed to update custom amount settings"
          );
        }
        dispatch(setCustomAmount(data));
        toast.success("Custom amount settings updated");
      } catch (error) {
        console.error("Error updating custom amount:", error);
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to update custom amount settings"
        );
      }
    }, 1000),
    []
  );

  const handleCustomAmountChange = (updates: Partial<CustomAmount>) => {
    // Update local state immediately
    dispatch(setCustomAmount({ ...customAmount, ...updates }));
    // Debounce the API call
    debouncedUpdateCustomAmount(updates);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-[2000px] mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-2">
            <Coins className="h-6 sm:h-8 w-6 sm:w-8 text-[#FF0000]" />
            <h1 className="text-xl sm:text-2xl font-semibold">Coin Packages</h1>
          </div>
          <Button
            onClick={() => {
              dispatch(setEditingPackage(null));
              dispatch(setIsDialogOpen(true));
            }}
            className="bg-[#FF0000] hover:bg-[#CC0000] w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Package
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          <PackageList packages={packages} onDelete={handleDeletePackage} />
          <CustomAmountSettings
            customAmount={customAmount}
            onCustomAmountChange={handleCustomAmountChange}
          />
        </div>

        <AddEditPackageDialog isOpen={isDialogOpen} onSave={handleSavePackage} />
      </div>
    </div>
  );
}
