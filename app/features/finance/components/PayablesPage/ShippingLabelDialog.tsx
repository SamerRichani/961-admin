"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { type Payable } from "@/app/features/finance/type";
import { formatMoney } from "@/lib/format";
import { useState } from "react";

interface ShippingLabelDialogProps {
  payable: Payable;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPrint: () => void;
}

export function ShippingLabelDialog({
  payable,
  open,
  onOpenChange,
  onPrint,
}: ShippingLabelDialogProps) {
  const [hasPrinted, setHasPrinted] = useState(false);

  const handlePrint = () => {
    onPrint();
    setHasPrinted(true);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cash Delivery Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Amount:</span>
            <span className="text-2xl font-bold">
              {formatMoney(payable.amount)}
            </span>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={hasPrinted ? onPrint : handlePrint}
              className="bg-[#FF0000] hover:bg-[#CC0000]"
            >
              {hasPrinted ? "Mark as Ready" : "Print"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
