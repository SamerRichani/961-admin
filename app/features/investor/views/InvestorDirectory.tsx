"use client"

import { useCallback, useMemo, useState, useEffect } from 'react';
import { ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import {
  setSortField,
  setSearch,
  setInvestors,
} from '@/app/features/investor/redux/investorsSlice';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatMoney, formatDate } from '@/lib/format';
import { InvestorTabs } from '@/app/features/investor/components/InvestorTabs';
import { Investor } from '../types';
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const API_BASE_URL = 'http://localhost:3001/api/investor/directory';

export function InvestorDirectory() {
  const dispatch = useDispatch();
  const { investors, search, sortField, sortDirection } = useSelector((state: RootState) => state.investors);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInvestors = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}`);
        if (!response.ok) {
          throw new Error('Failed to fetch investors');
        }
        const data = await response.json();
        const formattedInvestors = data.map((investor: any) => ({
          id: investor._id,
          name: investor.name,
          totalShares: investor.totalShares,
          averagePrice: investor.averagePrice,
          totalInvestment: investor.totalInvestment,
          joinDate: investor.joinDate,
        }));
        dispatch(setInvestors(formattedInvestors));
      } catch (error) {
        console.error('Failed to fetch investors:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvestors();
  }, [dispatch]);

  const handleSort = useCallback((field: typeof sortField) => {
    dispatch(setSortField(field));
  }, [dispatch, sortField]);

  const sortedInvestors = useMemo(() => 
    [...investors]
      .filter(investor => investor.name.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => {
        const direction = sortDirection === 'asc' ? 1 : -1;
        switch (sortField) {
          case 'name':
            return direction * a.name.localeCompare(b.name);
          case 'shares':
            return direction * (a.totalShares - b.totalShares);
          case 'investment':
            return direction * (a.totalInvestment - b.totalInvestment);
          case 'joinDate':
            return direction * (new Date(a.joinDate).getTime() - new Date(b.joinDate).getTime());
          default:
            return 0;
        }
      }),
    [investors, search, sortField, sortDirection]
  );

  const renderSortIcon = useCallback((field: typeof sortField) => (
    <ArrowUpDown 
      className={cn(
        "inline h-3 w-3 sm:h-4 sm:w-4 ml-1",
        sortField === field && sortDirection === 'desc' && "transform rotate-180"
      )} 
    />
  ), [sortField, sortDirection]);

  if (isLoading) {
    return (
      <div className="w-full mt-6 p-6 text-center">
        Loading investors...
      </div>
    );
  }

  return (
    <div className="w-full mt-6">
      <div className="p-3 sm:p-6">
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  onClick={() => handleSort('name')} 
                  className="cursor-pointer hover:bg-gray-50 transition-colors text-xs sm:text-sm whitespace-nowrap"
                >
                  Name {renderSortIcon('name')}
                </TableHead>
                <TableHead 
                  onClick={() => handleSort('shares')} 
                  className="cursor-pointer hover:bg-gray-50 transition-colors text-xs sm:text-sm whitespace-nowrap"
                >
                  Total Shares {renderSortIcon('shares')}
                </TableHead>
                <TableHead className="text-xs sm:text-sm whitespace-nowrap">
                  Avg. Price
                </TableHead>
                <TableHead 
                  onClick={() => handleSort('investment')} 
                  className="cursor-pointer hover:bg-gray-50 transition-colors text-xs sm:text-sm whitespace-nowrap"
                >
                  Total Investment {renderSortIcon('investment')}
                </TableHead>
                <TableHead 
                  onClick={() => handleSort('joinDate')} 
                  className="cursor-pointer hover:bg-gray-50 transition-colors text-xs sm:text-sm whitespace-nowrap"
                >
                  Join Date {renderSortIcon('joinDate')}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedInvestors.map((investor) => (
                <TableRow key={investor.id}>
                  <TableCell className="text-xs sm:text-sm">
                    <div className="font-medium">{investor.name}</div>
                  </TableCell>
                  <TableCell className="text-xs sm:text-sm">{investor.totalShares.toLocaleString()}</TableCell>
                  <TableCell className="text-xs sm:text-sm">{formatMoney(investor.averagePrice)}</TableCell>
                  <TableCell className="text-xs sm:text-sm">{formatMoney(investor.totalInvestment)}</TableCell>
                  <TableCell className="text-xs sm:text-sm">{formatDate(investor.joinDate)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}