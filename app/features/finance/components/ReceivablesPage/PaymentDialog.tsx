"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Receivable } from "@/app/features/finance/type";
import { formatMoney } from "@/lib/format";

interface PaymentDialogProps {
  receivable: Receivable;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (receivableId: string, amount: number, status: string, collectorName: string) => void;
}

export function PaymentDialog({
  receivable,
  open,
  onOpenChange,
  onSubmit,
}: PaymentDialogProps) {
  const amountPaid = receivable.paymentHistory.reduce(
    (sum, payment) => sum + payment.amount,
    0
  );
  const [amount, setAmount] = useState(receivable.amount - amountPaid);
  const [collectorName, setCollectorName] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const newAmountPaid = receivable.paymentHistory.reduce(
      (sum, payment) => sum + payment.amount,
      0
    );
    setAmount(receivable.amount - newAmountPaid);
  }, [receivable]);

  useEffect(() => {
    if (!open) {
      setCollectorName("");
      setError(null);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) {
      setError("Amount must be greater than 0");
      return;
    }
    if (!collectorName) {
      setError("Collector name is required");
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/finance/receivables/${receivable.entityId}/payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          date: new Date().toISOString().split('T')[0],
          reference: `PAY-${Date.now()}`,
          collectorName,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to record payment');
      }

      const data = await response.json();
      onSubmit(receivable.id, amount, data.status, collectorName);
      onOpenChange(false);
    } catch (error) {
      setError("Failed to record payment. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Record Payment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-between text-sm mb-4">
            <span className="text-gray-500">Balance:</span>
            <span className="font-medium">
              {formatMoney(receivable.amount - amountPaid)}
            </span>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Payment Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => {
                setAmount(Number(e.target.value));
                setError(null);
              }}
              className={error ? "border-red-500" : ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="collector">Collector Name</Label>
            <Input
              id="collector"
              value={collectorName}
              onChange={(e) => {
                setCollectorName(e.target.value);
                setError(null);
              }}
              className={error ? "border-red-500" : ""}
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
          {amount > receivable.amount - amountPaid && (
            <p className="text-sm text-blue-500">
              Excess amount of{" "}
              {formatMoney(amount - (receivable.amount - amountPaid))} will be
              added as credit
            </p>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-[#FF0000] hover:bg-[#CC0000]">
              Record Payment
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
