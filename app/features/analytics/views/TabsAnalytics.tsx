"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatNumber, formatMoney } from "@/lib/format";
import {
  Eye,
  Users,
  Heart,
  DollarSign,
  TrendingUp,
  ArrowUpDown,
  Search,
  ArrowLeft,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  setSearch,
  setSortField,
  setSortDirection,
  setSelectedTab,
} from "@/app/features/analytics/redux/analyticsSlice";
import { AnalyticsTabs } from "@/app/features/analytics/components/AnalyticsTabs";

const COLORS = ["#FF0000", "#FF3333", "#FF6666", "#FF9999", "#FFCCCC"];

interface DemographicsEntry {
  type: string;
  percentage: number;
}

interface LocationEntry {
  country: string;
  percentage: number;
}

interface TabMetrics {
  trend: Array<{
    date: string;
    views: number;
    users: number;
    engagement: number;
    revenue: number;
  }>;
  demographics: {
    age: Array<{ group: string; percentage: number }>;
    gender: DemographicsEntry[];
    location: LocationEntry[];
  };
}

interface Tab {
  id: string;
  name: string;
  views: number;
  users: number;
  engagement: number;
  revenue: number;
  trend: string;
  metrics: TabMetrics;
}

// Mock data for tabs list
const tabsData: Tab[] = [
  {
    id: "tab1",
    name: "Following",
    views: 150000,
    users: 75000,
    engagement: 45000,
    revenue: 12500,
    trend: "+15.2%",
    metrics: {
      trend: Array.from({ length: 7 }, (_, i) => ({
        date: new Date(
          Date.now() - i * 24 * 60 * 60 * 1000
        ).toLocaleDateString(),
        views: Math.floor(Math.random() * 25000) + 15000,
        users: Math.floor(Math.random() * 12000) + 8000,
        engagement: Math.floor(Math.random() * 8000) + 4000,
        revenue: Math.floor(Math.random() * 2500) + 1500,
      })).reverse(),
      demographics: {
        age: [
          { group: "18-24", percentage: 35 },
          { group: "25-34", percentage: 40 },
          { group: "35-44", percentage: 15 },
          { group: "45-54", percentage: 7 },
          { group: "55+", percentage: 3 },
        ],
        gender: [
          { type: "Male", percentage: 55 },
          { type: "Female", percentage: 45 },
        ],
        location: [
          { country: "Lebanon", percentage: 45 },
          { country: "UAE", percentage: 25 },
          { country: "KSA", percentage: 15 },
          { country: "Qatar", percentage: 10 },
          { country: "Other", percentage: 5 },
        ],
      },
    },
  },
  // ... other tabs data
];

type SortField = "name" | "views" | "users" | "engagement" | "revenue";

