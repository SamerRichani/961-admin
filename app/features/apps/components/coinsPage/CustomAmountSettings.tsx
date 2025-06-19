import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DollarSign } from "lucide-react";
import { CustomAmount } from "@/app/features/apps/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface CustomAmountSettingsProps {
  customAmount: CustomAmount;
  onCustomAmountChange: (updates: Partial<CustomAmount>) => void;
}

export function CustomAmountSettings({
  customAmount,
  onCustomAmountChange,
}: CustomAmountSettingsProps) {
  const [calculatedValues, setCalculatedValues] = useState({
    hundred: 0,
    fiveHundred: 0,
    thousand: 0,
  });

  useEffect(() => {
    const pricePerCoin = customAmount.pricePerCoin || 0;
    setCalculatedValues({
      hundred: 100 * pricePerCoin,
      fiveHundred: 500 * pricePerCoin,
      thousand: 1000 * pricePerCoin,
    });
  }, [customAmount.pricePerCoin]);

  const handleMinAmountChange = (value: string) => {
    const newMin = parseInt(value);
    if (isNaN(newMin)) return;

    if (newMin > customAmount.maxAmount) {
      toast.error("Minimum amount cannot be greater than maximum amount");
      return;
    }

    if (newMin < 1) {
      toast.error("Minimum amount must be at least 1");
      return;
    }

    onCustomAmountChange({ minAmount: newMin });
  };

  const handleMaxAmountChange = (value: string) => {
    const newMax = parseInt(value);
    if (isNaN(newMax)) return;

    if (newMax < customAmount.minAmount) {
      toast.error("Maximum amount cannot be less than minimum amount");
      return;
    }

    onCustomAmountChange({ maxAmount: newMax });
  };

  const handlePricePerCoinChange = (value: string) => {
    const newPrice = parseFloat(value);
    if (isNaN(newPrice)) return;

    if (newPrice <= 0) {
      toast.error("Price per coin must be greater than 0");
      return;
    }

    onCustomAmountChange({ pricePerCoin: newPrice });
  };

  return (
    <Card className="p-4 sm:p-6">
      <h2 className="text-lg font-semibold mb-4 sm:mb-6">
        Custom Amount Settings
      </h2>
      <div className="space-y-4 sm:space-y-6">
        <div className="space-y-2">
          <Label>Price per Coin ($)</Label>
          <Input
            type="number"
            step="0.001"
            value={customAmount.pricePerCoin}
            onChange={(e) => handlePricePerCoinChange(e.target.value)}
            min={0.001}
            className="w-full"
          />
          <p className="text-sm text-gray-500">
            Base price for custom coin purchases
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Minimum Amount</Label>
            <Input
              type="number"
              value={customAmount.minAmount}
              onChange={(e) => handleMinAmountChange(e.target.value)}
              min={1}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label>Maximum Amount</Label>
            <Input
              type="number"
              value={customAmount.maxAmount}
              onChange={(e) => handleMaxAmountChange(e.target.value)}
              min={customAmount.minAmount}
              className="w-full"
            />
          </div>
        </div>

        <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-2">Example Calculation</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>100 coins</span>
              <span>${calculatedValues.hundred.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>500 coins</span>
              <span>${calculatedValues.fiveHundred.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>1000 coins</span>
              <span>${calculatedValues.thousand.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
} 