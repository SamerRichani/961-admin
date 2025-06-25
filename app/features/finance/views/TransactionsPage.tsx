"use client"

import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { TransactionFilters } from '@/app/features/finance/components/TransactionsPage/TransactionFilters';
import { TransactionTable } from '@/app/features/finance/components/TransactionsPage/TransactionTable';
import { useMemo, useEffect, useState } from 'react';
import { setTransactions } from '@/app/features/finance/redux/transactionsSlice';
import { useToast } from '@/hooks/use-toast';
import { RootState } from '@/redux/store';

export function TransactionsPage() {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const { transactions, search, selectedTypes, dateRange } = useAppSelector((state: RootState) => state.transactions);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/finance/transactions`)
      .then(res => res.json())
      .then(data => {
        dispatch(setTransactions(data));
        setError(null);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Error fetching transactions');
      })
      .finally(() => setIsLoading(false));
  }, [dispatch]);

  const filteredTransactions = useMemo(() => 
    transactions.filter(transaction => {
      const matchesSearch = 
        transaction.reference?.toLowerCase().includes(search.toLowerCase()) ||
        transaction.description?.toLowerCase().includes(search.toLowerCase()) ||
        transaction.sourceWallet?.entityName.toLowerCase().includes(search.toLowerCase()) ||
        transaction.destinationWallet?.entityName.toLowerCase().includes(search.toLowerCase());

      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(transaction.type);

      // Date range filtering
      const transactionDate = new Date(transaction.date);
      const now = new Date();
      
      // Create fresh date objects for each range calculation
      const startOfDay = new Date(now);
      startOfDay.setUTCHours(0, 0, 0, 0);
      
      const startOfWeek = new Date(now);
      startOfWeek.setUTCDate(now.getUTCDate() - now.getUTCDay());
      startOfWeek.setUTCHours(0, 0, 0, 0);
      
      const startOfMonth = new Date(now.getUTCFullYear(), now.getUTCMonth(), 1);
      startOfMonth.setUTCHours(0, 0, 0, 0);
      
      const startOfYear = new Date(now.getUTCFullYear(), 0, 1);
      startOfYear.setUTCHours(0, 0, 0, 0);

      let matchesDateRange = true;
      switch (dateRange) {
        case 'today':
          matchesDateRange = transactionDate.getTime() >= startOfDay.getTime();
          break;
        case 'week':
          matchesDateRange = transactionDate.getTime() >= startOfWeek.getTime();
          break;
        case 'month':
          matchesDateRange = transactionDate.getTime() >= startOfMonth.getTime();
          break;
        case 'year':
          matchesDateRange = transactionDate.getTime() >= startOfYear.getTime();
          break;
        case 'all':
        default:
          matchesDateRange = true;
      }

      return matchesSearch && matchesType && matchesDateRange;
    }),
    [transactions, search, selectedTypes, dateRange]
  );

  const handleExport = () => {
    const headers = [
      "Date",
      "Type",
      "Amount",
      "Description",
      "Reference",
      "Status",
      "Source Wallet",
      "Destination Wallet",
      "Source Balance",
      "Destination Balance"
    ];

    const formatStatus = (status: string) => {
      return status.split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    };

    const formatType = (type: string) => {
      return type.charAt(0).toUpperCase() + type.slice(1);
    };

    const formatDate = (date: string) => {
      return new Date(date).toLocaleDateString();
    };

    const formatMoney = (amount: number) => {
      return `$${amount.toFixed(2)}`;
    };

    const csvContent = [
      headers.join(","),
      ...filteredTransactions.map((transaction) =>
        [
          formatDate(transaction.date),
          formatType(transaction.type),
          formatMoney(transaction.amount),
          `"${transaction.description || ''}"`,
          `"${transaction.reference || ''}"`,
          formatStatus(transaction.status),
          `"${transaction.sourceWallet?.entityName || ''}"`,
          `"${transaction.destinationWallet?.entityName || ''}"`,
          formatMoney(transaction.sourceWallet?.balance || 0),
          formatMoney(transaction.destinationWallet?.balance || 0)
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "transactions_analytics.csv";
    link.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-[2000px] mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <h1 className="text-2xl font-semibold">Transactions</h1>
          <Button onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="p-4 sm:p-6 border-b">
            <TransactionFilters />
          </div>

          <div className="overflow-x-auto">
            {isLoading && <div className="flex items-center justify-center py-8"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF0000]"></div><span className="ml-4 text-[#FF0000] text-lg font-semibold">Loading...</span></div>}
            {error && <div className="text-red-500">{error}</div>}
            {!isLoading && !error && (
              <TransactionTable transactions={filteredTransactions} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}