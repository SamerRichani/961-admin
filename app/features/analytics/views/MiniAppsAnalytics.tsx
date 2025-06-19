"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatMoney, formatNumber } from "@/lib/format";
import { Users, DollarSign, Clock, ArrowUpDown } from "lucide-react";
import { useMemo } from "react";
import { MiniAppDetail } from "@/app/features/analytics/components/MiniAppsAnalyticsPage/MiniAppDetail";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  setSortField,
  setSortDirection,
  setSelectedApp,
} from "@/app/features/analytics/redux/analyticsSlice";
import { AnalyticsTabs } from "@/app/features/analytics/components/AnalyticsTabs";

const apps = [
  { name: "News", users: 125000, revenue: 450000, timeSpent: "7.5m" },
  { name: "Deals", users: 95000, revenue: 350000, timeSpent: "6m" },
  { name: "Pulse", users: 85000, revenue: 250000, timeSpent: "5m" },
  { name: "Blood", users: 45000, revenue: 50000, timeSpent: "3m" },
  { name: "Merch", users: 65000, revenue: 350000, timeSpent: "4m" },
  { name: "Jobs", users: 55000, revenue: 150000, timeSpent: "3.5m" },
  { name: "Invest", users: 35000, revenue: 200000, timeSpent: "2.5m" },
  { name: "Weather", users: 75000, revenue: 25000, timeSpent: "2m" },
];

type SortField = "name" | "users" | "revenue" | "timeSpent";

export function MiniAppsAnalytics() {
  const dispatch = useAppDispatch();
  const { sortField, sortDirection, selectedApp } = useAppSelector(
    (state) => state.analytics
  );

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      dispatch(setSortDirection(sortDirection === "asc" ? "desc" : "asc"));
    } else {
      dispatch(setSortField(field));
      dispatch(setSortDirection("desc"));
    }
  };

  const sortedApps = useMemo(() => {
    return [...apps].sort((a, b) => {
      const direction = sortDirection === "asc" ? 1 : -1;

      switch (sortField) {
        case "name":
          return direction * a.name.localeCompare(b.name);
        case "users":
          return direction * (a.users - b.users);
        case "revenue":
          return direction * (a.revenue - b.revenue);
        case "timeSpent":
          return (
            direction * (parseFloat(a.timeSpent) - parseFloat(b.timeSpent))
          );
        default:
          return 0;
      }
    });
  }, [sortField, sortDirection]);

  if (selectedApp) {
    return (
      <MiniAppDetail
        app={selectedApp}
        onBack={() => dispatch(setSelectedApp(null))}
      />
    );
  }

  return (
    <AnalyticsTabs>
      <div>
        <h2 className="text-lg font-semibold mb-4">Mini Apps Analytics</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("name")}
                >
                  App Name
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("users")}
                >
                  <Users className="h-4 w-4" />
                  Users
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("revenue")}
                >
                  <DollarSign className="h-4 w-4" />
                  Revenue
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("timeSpent")}
                >
                  <Clock className="h-4 w-4" />
                  Time Spent
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedApps.map((app) => (
              <TableRow
                key={app.name}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => dispatch(setSelectedApp(app))}
              >
                <TableCell className="font-medium">{app.name}</TableCell>
                <TableCell>{formatNumber(app.users)}</TableCell>
                <TableCell>{formatMoney(app.revenue)}</TableCell>
                <TableCell>{app.timeSpent}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AnalyticsTabs>
  );
}
