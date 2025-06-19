import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Coins, DollarSign } from "lucide-react";
import { CoinPackage } from "@/app/features/apps/types";
import { useAppDispatch } from "@/redux/hooks";
import {
  setEditingPackage,
  setNewPackage,
  setIsDialogOpen,
} from "@/app/features/apps/redux/coinsSlice";

interface PackageListProps {
  packages: CoinPackage[];
  onDelete: (id: string) => void;
}

export function PackageList({ packages, onDelete }: PackageListProps) {
  const dispatch = useAppDispatch();

  return (
    <Card className="p-4 sm:p-6">
      <h2 className="text-lg font-semibold mb-4 sm:mb-6">
        Predefined Packages
      </h2>
      <div className="space-y-3 sm:space-y-4">
        {packages.map((package_) => (
          <div
            key={package_._id}
            className="p-3 sm:p-4 bg-gray-50 rounded-lg relative overflow-hidden"
          >
            {(package_.isPopular || package_.isBestValue) && (
              <div
                className={`absolute top-0 right-0 px-2 sm:px-3 py-1 text-xs font-medium text-white ${
                  package_.isPopular ? "bg-blue-500" : "bg-green-500"
                }`}
              >
                {package_.isPopular ? "Popular" : "Best Value"}
              </div>
            )}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium mb-1">{package_.name}</h3>
                <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                  {package_.description}
                </p>
                <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                  <div className="flex items-center gap-1">
                    <Coins className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                    <span className="font-medium">
                      {package_.coins.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="font-medium">
                      ${package_.price.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:flex-shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    dispatch(setEditingPackage(package_));
                    dispatch(setNewPackage(package_));
                    dispatch(setIsDialogOpen(true));
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(package_._id)}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
} 