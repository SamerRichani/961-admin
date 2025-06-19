"use client";

import { useCallback, useEffect } from "react";
import { Search, Download, Filter, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ShippingLabelDialog } from "../components/PayablesPage/ShippingLabelDialog";
import {
  payableConfig,
  statusColors,
  type PayableType,
} from "@/app/features/finance/type";
import { format } from "date-fns";
import { formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  setSearch,
  setSelectedTypes,
  setSortField,
  setSortOrder,
  setSelectedPayable,
  setIsShippingLabelOpen,
  setPayables,
} from "@/app/features/finance/redux/payablesSlice";

export function PayablesPage() {
  const dispatch = useAppDispatch();
  const {
    payables,
    search,
    selectedTypes,
    sortField,
    sortOrder,
    selectedPayable,
    isShippingLabelOpen,
  } = useAppSelector((state) => state.payables);

  useEffect(() => {
    const fetchPayables = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/finance/payables`);
        const data = await response.json();
        
        if (Array.isArray(data)) {
          const transformedPayables = data.map((item: any) => ({
            id: item._id,
            type: item.type,
            entityId: item.entityId,
            entityName: item.entityName,
            amount: Number(item.amount) || 0,
            dueDate: item.dueDate,
            status: item.status,
            paymentMethod: item.paymentMethod,
            description: item.description,
            paymentDetails: item.paymentDetails ? {
              readyDate: item.paymentDetails.readyDate,
              pickedUpDate: item.paymentDetails.pickedUpDate,
              paidDate: item.paymentDetails.paidDate,
              collectorName: item.paymentDetails.collectorName,
              reference: item.paymentDetails.reference,
            } : undefined,
          }));
          
          dispatch(setPayables(transformedPayables));
        }
      } catch (error) {
        console.error('Error fetching payables:', error);
      }
    };

    fetchPayables();
  }, [dispatch]);

  const handleSort = (field: "dueDate" | "amount" | "entityName") => {
    if (sortField === field) {
      dispatch(setSortOrder(sortOrder === "asc" ? "desc" : "asc"));
    } else {
      dispatch(setSortField(field));
      dispatch(setSortOrder("asc"));
    }
  };

  const handlePrintLabel = useCallback(() => {
    if (!selectedPayable) return;
    // TODO: Implement label printing
    console.log("Printing label for payable:", selectedPayable.id);
  }, [selectedPayable]);

  const handleExport = () => {
    const headers = [
      "Entity Name",
      "Type",
      "Amount",
      "Due Date",
      "Status",
      "Payment Method",
      "Description",
      "Payment Details"
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

    const formatPaymentMethod = (method: string | undefined) => {
      if (!method) return 'N/A';
      return method.split('_')
        .map(word => {
          // Special case for "COD"
          if (word.toUpperCase() === 'COD') return 'COD';
          // Special case for "Bank Transfer"
          if (word.toLowerCase() === 'bank') return 'Bank';
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join(' ');
    };

    const formatPaymentDetails = (details: any) => {
      if (!details) return 'N/A';
      const parts = [];
      if (details.readyDate) parts.push(`Ready: ${formatDate(details.readyDate)}`);
      if (details.pickedUpDate) parts.push(`Picked Up: ${formatDate(details.pickedUpDate)}`);
      if (details.paidDate) parts.push(`Paid: ${formatDate(details.paidDate)}`);
      if (details.collectorName) parts.push(`Collector: ${details.collectorName}`);
      if (details.reference) parts.push(`Reference: ${details.reference}`);
      return parts.join(' | ');
    };

    const csvContent = [
      // Headers
      headers.map(header => `"${header}"`).join(','),
      // Data rows
      ...payables.map((payable) => {
        const row = [
          payable.entityName,
          formatType(payable.type),
          formatMoney(payable.amount),
          formatDate(payable.dueDate),
          formatStatus(payable.status),
          formatPaymentMethod(payable.paymentMethod),
          payable.description || 'N/A',
          formatPaymentDetails(payable.paymentDetails)
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
    link.download = `payables_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const filteredPayables = payables
    .filter((payable) => {
      const matchesSearch =
        payable.entityName.toLowerCase().includes(search.toLowerCase()) ||
        payable.description?.toLowerCase().includes(search.toLowerCase());

      const matchesType =
        selectedTypes.length === 0 || selectedTypes.includes(payable.type);

      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      const direction = sortOrder === "asc" ? 1 : -1;
      switch (sortField) {
        case "dueDate":
          return (
            direction *
            (new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
          );
        case "amount":
          return direction * (a.amount - b.amount);
        case "entityName":
          return direction * a.entityName.localeCompare(b.entityName);
        default:
          return 0;
      }
    });

  const totalPayables = filteredPayables.reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = filteredPayables
    .filter((p) => p.status === "pending")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-[2000px] mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <h1 className="text-2xl font-semibold">Payables</h1>
          <Button onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-gray-500">Total Payables</p>
                <p className="text-2xl font-bold truncate">
                  {formatMoney(totalPayables)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <DollarSign className="h-6 w-6 text-red-600" />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-gray-500">Pending Amount</p>
                <p className="text-2xl font-bold truncate">
                  {formatMoney(pendingAmount)}
                </p>
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
                  placeholder="Search payables..."
                  value={search}
                  onChange={(e) => dispatch(setSearch(e.target.value))}
                  className="pl-9 w-full"
                />
              </div>

              <div className="flex gap-4 sm:flex-none">
                <Select
                  value={sortField}
                  onValueChange={(value: any) =>
                    handleSort(value as typeof sortField)
                  }
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
                    {Object.entries(payableConfig).map(([type, config]) => (
                      <DropdownMenuCheckboxItem
                        key={type}
                        checked={selectedTypes.includes(type as PayableType)}
                        onCheckedChange={(checked: boolean) => {
                          dispatch(
                            setSelectedTypes(
                              checked
                                ? [...selectedTypes, type as PayableType]
                                : selectedTypes.filter((t) => t !== type)
                            )
                          );
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
                  <TableHead className="hidden sm:table-cell">
                    Description
                  </TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayables.map((payable) => {
                  const config = payableConfig[payable.type];
                  const Icon = config.icon;

                  return (
                    <TableRow key={payable.id}>
                      <TableCell>
                        <div className="font-medium truncate max-w-[150px] sm:max-w-none">
                          {payable.entityName}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div
                            className={cn(
                              "p-1 rounded shrink-0",
                              config.color.bg
                            )}
                          >
                            <Icon
                              className={cn("h-4 w-4", config.color.text)}
                            />
                          </div>
                          <span className="hidden sm:inline">
                            {config.label}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="max-w-xs truncate">
                          {payable.description}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="whitespace-nowrap">
                          {format(new Date(payable.dueDate), "MMM d, yyyy")}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            "px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap",
                            statusColors[payable.status].bg,
                            statusColors[payable.status].text
                          )}
                        >
                          {payable.status
                            .split("_")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                            )
                            .join(" ")}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="whitespace-nowrap">
                          {formatMoney(payable.amount)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            dispatch(setSelectedPayable(payable));
                            dispatch(setIsShippingLabelOpen(true));
                          }}
                        >
                          <span className="hidden sm:inline">
                            Shipping Label
                          </span>
                          <span className="sm:hidden">Label</span>
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

      {selectedPayable && (
        <ShippingLabelDialog
          payable={selectedPayable}
          open={isShippingLabelOpen}
          onOpenChange={(open) => dispatch(setIsShippingLabelOpen(open))}
          onPrint={handlePrintLabel}
        />
      )}
    </div>
  );
}
