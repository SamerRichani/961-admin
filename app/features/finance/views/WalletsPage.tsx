"use client"

import { useEffect, useCallback } from 'react';
import { Search, Download, Filter, Plus, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { type WalletType, type Wallet, type AdjustmentType, walletConfig } from '@/app/features/finance/type';
import { format } from 'date-fns';
import { formatMoney, formatNumber } from '@/lib/format';
import { cn } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  setSearch,
  setSelectedTypes,
  setSortField,
  setSortOrder,
  setSelectedWallet,
  setIsAdjustmentOpen,
  setAdjustmentType,
  setAdjustmentAmount,
  setAdjustmentReason,
  resetAdjustment,
  setWallets,
} from '@/app/features/finance/redux/walletsSlice';
import { useToast } from '@/hooks/use-toast';

interface AdjustmentDialogProps {
  wallet: Wallet;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (adjustment: { type: AdjustmentType; amount: number; reason: string }) => void;
}

function AdjustmentDialog({ wallet, open, onOpenChange, onSubmit }: AdjustmentDialogProps) {
  const dispatch = useAppDispatch();
  const { adjustment } = useAppSelector((state) => state.wallets);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      type: adjustment.type,
      amount: parseFloat(adjustment.amount),
      reason: adjustment.reason,
    });
    dispatch(resetAdjustment());
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adjust Wallet Balance</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="flex justify-between text-sm mb-4">
            <span className="text-gray-500">Current Balance:</span>
            <span className="font-medium">{formatMoney(wallet.balance)}</span>
          </div>

          <div className="space-y-2">
            <Label>Adjustment Type</Label>
            <Select 
              value={adjustment.type} 
              onValueChange={(value: AdjustmentType) => dispatch(setAdjustmentType(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="credit">Credit (Add)</SelectItem>
                <SelectItem value="debit">Debit (Subtract)</SelectItem>
                <SelectItem value="bonus">Bonus</SelectItem>
                <SelectItem value="penalty">Penalty</SelectItem>
                <SelectItem value="correction">Correction</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={adjustment.amount}
              onChange={(e) => dispatch(setAdjustmentAmount(e.target.value))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason</Label>
            <Textarea
              id="reason"
              value={adjustment.reason}
              onChange={(e) => dispatch(setAdjustmentReason(e.target.value))}
              placeholder="Explain the reason for this adjustment..."
              required
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="bg-[#FF0000] hover:bg-[#CC0000]"
              disabled={!adjustment.amount || !adjustment.reason}
            >
              Confirm Adjustment
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function WalletsPage() {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const {
    wallets,
    search,
    selectedTypes,
    sortField,
    sortOrder,
    selectedWallet,
    isAdjustmentOpen,
  } = useAppSelector((state) => state.wallets);

  useEffect(() => {
    const fetchWallets = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/finance/wallet`);
        const data = await response.json();
        
        if (Array.isArray(data)) {
          const transformedWallets = data.map((item: any) => ({
            id: item._id,
            type: item.type,
            entityId: item.entityId,
            entityName: item.entityName,
            balance: Number(item.balance) || 0,
            points: Number(item.points) || 0,
            coins: Number(item.coins) || 0,
            createdAt: item.createdAt,
            lastTransaction: item.lastTransaction,
            status: item.status,
            adjustments: item.adjustments?.map((adj: any) => ({
              id: adj._id,
              type: adj.type,
              amount: Number(adj.amount) || 0,
              reason: adj.reason,
              date: adj.date
            }))
          }));
          
          dispatch(setWallets(transformedWallets));
        }
      } catch (error) {
        console.error('Error fetching wallets:', error);
      }
    };

    fetchWallets();
  }, [dispatch]);

  const handleSort = (field: 'balance' | 'entityName' | 'lastTransaction') => {
    if (sortField === field) {
      dispatch(setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'));
    } else {
      dispatch(setSortField(field));
      dispatch(setSortOrder('desc'));
    }
  };

  const handleAdjustment = useCallback(async (adjustment: { type: AdjustmentType; amount: number; reason: string }) => {
    if (!selectedWallet) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/finance/wallet/${selectedWallet.entityId}/adjust-balance`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: adjustment.type,
            amount: adjustment.amount,
            reason: adjustment.reason
          })
        }
      );

      const result = await response.json();

      if (result.success) {
        // Update the wallet in Redux state with the new balance
        const updatedWallets = wallets.map(wallet => {
          if (wallet.entityId === result.data.walletId) {
            return {
              ...wallet,
              balance: result.data.newBalance,
              lastTransaction: new Date().toISOString(),
              adjustments: [
                ...(wallet.adjustments || []),
                {
                  id: crypto.randomUUID(),
                  type: result.data.adjustment.type,
                  amount: result.data.adjustment.amount,
                  reason: result.data.adjustment.reason,
                  date: result.data.adjustment.date
                }
              ]
            };
          }
          return wallet;
        });

        dispatch(setWallets(updatedWallets));
        dispatch(setIsAdjustmentOpen(false));
        dispatch(resetAdjustment());

        toast({
          title: "Balance Adjusted",
          description: `Successfully ${adjustment.type}ed ${formatMoney(adjustment.amount)} to ${selectedWallet.entityName}'s wallet.`,
          duration: 3000,
        });
      } else {
        toast({
          title: "Adjustment Failed",
          description: result.message || "Failed to adjust wallet balance",
          variant: "destructive",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Error adjusting wallet balance:', error);
      toast({
        title: "Error",
        description: "An error occurred while adjusting the wallet balance",
        variant: "destructive",
        duration: 3000,
      });
    }
  }, [selectedWallet, wallets, dispatch, toast]);

  const handleExport = () => {
    const headers = [
      "Entity Name",
      "Type",
      "Balance",
      "Points",
      "Coins",
      "Status",
      "Created At",
      "Last Transaction",
      "Adjustments"
    ];

    const formatType = (type: string) => {
      return type.charAt(0).toUpperCase() + type.slice(1);
    };

    const formatStatus = (status: string) => {
      return status.split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    };

    const formatDate = (date: string) => {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    };

    const formatAdjustments = (adjustments: any[] | undefined) => {
      if (!adjustments || adjustments.length === 0) return '';
      return adjustments.map(adj => 
        `${formatDate(adj.date)} | ${formatType(adj.type)} | ${formatMoney(adj.amount)} | ${adj.reason}`
      ).join('\n');
    };

    const filteredWallets = wallets.filter(wallet => {
      const matchesSearch = 
        wallet.entityName.toLowerCase().includes(search.toLowerCase());

      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(wallet.type);

      return matchesSearch && matchesType;
    }).sort((a, b) => {
      const direction = sortOrder === 'asc' ? 1 : -1;
      switch (sortField) {
        case 'balance':
          return direction * (a.balance - b.balance);
        case 'entityName':
          return direction * a.entityName.localeCompare(b.entityName);
        case 'lastTransaction':
          return direction * (new Date(a.lastTransaction).getTime() - new Date(b.lastTransaction).getTime());
        default:
          return 0;
      }
    });

    // Create CSV content with proper escaping and formatting
    const csvContent = [
      // Headers
      headers.map(header => `"${header}"`).join(','),
      // Data rows
      ...filteredWallets.map((wallet) => {
        const row = [
          wallet.entityName,
          formatType(wallet.type),
          formatMoney(wallet.balance),
          formatNumber(wallet.points),
          formatNumber(wallet.coins),
          formatStatus(wallet.status),
          formatDate(wallet.createdAt),
          formatDate(wallet.lastTransaction),
          formatAdjustments(wallet.adjustments)
        ];
        // Escape and quote fields that might contain commas or special characters
        return row.map(field => {
          if (field.includes(',') || field.includes('"') || field.includes('\n')) {
            return `"${field.replace(/"/g, '""')}"`;
          }
          return field;
        }).join(',');
      })
    ].join('\n');

    // Add BOM for Excel compatibility
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `wallets_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const filteredWallets = wallets
    .filter(wallet => {
      const matchesSearch = 
        wallet.entityName.toLowerCase().includes(search.toLowerCase());

      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(wallet.type);

      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      const direction = sortOrder === 'asc' ? 1 : -1;
      switch (sortField) {
        case 'balance':
          return direction * (a.balance - b.balance);
        case 'entityName':
          return direction * a.entityName.localeCompare(b.entityName);
        case 'lastTransaction':
          return direction * (
            new Date(a.lastTransaction || '').getTime() - 
            new Date(b.lastTransaction || '').getTime()
          );
        default:
          return 0;
      }
    });

  const totalBalance = filteredWallets.reduce((sum, w) => sum + w.balance, 0);
  const totalPoints = filteredWallets.reduce((sum, w) => sum + w.points, 0);
  const totalCoins = filteredWallets.reduce((sum, w) => sum + w.coins, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-[2000px] mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <h1 className="text-2xl font-semibold">Wallets</h1>
          <Button onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-gray-500">Total Balance</p>
                <p className="text-2xl font-bold truncate">{formatMoney(totalBalance)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-gray-500">Total Points</p>
                <p className="text-2xl font-bold truncate">{formatNumber(totalPoints)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                <DollarSign className="h-6 w-6 text-orange-600" />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-gray-500">Total Coins</p>
                <p className="text-2xl font-bold truncate">{formatNumber(totalCoins)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="p-4 sm:p-6 border-b">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1 max-w-sm w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search wallets..."
                  value={search}
                  onChange={(e) => dispatch(setSearch(e.target.value))}
                  className="pl-9 w-full"
                />
              </div>

              <div className="flex gap-4 sm:flex-none">
                <Select value={sortField} onValueChange={(value: any) => handleSort(value as typeof sortField)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="balance">Balance</SelectItem>
                    <SelectItem value="entityName">Name</SelectItem>
                    <SelectItem value="lastTransaction">Last Transaction</SelectItem>
                  </SelectContent>
                </Select>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-48">
                    {Object.entries(walletConfig).map(([type, config]) => (
                      <DropdownMenuCheckboxItem
                        key={type}
                        checked={selectedTypes.includes(type as WalletType)}
                        onCheckedChange={(checked: boolean) => {
                          dispatch(setSelectedTypes(
                            checked
                              ? [...selectedTypes, type as WalletType]
                              : selectedTypes.filter(t => t !== type)
                          ));
                        }}
                      >
                        <config.icon className="h-4 w-4 mr-2" />
                        {config.label}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Entity</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead className="hidden sm:table-cell">Points</TableHead>
                  <TableHead className="hidden sm:table-cell">Coins</TableHead>
                  <TableHead className="hidden sm:table-cell">Last Transaction</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWallets.map((wallet) => {
                  const config = walletConfig[wallet.type];
                  const Icon = config.icon;
                  
                  return (
                    <TableRow key={wallet.id}>
                      <TableCell>
                        <div className="font-medium truncate max-w-[150px] sm:max-w-none">
                          {wallet.entityName}
                        </div>
                        <div className="text-sm text-gray-500 truncate">
                          Created {format(new Date(wallet.createdAt), 'MMM d, yyyy')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            'p-1 rounded shrink-0',
                            config.color.bg
                          )}>
                            <Icon className={cn('h-4 w-4', config.color.text)} />
                          </div>
                          <span className="hidden sm:inline">{config.label}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium whitespace-nowrap">
                        {formatMoney(wallet.balance)}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {formatNumber(wallet.points)}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {formatNumber(wallet.coins)}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {wallet.lastTransaction
                          ? format(new Date(wallet.lastTransaction), 'MMM d, h:mm a')
                          : 'No transactions'}
                      </TableCell>
                      <TableCell>
                        <span className={cn(
                          'px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap',
                          wallet.status === 'active' && 'bg-green-50 text-green-700',
                          wallet.status === 'suspended' && 'bg-red-50 text-red-700',
                          wallet.status === 'closed' && 'bg-gray-50 text-gray-700'
                        )}>
                          {wallet.status.charAt(0).toUpperCase() + wallet.status.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            dispatch(setSelectedWallet(wallet));
                            dispatch(setIsAdjustmentOpen(true));
                          }}
                        >
                          <Plus className="h-4 w-4 sm:mr-2" />
                          <span className="hidden sm:inline">Adjustment</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {selectedWallet && (
        <AdjustmentDialog
          wallet={selectedWallet}
          open={isAdjustmentOpen}
          onOpenChange={(open) => dispatch(setIsAdjustmentOpen(open))}
          onSubmit={handleAdjustment}
        />
      )}
    </div>
  );
}