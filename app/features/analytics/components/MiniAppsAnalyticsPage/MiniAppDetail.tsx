"use client"

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, DollarSign, Clock, TrendingUp } from 'lucide-react';
import { formatMoney, formatNumber } from '@/lib/format';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from 'recharts';

const COLORS = ['#FF0000', '#FF3333', '#FF6666', '#FF9999', '#FFCCCC'];

interface MiniAppDetailProps {
  app: {
    name: string;
    users: number;
    revenue: number;
    timeSpent: string;
  };
  onBack: () => void;
}

// Mock data for the detailed view
const monthlyData = [
  { month: 'Jan', users: 95000, revenue: 380000, timeSpent: 6.5 },
  { month: 'Feb', users: 100000, revenue: 400000, timeSpent: 6.8 },
  { month: 'Mar', users: 105000, revenue: 420000, timeSpent: 7.0 },
  { month: 'Apr', users: 110000, revenue: 440000, timeSpent: 7.2 },
  { month: 'May', users: 115000, revenue: 460000, timeSpent: 7.5 },
  { month: 'Jun', users: 120000, revenue: 480000, timeSpent: 7.8 },
];

const ageData = [
  { age: '18-24', percentage: 25 },
  { age: '25-34', percentage: 35 },
  { age: '35-44', percentage: 20 },
  { age: '45-54', percentage: 15 },
  { age: '55+', percentage: 5 },
];

const genderData = [
  { name: 'Male', value: 55 },
  { name: 'Female', value: 45 },
];

const countryData = [
  { name: 'Lebanon', value: 45 },
  { name: 'UAE', value: 25 },
  { name: 'KSA', value: 15 },
  { name: 'Qatar', value: 10 },
  { name: 'Other', value: 5 },
];

export function MiniAppDetail({ app, onBack }: MiniAppDetailProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Apps
        </Button>
        <h1 className="text-2xl font-bold">{app.name} Analytics</h1>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Monthly Active Users</p>
              <p className="text-2xl font-bold">{formatNumber(app.users)}</p>
              <p className="text-sm text-emerald-600 flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                +12.5% from last month
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Monthly Revenue</p>
              <p className="text-2xl font-bold">{formatMoney(app.revenue)}</p>
              <p className="text-sm text-emerald-600 flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                +8.3% from last month
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Avg Time Spent</p>
              <p className="text-2xl font-bold">{app.timeSpent}</p>
              <p className="text-sm text-emerald-600 flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                +5.2% from last month
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Retention Rate</p>
              <p className="text-2xl font-bold">68.5%</p>
              <p className="text-sm text-emerald-600 flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                +3.2% from last month
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Growth Charts */}
      <div className="grid grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-6">User Growth</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" scale="auto" padding={{ left: 10, right: 10 }} />
              <YAxis />
              <Tooltip formatter={(value) => formatNumber(value as number)} />
              <Legend />
              <Line
                type="monotone"
                dataKey="users"
                name="Users"
                stroke="#FF0000"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-6">Revenue Growth</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => formatMoney(value as number)} />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                stroke="#FF0000"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Demographics */}
      <div className="grid grid-cols-3 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-6">Age Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ageData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" />
              <YAxis dataKey="age" type="category" width={80} />
              <Tooltip formatter={(value) => `${value}%`} />
              <Bar dataKey="percentage" fill="#FF0000" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-6">Gender Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={genderData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {genderData.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-6">Geographic Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={countryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {countryData.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}