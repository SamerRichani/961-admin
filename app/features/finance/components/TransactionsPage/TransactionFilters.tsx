import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { transactionConfig, type TransactionType } from '@/app/features/finance/type';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setSearch, setDateRange, setSelectedTypes } from '@/app/features/finance/redux/transactionsSlice';

export function TransactionFilters() {
  const dispatch = useAppDispatch();
  const { search, dateRange, selectedTypes } = useAppSelector((state) => state.transactions);

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1 max-w-sm w-full">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search transactions..."
          value={search}
          onChange={(e) => dispatch(setSearch(e.target.value))}
          className="pl-9 w-full"
        />
      </div>

      <div className="flex gap-4 sm:flex-none">
        <Select value={dateRange} onValueChange={(value) => dispatch(setDateRange(value))}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Date range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
            <SelectItem value="all">All Time</SelectItem>
          </SelectContent>
        </Select>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Filter</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48">
            {Object.entries(transactionConfig).map(([type, config]) => (
              <DropdownMenuCheckboxItem
                key={type}
                checked={selectedTypes.includes(type as TransactionType)}
                onCheckedChange={(checked: boolean) => {
                  dispatch(setSelectedTypes(
                    checked
                      ? [...selectedTypes, type as TransactionType]
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
  );
}