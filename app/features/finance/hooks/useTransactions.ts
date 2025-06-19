"use client";

import { useState, useMemo } from "react";
import {
  type Transaction,
  type TransactionType,
} from "@/app/features/finance/type";

interface UseTransactionsProps {
  transactions: Transaction[];
}

export function useTransactions({ transactions }: UseTransactionsProps) {
  const [search, setSearch] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<TransactionType[]>([]);
  const [dateRange, setDateRange] = useState("all");

  const filteredTransactions = useMemo(
    () =>
      transactions.filter((transaction) => {
        const matchesSearch =
          transaction.reference?.toLowerCase().includes(search.toLowerCase()) ||
          transaction.description?.toLowerCase().includes(search.toLowerCase());

        const matchesType =
          selectedTypes.length === 0 ||
          selectedTypes.includes(transaction.type);

        // TODO: Add date range filtering
        return matchesSearch && matchesType;
      }),
    [transactions, search, selectedTypes]
  );

  const stats = useMemo(() => {
    const total = filteredTransactions.reduce(
      (acc, trx) => acc + trx.amount,
      0
    );
    const completed = filteredTransactions.filter(
      (t) => t.status === "completed"
    ).length;
    const pending = filteredTransactions.filter(
      (t) => t.status === "pending"
    ).length;

    return { total, completed, pending };
  }, [filteredTransactions]);

  return {
    search,
    setSearch,
    selectedTypes,
    setSelectedTypes,
    dateRange,
    setDateRange,
    filteredTransactions,
    stats,
  };
}
