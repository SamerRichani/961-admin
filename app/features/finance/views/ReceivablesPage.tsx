"use client"

import { useCallback, useState, useEffect } from 'react';
import { Search, Download, Filter, DollarSign } from 'lucide-react';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PaymentDialog } from '@/app/features/finance/components/ReceivablesPage/PaymentDialog';
import { receivableConfig, receivableStatusColors, type ReceivableType, type Receivable, type ReceivableStatus } from '@/app/features/finance/type';
import { format } from 'date-fns';
import { formatMoney } from '@/lib/format';
import { cn } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  setSearchTerm,
  setSelectedTypes,
  setSortField,
  setSortDirection,
  setReceivables,
  addPayment,
  updateReceivableStatus,
} from '@/app/features/finance/redux/receivablesSlice';

export function ReceivablesPage() {
  const dispatch = useAppDispatch();
  const {
    receivables,
    searchTerm,
    selectedTypes,
    sortField,
    sortDirection,
  } = useAppSelector((state) => state.receivables);

  const [selectedReceivable, setSelectedReceivable] = useState<Receivable | null>(null);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReceivables = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/finance/receivables`);
        const data = await response.json();
        
        if (Array.isArray(data)) {
          const transformedReceivables = data.map((item: any) => ({
            id: item._id,
            type: item.type === 'business' ? 'advertiser' : item.type as ReceivableType,
            entityId: item.entityId,
            entityName: item.entityName,
            amount: Number(item.amount) || 0,
            dueDate: item.dueDate,
            invoiceDate: item.dueDate,
            status: item.status,
            description: item.description,
            paymentHistory: item.paymentDetails?.payments?.map((payment: any) => ({
              id: payment._id,
              date: payment.date,
              amount: Number(payment.amount) || 0,
              method: payment.method || 'cash',
              reference: payment.reference,
            })) || [],
            cashCollection: item.paymentDetails?.collectorName ? {
              status: item.paymentDetails.status || 'pending_pickup',
              collectorName: item.paymentDetails.collectorName,
              pickupDate: item.paymentDetails.pickedUpDate,
              deliveryDate: item.paymentDetails.paidDate,
              confirmationDate: item.paymentDetails.paidDate,
            } : undefined,
          }));
          
          dispatch(setReceivables(transformedReceivables));
        }
      } catch (error) {
        console.error('Error fetching receivables:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReceivables();
  }, [dispatch, searchTerm, selectedTypes, sortField, sortDirection]);

  const handleSort = (field: 'dueDate' | 'amount' | 'entityName') => {
    if (sortField === field) {
      dispatch(setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc'));
    } else {
      dispatch(setSortField(field));
      dispatch(setSortDirection('asc'));
    }
  };

  const getAmountPaid = (receivable: Receivable) => 
    receivable.paymentHistory.reduce((sum, payment) => sum + payment.amount, 0);

  const filteredReceivables = receivables
    .filter(receivable => {
      const matchesSearch = 
        receivable.entityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        receivable.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(receivable.type);

      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      const direction = sortDirection === 'asc' ? 1 : -1;
      switch (sortField) {
        case 'dueDate':
          return direction * (new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
        case 'amount':
          return direction * ((a.amount - getAmountPaid(a)) - (b.amount - getAmountPaid(b)));
        case 'entityName':
          return direction * a.entityName.localeCompare(b.entityName);
        default:
          return 0;
      }
    });

  const handlePayment = useCallback((receivableId: string, amount: number, status: string, collectorName: string) => {
    const receivable = receivables.find(r => r.id === receivableId);
    if (!receivable) return;

    const payment = {
      id: `PAY-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      amount,
      method: 'cash',
      reference: `PAY-${Date.now()}`,
    };

    dispatch(addPayment({ 
      id: receivableId, 
      payment,
      status: status as ReceivableStatus,
    }));

    // If there's a collector, update cash collection details
    if (collectorName) {
      const updatedReceivable = {
        ...receivable,
        cashCollection: {
          status: 'pending_pickup',
          collectorName,
          pickupDate: new Date().toISOString().split('T')[0],
          deliveryDate: undefined,
          confirmationDate: undefined,
        },
      };
      dispatch(updateReceivableStatus({ id: receivableId, status: 'pending_pickup' }));
    }
  }, [dispatch, receivables]);

  const totalReceivables = filteredReceivables.reduce((sum, r) => sum + (r.amount - getAmountPaid(r)), 0);
  const overdueAmount = filteredReceivables
    .filter(r => r.status === 'overdue')
    .reduce((sum, r) => sum + (r.amount - getAmountPaid(r)), 0);

  const handleExport = () => {
    const headers = [
      "Entity Name",
      "Type",
      "Amount",
      "Due Date",
      "Status",
      "Description",
      "Amount Paid",
      "Remaining Amount",
      "Payment History"
    ];

    const formatStatus = (status: string) => {
      return status.split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    };

    const formatType = (type: string) => {
      return type.charAt(0).toUpperCase() + type.slice(1);
    };

    const formatPaymentHistory = (payments: any[]) => {
      return payments.map(p => `${new Date(p.date).toLocaleDateString()}: ${formatMoney(p.amount)}`).join('; ');
    };

    const csvContent = [
      headers.join(","),
      ...filteredReceivables.map((receivable) =>
        [
          `"${receivable.entityName}"`,
          formatType(receivable.type),
          formatMoney(receivable.amount),
          new Date(receivable.dueDate).toLocaleDateString(),
          formatStatus(receivable.status),
          `"${receivable.description || ''}"`,
          formatMoney(getAmountPaid(receivable)),
          formatMoney(receivable.amount - getAmountPaid(receivable)),
          `"${formatPaymentHistory(receivable.paymentHistory)}"`
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "receivables_analytics.csv";
    link.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-[2000px] mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <h1 className="text-2xl font-semibold">Receivables</h1>
          <Button onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                    <DollarSign className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-gray-500">Total Receivables</p>
                    <p className="text-2xl font-bold truncate">{formatMoney(totalReceivables)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                    <DollarSign className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-gray-500">Overdue Amount</p>
                    <p className="text-2xl font-bold truncate">{formatMoney(overdueAmount)}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 sm:p-6 border-b">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1 max-w-sm w-full">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search receivables..."
                      value={searchTerm}
                      onChange={(e) => dispatch(setSearchTerm(e.target.value))}
                      className="pl-9 w-full"
                    />
                  </div>

                  <div className="flex gap-4 sm:flex-none">
                    <Select 
                      value={sortField || ''} 
                      onValueChange={(value: 'dueDate' | 'amount' | 'entityName') => handleSort(value)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dueDate">Due Date</SelectItem>
                        <SelectItem value="amount">Amount</SelectItem>
                        <SelectItem value="entityName">Entity Name</SelectItem>
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
                        {Object.entries(receivableConfig).map(([type, config]) => (
                          <DropdownMenuCheckboxItem
                            key={type}
                            checked={selectedTypes.includes(type as ReceivableType)}
                            onCheckedChange={(checked: boolean) => {
                              dispatch(setSelectedTypes(
                                checked
                                  ? [...selectedTypes, type as ReceivableType]
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
                      <TableHead className="hidden sm:table-cell">Description</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Balance</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReceivables.map((receivable) => {
                      const config = receivableConfig[receivable.type];
                      const Icon = config.icon;
                      
                      return (
                        <TableRow key={receivable.id}>
                          <TableCell>
                            <div className="font-medium truncate max-w-[150px] sm:max-w-none">
                              {receivable.entityName}
                            </div>
                            {receivable.invoiceNumber && (
                              <div className="text-sm text-gray-500 truncate">
                                {receivable.invoiceNumber}
                              </div>
                            )}
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
                          <TableCell className="hidden sm:table-cell">
                            <div className="max-w-xs truncate">
                              {receivable.description}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="whitespace-nowrap">
                              {format(new Date(receivable.dueDate), 'MMM d, yyyy')}
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className={cn(
                              'px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap',
                              receivableStatusColors[receivable.status].bg,
                              receivableStatusColors[receivable.status].text
                            )}>
                              {receivable.status.split('_').map(word => 
                                word.charAt(0).toUpperCase() + word.slice(1)
                              ).join(' ')}
                            </span>
                            {receivable.cashCollection?.collectorName && (
                              <div className="text-xs text-gray-500 mt-1 truncate">
                                Collector: {receivable.cashCollection.collectorName}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="whitespace-nowrap">
                              {formatMoney(receivable.amount - getAmountPaid(receivable))}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedReceivable(receivable);
                                setIsPaymentDialogOpen(true);
                              }}
                            >
                              <span className="hidden sm:inline">Record Payment</span>
                              <span className="sm:hidden">Pay</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          </>
        )}
      </div>

      {selectedReceivable && (
        <PaymentDialog
          receivable={selectedReceivable}
          open={isPaymentDialogOpen}
          onOpenChange={setIsPaymentDialogOpen}
          onSubmit={handlePayment}
        />
      )}
    </div>
  );
}