export function TabsAnalytics() {
  const dispatch = useAppDispatch();
  const { search, sortField, sortDirection, selectedTab } = useAppSelector(
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

  const filteredTabs = tabsData
    .filter((tab) => tab.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const direction = sortDirection === "asc" ? 1 : -1;
      if (sortField === "name") {
        return direction * a.name.localeCompare(b.name);
      }
      const key = sortField as keyof typeof a;
      const aValue = a[key];
      const bValue = b[key];
      if (typeof aValue === "number" && typeof bValue === "number") {
        return direction * (aValue - bValue);
      }
      return 0;
    });

  // If a specific tab is selected, show its detailed analytics
  if (selectedTab) {
    return (
      <div className="space-y-6 mt-6">
        <Button
          variant="ghost"
          onClick={() => dispatch(setSelectedTab(null))}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Tabs
        </Button>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Card className="p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-red-100 flex items-center justify-center">
                <Eye className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Views</p>
                <p className="text-xl sm:text-2xl font-bold">
                  {formatNumber(selectedTab.views)}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Users className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Active Users</p>
                <p className="text-xl sm:text-2xl font-bold">
                  {formatNumber(selectedTab.users)}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-purple-100 flex items-center justify-center">
                <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Engagement</p>
                <p className="text-xl sm:text-2xl font-bold">
                  {formatNumber(selectedTab.engagement)}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-green-100 flex items-center justify-center">
                <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Revenue</p>
                <p className="text-xl sm:text-2xl font-bold">
                  {formatMoney(selectedTab.revenue)}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Performance Chart */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-6">Performance Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={selectedTab.metrics.trend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                axisLine={true}
                tickLine={true}
                fontSize={12}
                padding={{ left: 10, right: 10 }}
              />
              <YAxis 
                yAxisId="left"
                axisLine={true}
                tickLine={true}
                fontSize={12}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                axisLine={true}
                tickLine={true}
                fontSize={12}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  padding: '8px'
                }}
              />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="views"
                name="Views"
                stroke="#FF0000"
                strokeWidth={2}
                dot={false}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="users"
                name="Users"
                stroke="#FF3333"
                strokeWidth={2}
                dot={false}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="engagement"
                name="Engagement"
                stroke="#FF6666"
                strokeWidth={2}
                dot={false}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                stroke="#FF9999"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Demographics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-4 sm:p-6">
            <h2 className="text-lg font-semibold mb-4 sm:mb-6">Age Distribution</h2>
            <div className="h-[250px] sm:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={selectedTab.metrics.demographics.age}
                  layout="vertical"
                  margin={{ top: 0, right: 30, bottom: 0, left: 40 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis
                    type="number"
                    axisLine={true}
                    tickLine={true}
                    fontSize={12}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <YAxis
                    dataKey="group"
                    type="category"
                    axisLine={false}
                    tickLine={false}
                    width={40}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    formatter={(value: number) => [`${value}%`, "Percentage"]}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      padding: '8px'
                    }}
                  />
                  <Bar
                    dataKey="percentage"
                    fill="#FF0000"
                    radius={[0, 4, 4, 0]}
                    barSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-4 sm:p-6">
            <h2 className="text-lg font-semibold mb-4 sm:mb-6">Gender Distribution</h2>
            <div className="h-[250px] sm:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={selectedTab.metrics.demographics.gender}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="percentage"
                    nameKey="type"
                    label={({ type, percentage }) => `${type}: ${percentage}%`}
                    labelLine={false}
                  >
                    {selectedTab.metrics.demographics.gender.map(
                      (entry: DemographicsEntry, index: number) => (
                        <Cell
                          key={entry.type}
                          fill={COLORS[index % COLORS.length]}
                        />
                      )
                    )}
                  </Pie>
                  <Tooltip
                    formatter={(value: number, name: string) => [`${value}%`, name]}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      padding: '8px'
                    }}
                  />
                  <Legend
                    formatter={(value) => {
                      const entry = selectedTab.metrics.demographics.gender.find(
                        (item: DemographicsEntry) => item.type === value
                      );
                      return entry ? `${entry.type}: ${entry.percentage}%` : value;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-4 sm:p-6">
            <h2 className="text-lg font-semibold mb-4 sm:mb-6">Geographic Distribution</h2>
            <div className="h-[250px] sm:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={selectedTab.metrics.demographics.location}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="percentage"
                    nameKey="country"
                    label={({ country, percentage }) => `${country}: ${percentage}%`}
                    labelLine={false}
                  >
                    {selectedTab.metrics.demographics.location.map(
                      (entry: LocationEntry, index: number) => (
                        <Cell
                          key={entry.country}
                          fill={COLORS[index % COLORS.length]}
                        />
                      )
                    )}
                  </Pie>
                  <Tooltip
                    formatter={(value: number, name: string) => [`${value}%`, name]}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      padding: '8px'
                    }}
                  />
                  <Legend
                    formatter={(value) => {
                      const entry = selectedTab.metrics.demographics.location.find(
                        (item: LocationEntry) => item.country === value
                      );
                      return entry ? `${entry.country}: ${entry.percentage}%` : value;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Show the list of all tabs
  return (
    <div className="space-y-6 mt-6">
      <div className="flex items-center justify-between">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search tabs..."
            value={search}
            onChange={(e) => dispatch(setSearch(e.target.value))}
            className="pl-9"
          />
        </div>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("name")}
                >
                  Tab Name
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("views")}
                >
                  <Eye className="h-4 w-4" />
                  Views
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
                  onClick={() => handleSort("engagement")}
                >
                  <Heart className="h-4 w-4" />
                  Engagement
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
              <TableHead>Trend</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTabs.map((tab) => (
              <TableRow
                key={tab.id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => dispatch(setSelectedTab(tab))}
              >
                <TableCell className="font-medium">{tab.name}</TableCell>
                <TableCell>{formatNumber(tab.views)}</TableCell>
                <TableCell>{formatNumber(tab.users)}</TableCell>
                <TableCell>{formatNumber(tab.engagement)}</TableCell>
                <TableCell>{formatMoney(tab.revenue)}</TableCell>
                <TableCell className="text-emerald-600">
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    {tab.trend}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
