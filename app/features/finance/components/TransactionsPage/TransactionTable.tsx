import { memo } from "react";
import { type Transaction } from "@/app/features/finance/type";
import { transactionConfig } from "@/app/features/finance/type";
import { format } from "date-fns";
import { formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TransactionTableProps {
  transactions: Transaction[];
}

export const TransactionTable = memo(function TransactionTable({
  transactions,
}: TransactionTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Reference</TableHead>
          <TableHead>Type</TableHead>
          <TableHead className="hidden sm:table-cell">Description</TableHead>
          <TableHead className="hidden sm:table-cell">Source</TableHead>
          <TableHead className="hidden sm:table-cell">Destination</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => {
          const config = transactionConfig[transaction.type];
          const Icon = config.icon;

          return (
            <TableRow key={transaction.id}>
              <TableCell className="whitespace-nowrap">
                {format(new Date(transaction.date), "MMM d, h:mm a")}
              </TableCell>
              <TableCell className="font-medium truncate max-w-[100px] sm:max-w-none">
                {transaction.reference}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className={cn("p-1 rounded shrink-0", config.color.bg)}>
                    <Icon className={cn("h-4 w-4", config.color.text)} />
                  </div>
                  <span className="hidden sm:inline">{config.label}</span>
                </div>
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <div className="max-w-xs truncate">
                  {transaction.description}
                </div>
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                {transaction.sourceWallet ? (
                  <div className="truncate max-w-[150px]">
                    {transaction.sourceWallet.entityName}
                    <div className="text-xs text-gray-500">
                      Balance: {formatMoney(transaction.sourceWallet.balance)}
                    </div>
                  </div>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                {transaction.destinationWallet ? (
                  <div className="truncate max-w-[150px]">
                    {transaction.destinationWallet.entityName}
                    <div className="text-xs text-gray-500">
                      Balance: {formatMoney(transaction.destinationWallet.balance)}
                    </div>
                  </div>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </TableCell>
              <TableCell>
                <span
                  className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap",
                    transaction.status === "completed" &&
                      "bg-green-50 text-green-700",
                    transaction.status === "pending" &&
                      "bg-yellow-50 text-yellow-700",
                    transaction.status === "failed" && "bg-red-50 text-red-700"
                  )}
                >
                  {transaction.status}
                </span>
              </TableCell>
              <TableCell className="text-right font-medium whitespace-nowrap">
                {formatMoney(transaction.amount)}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
});
